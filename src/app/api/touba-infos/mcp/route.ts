import {
  createMcpHandler,
  getOAuthProtectedResourceMetadataUrl,
  hostHeaderValidationResponse,
  originValidationResponse,
  requireBearerAuth,
} from "@modelcontextprotocol/server";
import { revalidatePath } from "next/cache";
import {
  createPublisherTokenVerifier,
  getMcpResourceUrl,
  getPublisherOrigin,
} from "@/lib/touba-infos-mcp-auth";
import { createToubaInfosMcpServer } from "@/lib/touba-infos-mcp-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const mcpHandler = createMcpHandler(
  ({ authInfo }) =>
    createToubaInfosMcpServer({
      actorId: authInfo?.clientId,
      onMutation: () => {
        revalidatePath("/touba-infos", "layout");
        revalidatePath("/touba-infos/admin", "layout");
      },
    }),
  {
    responseMode: "json",
    onerror: (error) => {
      console.error("[touba-infos-mcp]", error.message);
    },
  },
);

function configuredHostname(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).hostname;
  } catch {
    return undefined;
  }
}

function allowedHostnames(request: Request): string[] {
  const requestHostname = new URL(request.url).hostname;
  return [
    "toubainfos.com",
    "www.toubainfos.com",
    "localhost",
    "127.0.0.1",
    configuredHostname(process.env.VERCEL_URL),
    configuredHostname(process.env.VERCEL_BRANCH_URL),
    requestHostname.endsWith(".vercel.app") ? requestHostname : undefined,
  ].filter((value): value is string => !!value);
}

async function handleMcpRequest(request: Request): Promise<Response> {
  const hostnames = allowedHostnames(request);
  const rejected =
    hostHeaderValidationResponse(request, hostnames) ??
    originValidationResponse(request, [
      ...hostnames,
      "chatgpt.com",
      "chat.openai.com",
      "openai.com",
    ]);
  if (rejected) return rejected;

  const origin = getPublisherOrigin(request);
  const resourceUrl = getMcpResourceUrl(origin);
  const authGate = requireBearerAuth({
    verifier: createPublisherTokenVerifier(origin),
    requiredScopes: ["mcp"],
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(resourceUrl),
  });
  const authInfo = await authGate(request);
  if (authInfo instanceof Response) return authInfo;
  return mcpHandler.fetch(request, { authInfo });
}

export const GET = handleMcpRequest;
export const POST = handleMcpRequest;
export const DELETE = handleMcpRequest;

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://chatgpt.com",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Authorization, Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID",
    },
  });
}
