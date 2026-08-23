import {
  createAuthorizationRequestToken,
  getPublisherOrigin,
  issueAuthorizationCode,
  oauthErrorResponse,
  readAuthorizationRequestToken,
  validateAuthorizationRequest,
  verifyPublisherAdminPassword,
  type AuthorizationRequest,
} from "@/lib/touba-infos-mcp-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cancellationUrl(request: AuthorizationRequest): string {
  const url = new URL(request.redirectUri);
  url.searchParams.set("error", "access_denied");
  url.searchParams.set("error_description", "Autorisation refusée par l’utilisateur.");
  if (request.state) url.searchParams.set("state", request.state);
  return url.href;
}

function consentPage(
  request: AuthorizationRequest,
  requestToken: string,
  error?: string,
): Response {
  const redirectHost = new URL(request.redirectUri).hostname;
  const body = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Autoriser ChatGPT — Touba Infos</title>
    <style>
      :root { color-scheme: light; font-family: Inter, system-ui, sans-serif; }
      body { margin: 0; background: #f5f7f6; color: #17201b; }
      main { min-height: 100vh; display: grid; place-items: center; padding: 24px; box-sizing: border-box; }
      section { width: min(100%, 440px); background: white; border: 1px solid #dfe6e2; border-radius: 20px; padding: 28px; box-shadow: 0 18px 60px rgba(15, 70, 42, .09); }
      .brand { color: #08783f; font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
      h1 { margin: 10px 0 8px; font-size: 25px; line-height: 1.2; }
      p { color: #526059; line-height: 1.55; }
      ul { padding-left: 20px; color: #2f3b35; line-height: 1.55; }
      label { display: block; margin: 22px 0 8px; font-weight: 750; }
      input { width: 100%; box-sizing: border-box; border: 1px solid #bdc9c2; border-radius: 11px; padding: 13px 14px; font: inherit; }
      input:focus { outline: 3px solid rgba(8, 120, 63, .15); border-color: #08783f; }
      button { width: 100%; margin-top: 14px; border: 0; border-radius: 11px; padding: 13px 16px; background: #08783f; color: white; font: inherit; font-weight: 800; cursor: pointer; }
      .cancel { display: block; margin-top: 14px; text-align: center; color: #526059; }
      .error { border-radius: 10px; background: #fff0f0; color: #a11b1b; padding: 10px 12px; font-weight: 650; }
      .small { font-size: 12px; color: #748078; word-break: break-word; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <div class="brand">Touba Infos</div>
        <h1>Autoriser l’agent de publication</h1>
        <p><strong>${escapeHtml(request.clientName)}</strong> demande l’accès au CMS Touba Infos.</p>
        <ul>
          <li>créer et corriger des brouillons ;</li>
          <li>vérifier leur statut ;</li>
          <li>publier uniquement après votre validation explicite.</li>
        </ul>
        ${error ? `<p class="error">${escapeHtml(error)}</p>` : ""}
        <form method="post" action="/api/touba-infos/oauth/authorize">
          <input type="hidden" name="request_token" value="${escapeHtml(requestToken)}" />
          <label for="password">Mot de passe de l’administration</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
          <button type="submit">Autoriser l’accès</button>
        </form>
        <a class="cancel" href="${escapeHtml(cancellationUrl(request))}">Refuser</a>
        <p class="small">Retour sécurisé vers ${escapeHtml(redirectHost)}.</p>
      </section>
    </main>
  </body>
</html>`;
  return new Response(body, {
    status: error ? 401 : 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    },
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const origin = getPublisherOrigin(request);
    const authorizationRequest = validateAuthorizationRequest(
      url.searchParams,
      origin,
    );
    const requestToken = createAuthorizationRequestToken(authorizationRequest);
    return consentPage(authorizationRequest, requestToken);
  } catch (error) {
    return oauthErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const requestToken = String(form.get("request_token") || "");
    const authorizationRequest = readAuthorizationRequestToken(
      requestToken,
      getPublisherOrigin(request),
    );
    const password = String(form.get("password") || "");
    if (!verifyPublisherAdminPassword(password)) {
      return consentPage(
        authorizationRequest,
        requestToken,
        "Mot de passe incorrect ou accès administrateur non configuré.",
      );
    }

    const redirect = new URL(authorizationRequest.redirectUri);
    redirect.searchParams.set(
      "code",
      issueAuthorizationCode(authorizationRequest),
    );
    if (authorizationRequest.state) {
      redirect.searchParams.set("state", authorizationRequest.state);
    }
    return Response.redirect(redirect, 303);
  } catch (error) {
    return oauthErrorResponse(error);
  }
}
