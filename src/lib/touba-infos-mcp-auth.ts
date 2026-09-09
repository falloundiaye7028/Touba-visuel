import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import {
  OAuthError,
  OAuthErrorCode,
  type AuthInfo,
  type OAuthMetadata,
  type OAuthTokenVerifier,
} from "@modelcontextprotocol/server";
import { z } from "zod";
import { MEDIA_URL } from "./touba-infos";

const TOKEN_VERSION = "ti1";
const OAUTH_SCOPE = "mcp";
const CLIENT_TTL_SECONDS = 365 * 24 * 60 * 60;
const AUTH_REQUEST_TTL_SECONDS = 10 * 60;
const AUTH_CODE_TTL_SECONDS = 3 * 60;
const ACCESS_TOKEN_TTL_SECONDS = 8 * 60 * 60;

type SignedPayload =
  | OAuthClientPayload
  | AuthorizationRequestPayload
  | AuthorizationCodePayload
  | AccessTokenPayload;

interface BasePayload {
  typ: "client" | "authorization_request" | "authorization_code" | "access";
  iat: number;
  exp: number;
  jti: string;
}

interface OAuthClientPayload extends BasePayload {
  typ: "client";
  name: string;
  redirectUris: string[];
}

export interface AuthorizationRequest {
  clientId: string;
  clientName: string;
  redirectUri: string;
  codeChallenge: string;
  scope: string;
  resource: string;
  state?: string;
}

interface AuthorizationRequestPayload extends BasePayload, AuthorizationRequest {
  typ: "authorization_request";
}

interface AuthorizationCodePayload extends BasePayload {
  typ: "authorization_code";
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  scope: string;
  resource: string;
  subject: "touba-infos-admin";
}

interface AccessTokenPayload extends BasePayload {
  typ: "access";
  iss: string;
  sub: "touba-infos-admin";
  aud: string;
  clientId: string;
  scopes: string[];
}

const clientRegistrationSchema = z
  .object({
    client_name: z.string().trim().min(1).max(160).default("Client MCP"),
    redirect_uris: z.array(z.string().url().max(2_000)).min(1).max(10),
    token_endpoint_auth_method: z.literal("none").optional(),
    grant_types: z.array(z.string()).optional(),
    response_types: z.array(z.string()).optional(),
  })
  .passthrough();

const tokenExchangeSchema = z.object({
  grantType: z.literal("authorization_code"),
  code: z.string().min(1).max(12_000),
  clientId: z.string().min(1).max(12_000),
  redirectUri: z.string().url().max(2_000),
  codeVerifier: z
    .string()
    .min(43)
    .max(128)
    .regex(/^[A-Za-z0-9._~-]+$/),
  resource: z.string().url().max(2_000),
});

function nowSeconds(): number {
  return Math.floor(Date.now() / 1_000);
}

function newJti(): string {
  return randomBytes(18).toString("base64url");
}

function oauthSecret(): string {
  const secret =
    process.env.TI_MCP_OAUTH_SECRET ||
    process.env.TI_AGENT_SECRET ||
    process.env.ADMIN_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production") {
    return "touba-infos-local-oauth-secret-change-me-2026";
  }
  throw new OAuthError(
    OAuthErrorCode.ServerError,
    "Le secret OAuth du connecteur n’est pas configuré.",
  );
}

function signatureFor(encodedPayload: string): Buffer {
  return createHmac("sha256", oauthSecret())
    .update(`${TOKEN_VERSION}.${encodedPayload}`)
    .digest();
}

export function signOAuthPayload(payload: SignedPayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signatureFor(encodedPayload).toString("base64url");
  return `${TOKEN_VERSION}.${encodedPayload}.${signature}`;
}

export function verifyOAuthPayload(token: string): SignedPayload {
  if (token.length > 12_000) {
    throw new OAuthError(OAuthErrorCode.InvalidGrant, "Jeton trop long.");
  }
  const [version, encodedPayload, encodedSignature, extra] = token.split(".");
  if (
    version !== TOKEN_VERSION ||
    !encodedPayload ||
    !encodedSignature ||
    extra !== undefined
  ) {
    throw new OAuthError(OAuthErrorCode.InvalidGrant, "Jeton invalide.");
  }
  const expected = signatureFor(encodedPayload);
  let received: Buffer;
  try {
    received = Buffer.from(encodedSignature, "base64url");
  } catch {
    throw new OAuthError(OAuthErrorCode.InvalidGrant, "Signature invalide.");
  }
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw new OAuthError(OAuthErrorCode.InvalidGrant, "Signature invalide.");
  }

  let payload: SignedPayload;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SignedPayload;
  } catch {
    throw new OAuthError(OAuthErrorCode.InvalidGrant, "Contenu du jeton invalide.");
  }
  if (
    !payload ||
    typeof payload !== "object" ||
    typeof payload.exp !== "number" ||
    typeof payload.iat !== "number" ||
    typeof payload.jti !== "string" ||
    payload.exp <= nowSeconds()
  ) {
    throw new OAuthError(OAuthErrorCode.InvalidGrant, "Jeton expiré ou invalide.");
  }
  return payload;
}

export function getPublisherOrigin(request?: Request): URL {
  const configured = process.env.TI_MCP_PUBLIC_ORIGIN?.trim();
  if (configured) return new URL(configured);
  if (process.env.VERCEL_ENV === "production") return new URL(MEDIA_URL);
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  if (request) return new URL(new URL(request.url).origin);
  return new URL("http://localhost:3000");
}

export function getMcpResourceUrl(origin: URL): URL {
  return new URL("/api/touba-infos/mcp", origin);
}

export function getOAuthMetadata(origin: URL): OAuthMetadata {
  return {
    issuer: origin.origin,
    authorization_endpoint: new URL(
      "/api/touba-infos/oauth/authorize",
      origin,
    ).href,
    token_endpoint: new URL("/api/touba-infos/oauth/token", origin).href,
    registration_endpoint: new URL(
      "/api/touba-infos/oauth/register",
      origin,
    ).href,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: [OAUTH_SCOPE],
  };
}

function validateRedirectUri(value: string): string {
  const url = new URL(value);
  const hostname = url.hostname.toLowerCase();
  const openAiHost =
    hostname === "chatgpt.com" ||
    hostname.endsWith(".chatgpt.com") ||
    hostname === "chat.openai.com" ||
    hostname.endsWith(".openai.com");
  const loopback =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  if ((url.protocol === "https:" && openAiHost) || (url.protocol === "http:" && loopback)) {
    return url.href;
  }
  throw new OAuthError(
    OAuthErrorCode.InvalidRedirectUri,
    "Seules les redirections OpenAI HTTPS et les boucles locales sont autorisées.",
  );
}

export function registerOAuthClient(rawMetadata: unknown) {
  const parsed = clientRegistrationSchema.safeParse(rawMetadata);
  if (!parsed.success) {
    throw new OAuthError(
      OAuthErrorCode.InvalidClientMetadata,
      "Métadonnées du client OAuth invalides.",
    );
  }
  if (
    parsed.data.grant_types &&
    !parsed.data.grant_types.includes("authorization_code")
  ) {
    throw new OAuthError(
      OAuthErrorCode.InvalidClientMetadata,
      "Le flux authorization_code est requis.",
    );
  }
  if (
    parsed.data.response_types &&
    !parsed.data.response_types.includes("code")
  ) {
    throw new OAuthError(
      OAuthErrorCode.InvalidClientMetadata,
      "Le type de réponse code est requis.",
    );
  }

  const issuedAt = nowSeconds();
  const redirectUris = [...new Set(parsed.data.redirect_uris.map(validateRedirectUri))];
  const clientId = signOAuthPayload({
    typ: "client",
    name: parsed.data.client_name,
    redirectUris,
    iat: issuedAt,
    exp: issuedAt + CLIENT_TTL_SECONDS,
    jti: newJti(),
  });
  return {
    client_id: clientId,
    client_id_issued_at: issuedAt,
    client_name: parsed.data.client_name,
    redirect_uris: redirectUris,
    token_endpoint_auth_method: "none" as const,
    grant_types: ["authorization_code"],
    response_types: ["code"],
  };
}

function readClient(clientId: string): OAuthClientPayload {
  const payload = verifyOAuthPayload(clientId);
  if (payload.typ !== "client") {
    throw new OAuthError(OAuthErrorCode.InvalidClient, "Client OAuth invalide.");
  }
  return payload;
}

function singleSearchParam(params: URLSearchParams, name: string): string | undefined {
  const values = params.getAll(name);
  if (values.length > 1) {
    throw new OAuthError(
      OAuthErrorCode.InvalidRequest,
      `Le paramètre ${name} ne peut apparaître qu’une fois.`,
    );
  }
  return values[0] || undefined;
}

export function validateAuthorizationRequest(
  params: URLSearchParams,
  origin: URL,
): AuthorizationRequest {
  const responseType = singleSearchParam(params, "response_type");
  const clientId = singleSearchParam(params, "client_id");
  const redirectUri = singleSearchParam(params, "redirect_uri");
  const codeChallenge = singleSearchParam(params, "code_challenge");
  const challengeMethod = singleSearchParam(params, "code_challenge_method");
  const requestedScope = singleSearchParam(params, "scope") || OAUTH_SCOPE;
  const resource = singleSearchParam(params, "resource");
  const state = singleSearchParam(params, "state");

  if (responseType !== "code") {
    throw new OAuthError(
      OAuthErrorCode.UnsupportedResponseType,
      "Le type de réponse doit être code.",
    );
  }
  if (!clientId || !redirectUri || !codeChallenge || !resource) {
    throw new OAuthError(
      OAuthErrorCode.InvalidRequest,
      "Paramètres OAuth requis manquants.",
    );
  }
  if (
    challengeMethod !== "S256" ||
    !/^[A-Za-z0-9_-]{43,128}$/.test(codeChallenge)
  ) {
    throw new OAuthError(
      OAuthErrorCode.InvalidRequest,
      "PKCE S256 est obligatoire.",
    );
  }

  const client = readClient(clientId);
  const normalizedRedirect = new URL(redirectUri).href;
  if (!client.redirectUris.includes(normalizedRedirect)) {
    throw new OAuthError(
      OAuthErrorCode.InvalidRedirectUri,
      "URI de redirection non enregistrée.",
    );
  }
  const scopes = requestedScope.split(/\s+/).filter(Boolean);
  if (scopes.length !== 1 || scopes[0] !== OAUTH_SCOPE) {
    throw new OAuthError(OAuthErrorCode.InvalidScope, "Portée OAuth invalide.");
  }
  const expectedResource = getMcpResourceUrl(origin).href;
  if (new URL(resource).href !== expectedResource) {
    throw new OAuthError(
      OAuthErrorCode.InvalidTarget,
      "La ressource demandée ne correspond pas au connecteur Touba Infos.",
    );
  }

  return {
    clientId,
    clientName: client.name,
    redirectUri: normalizedRedirect,
    codeChallenge,
    scope: OAUTH_SCOPE,
    resource: expectedResource,
    ...(state ? { state: state.slice(0, 2_000) } : {}),
  };
}

export function createAuthorizationRequestToken(
  request: AuthorizationRequest,
): string {
  const issuedAt = nowSeconds();
  return signOAuthPayload({
    typ: "authorization_request",
    ...request,
    iat: issuedAt,
    exp: issuedAt + AUTH_REQUEST_TTL_SECONDS,
    jti: newJti(),
  });
}

export function readAuthorizationRequestToken(
  token: string,
  origin: URL,
): AuthorizationRequest {
  const payload = verifyOAuthPayload(token);
  if (payload.typ !== "authorization_request") {
    throw new OAuthError(OAuthErrorCode.InvalidRequest, "Demande OAuth invalide.");
  }
  const client = readClient(payload.clientId);
  if (!client.redirectUris.includes(payload.redirectUri)) {
    throw new OAuthError(
      OAuthErrorCode.InvalidRedirectUri,
      "URI de redirection non enregistrée.",
    );
  }
  if (payload.resource !== getMcpResourceUrl(origin).href) {
    throw new OAuthError(OAuthErrorCode.InvalidTarget, "Ressource OAuth invalide.");
  }
  return {
    clientId: payload.clientId,
    clientName: payload.clientName,
    redirectUri: payload.redirectUri,
    codeChallenge: payload.codeChallenge,
    scope: payload.scope,
    resource: payload.resource,
    ...(payload.state ? { state: payload.state } : {}),
  };
}

export function verifyPublisherAdminPassword(candidate: string): boolean {
  const expected = process.env.TI_ADMIN_PASSWORD;
  if (!expected) return false;
  const left = createHash("sha256").update(candidate).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export function issueAuthorizationCode(request: AuthorizationRequest): string {
  const issuedAt = nowSeconds();
  return signOAuthPayload({
    typ: "authorization_code",
    clientId: request.clientId,
    redirectUri: request.redirectUri,
    codeChallenge: request.codeChallenge,
    scope: request.scope,
    resource: request.resource,
    subject: "touba-infos-admin",
    iat: issuedAt,
    exp: issuedAt + AUTH_CODE_TTL_SECONDS,
    jti: newJti(),
  });
}

function safeStringEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function exchangeAuthorizationCode(rawInput: unknown, origin: URL) {
  const parsed = tokenExchangeSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new OAuthError(OAuthErrorCode.InvalidRequest, "Requête de jeton invalide.");
  }
  const input = parsed.data;
  readClient(input.clientId);
  const payload = verifyOAuthPayload(input.code);
  if (payload.typ !== "authorization_code") {
    throw new OAuthError(OAuthErrorCode.InvalidGrant, "Code OAuth invalide.");
  }
  const expectedResource = getMcpResourceUrl(origin).href;
  if (
    payload.clientId !== input.clientId ||
    payload.redirectUri !== new URL(input.redirectUri).href ||
    payload.resource !== new URL(input.resource).href ||
    payload.resource !== expectedResource
  ) {
    throw new OAuthError(
      OAuthErrorCode.InvalidGrant,
      "Le code ne correspond pas à cette requête OAuth.",
    );
  }
  const challenge = createHash("sha256")
    .update(input.codeVerifier)
    .digest("base64url");
  if (!safeStringEqual(challenge, payload.codeChallenge)) {
    throw new OAuthError(OAuthErrorCode.InvalidGrant, "Vérification PKCE refusée.");
  }

  // Une relance inter-instance produit exactement le même jeton et n’élargit
  // donc pas l’autorisation. PKCE empêche un tiers détenteur du seul code de
  // réaliser l’échange.
  const accessPayload: AccessTokenPayload = {
    typ: "access",
    iss: origin.origin,
    sub: payload.subject,
    aud: payload.resource,
    clientId: payload.clientId,
    scopes: [OAUTH_SCOPE],
    iat: payload.iat,
    exp: payload.iat + ACCESS_TOKEN_TTL_SECONDS,
    jti: payload.jti,
  };
  return {
    access_token: signOAuthPayload(accessPayload),
    token_type: "Bearer" as const,
    expires_in: Math.max(1, accessPayload.exp - nowSeconds()),
    scope: OAUTH_SCOPE,
  };
}

export function createPublisherTokenVerifier(origin: URL): OAuthTokenVerifier {
  return {
    async verifyAccessToken(token: string): Promise<AuthInfo> {
      let payload: SignedPayload;
      try {
        payload = verifyOAuthPayload(token);
      } catch {
        throw new OAuthError(OAuthErrorCode.InvalidToken, "Jeton d’accès invalide.");
      }
      if (
        payload.typ !== "access" ||
        payload.iss !== origin.origin ||
        payload.aud !== getMcpResourceUrl(origin).href ||
        payload.sub !== "touba-infos-admin" ||
        !payload.scopes.includes(OAUTH_SCOPE)
      ) {
        throw new OAuthError(OAuthErrorCode.InvalidToken, "Jeton d’accès invalide.");
      }
      return {
        token,
        clientId: payload.clientId,
        scopes: payload.scopes,
        expiresAt: payload.exp,
        resource: new URL(payload.aud),
        extra: { subject: payload.sub },
      };
    },
  };
}

export function oauthErrorResponse(error: unknown, status?: number): Response {
  const oauthError = OAuthError.isInstance(error)
    ? error
    : new OAuthError(OAuthErrorCode.ServerError, "Erreur OAuth interne.");
  const inferredStatus =
    oauthError.code === OAuthErrorCode.InvalidClient ? 401 : 400;
  return Response.json(oauthError.toResponseObject(), {
    status: status || inferredStatus,
    headers: {
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
