import {
  exchangeAuthorizationCode,
  getPublisherOrigin,
  oauthErrorResponse,
} from "@/lib/touba-infos-mcp-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/x-www-form-urlencoded")) {
      return Response.json(
        { error: "invalid_request", error_description: "Formulaire encodé requis." },
        { status: 415, headers: corsHeaders },
      );
    }
    const form = await request.formData();
    const result = exchangeAuthorizationCode(
      {
        grantType: String(form.get("grant_type") || ""),
        code: String(form.get("code") || ""),
        clientId: String(form.get("client_id") || ""),
        redirectUri: String(form.get("redirect_uri") || ""),
        codeVerifier: String(form.get("code_verifier") || ""),
        resource: String(form.get("resource") || ""),
      },
      getPublisherOrigin(request),
    );
    return Response.json(result, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    return oauthErrorResponse(error);
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
