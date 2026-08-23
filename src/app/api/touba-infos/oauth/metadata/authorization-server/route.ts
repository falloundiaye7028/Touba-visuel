import {
  getOAuthMetadata,
  getPublisherOrigin,
} from "@/lib/touba-infos-mcp-auth";

export const dynamic = "force-dynamic";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=300",
};

export function GET(request: Request) {
  return Response.json(getOAuthMetadata(getPublisherOrigin(request)), { headers });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers });
}
