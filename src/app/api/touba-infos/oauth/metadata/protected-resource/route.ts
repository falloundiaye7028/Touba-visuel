import {
  getMcpResourceUrl,
  getPublisherOrigin,
} from "@/lib/touba-infos-mcp-auth";

export const dynamic = "force-dynamic";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=300",
};

export function GET(request: Request) {
  const origin = getPublisherOrigin(request);
  return Response.json(
    {
      resource: getMcpResourceUrl(origin).href,
      authorization_servers: [origin.origin],
      scopes_supported: ["mcp"],
      resource_name: "Agent de publication Touba Infos",
      resource_documentation: new URL(
        "/touba-infos/politique-editoriale",
        origin,
      ).href,
    },
    { headers },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers });
}
