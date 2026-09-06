import { createHash, randomBytes } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createAuthorizationRequestToken,
  createPublisherTokenVerifier,
  exchangeAuthorizationCode,
  getMcpResourceUrl,
  issueAuthorizationCode,
  readAuthorizationRequestToken,
  registerOAuthClient,
  validateAuthorizationRequest,
  verifyPublisherAdminPassword,
} from "@/lib/touba-infos-mcp-auth";

const previousSecret = process.env.TI_MCP_OAUTH_SECRET;
const previousPassword = process.env.TI_ADMIN_PASSWORD;

describe("Touba Infos MCP OAuth", () => {
  beforeEach(() => {
    process.env.TI_MCP_OAUTH_SECRET =
      "test-secret-with-more-than-thirty-two-characters-2026";
    process.env.TI_ADMIN_PASSWORD = "mot-de-passe-test";
  });

  afterEach(() => {
    if (previousSecret === undefined) delete process.env.TI_MCP_OAUTH_SECRET;
    else process.env.TI_MCP_OAUTH_SECRET = previousSecret;
    if (previousPassword === undefined) delete process.env.TI_ADMIN_PASSWORD;
    else process.env.TI_ADMIN_PASSWORD = previousPassword;
  });

  it("effectue le flux authorization_code avec PKCE et audience MCP", async () => {
    const origin = new URL("https://preview.toubainfos.example");
    const redirectUri = "https://chatgpt.com/connector_platform_oauth_redirect";
    const registration = registerOAuthClient({
      client_name: "ChatGPT Touba Infos",
      redirect_uris: [redirectUri],
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code"],
      response_types: ["code"],
    });
    const verifier = randomBytes(48).toString("base64url");
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    const params = new URLSearchParams({
      response_type: "code",
      client_id: registration.client_id,
      redirect_uri: redirectUri,
      code_challenge: challenge,
      code_challenge_method: "S256",
      scope: "mcp",
      resource: getMcpResourceUrl(origin).href,
      state: "state-123",
    });

    const request = validateAuthorizationRequest(params, origin);
    const requestToken = createAuthorizationRequestToken(request);
    expect(readAuthorizationRequestToken(requestToken, origin)).toEqual(request);
    const code = issueAuthorizationCode(request);
    const token = exchangeAuthorizationCode(
      {
        grantType: "authorization_code",
        code,
        clientId: registration.client_id,
        redirectUri,
        codeVerifier: verifier,
        resource: getMcpResourceUrl(origin).href,
      },
      origin,
    );
    const replay = exchangeAuthorizationCode(
      {
        grantType: "authorization_code",
        code,
        clientId: registration.client_id,
        redirectUri,
        codeVerifier: verifier,
        resource: getMcpResourceUrl(origin).href,
      },
      origin,
    );
    const authInfo = await createPublisherTokenVerifier(origin).verifyAccessToken(
      token.access_token,
    );

    expect(replay.access_token).toBe(token.access_token);
    expect(authInfo.scopes).toEqual(["mcp"]);
    expect(authInfo.resource?.href).toBe(getMcpResourceUrl(origin).href);
  });

  it("refuse un vérificateur PKCE erroné", () => {
    const origin = new URL("https://preview.toubainfos.example");
    const redirectUri = "https://chatgpt.com/connector_platform_oauth_redirect";
    const registration = registerOAuthClient({
      client_name: "ChatGPT",
      redirect_uris: [redirectUri],
    });
    const verifier = randomBytes(48).toString("base64url");
    const request = validateAuthorizationRequest(
      new URLSearchParams({
        response_type: "code",
        client_id: registration.client_id,
        redirect_uri: redirectUri,
        code_challenge: createHash("sha256")
          .update(verifier)
          .digest("base64url"),
        code_challenge_method: "S256",
        scope: "mcp",
        resource: getMcpResourceUrl(origin).href,
      }),
      origin,
    );

    expect(() =>
      exchangeAuthorizationCode(
        {
          grantType: "authorization_code",
          code: issueAuthorizationCode(request),
          clientId: registration.client_id,
          redirectUri,
          codeVerifier: randomBytes(48).toString("base64url"),
          resource: getMcpResourceUrl(origin).href,
        },
        origin,
      ),
    ).toThrow("PKCE");
  });

  it("adosse bien l’autorisation au mot de passe administrateur", () => {
    expect(verifyPublisherAdminPassword("mot-de-passe-test")).toBe(true);
    expect(verifyPublisherAdminPassword("mauvais mot de passe")).toBe(false);
  });
});
