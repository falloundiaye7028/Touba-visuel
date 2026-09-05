import { createHmac, timingSafeEqual } from "node:crypto";

export type DocumentDisposition = "inline" | "attachment";

function signingSecret() {
  const secret = process.env.DOCUMENT_SIGNING_SECRET ?? process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("DOCUMENT_SIGNING_SECRET_REQUIRED");
  return "intelligence-immobilier-local-document-signing-only";
}

function signature(payload: string) {
  return createHmac("sha256", signingSecret()).update(payload).digest("base64url");
}

export function createDocumentAccessToken(documentId: string, organizationId: string, disposition: DocumentDisposition, expiresAt: number) {
  const payload = `${documentId}.${organizationId}.${disposition}.${expiresAt}`;
  return `${expiresAt}.${signature(payload)}`;
}

export function verifyDocumentAccessToken(token: string, documentId: string, organizationId: string, disposition: DocumentDisposition, now = Date.now()) {
  const [expiresValue, received] = token.split(".");
  const expiresAt = Number(expiresValue);
  if (!expiresValue || !received || !Number.isSafeInteger(expiresAt) || expiresAt < now) return false;
  const expected = signature(`${documentId}.${organizationId}.${disposition}.${expiresAt}`);
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
}
