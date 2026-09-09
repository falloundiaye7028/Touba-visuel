import {
  oauthErrorResponse,
  registerOAuthClient,
} from "@/lib/touba-infos-mcp-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return Response.json(
        { error: "invalid_client_metadata", error_description: "JSON requis." },
        { status: 415, headers: corsHeaders },
      );
    }
    const metadata = await request.json();
    return Response.json(registerOAuthClient(metadata), {
      status: 201,
      headers: { ...corsHeaders, "Cache-Control": "no-store" },
    });
  } catch (error) {
    return oauthErrorResponse(error);
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
