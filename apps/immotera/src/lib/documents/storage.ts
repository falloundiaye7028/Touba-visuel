import "server-only";
import { del, get, put } from "@vercel/blob";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { createDocumentAccessToken, type DocumentDisposition } from "./signed-url";

export interface DocumentStorageProvider {
  upload(input: { key: string; bytes: Uint8Array; mimeType: string }): Promise<{ storageKey: string }>;
  delete(storageKey: string): Promise<void>;
  getSignedUrl(input: { documentId: string; organizationId: string; disposition: DocumentDisposition; expiresInSeconds: number; origin: string }): Promise<string>;
  download(storageKey: string): Promise<{ body: ReadableStream<Uint8Array> | Uint8Array; contentType?: string }>;
}

abstract class SignedApplicationUrlProvider implements DocumentStorageProvider {
  abstract upload(input: { key: string; bytes: Uint8Array; mimeType: string }): Promise<{ storageKey: string }>;
  abstract delete(storageKey: string): Promise<void>;
  abstract download(storageKey: string): Promise<{ body: ReadableStream<Uint8Array> | Uint8Array; contentType?: string }>;

  async getSignedUrl(input: { documentId: string; organizationId: string; disposition: DocumentDisposition; expiresInSeconds: number; origin: string }) {
    const expiresAt = Date.now() + input.expiresInSeconds * 1000;
    const token = createDocumentAccessToken(input.documentId, input.organizationId, input.disposition, expiresAt);
    return `${input.origin}/api/documents/${input.documentId}/content?disposition=${input.disposition}&token=${encodeURIComponent(token)}`;
  }
}

export class VercelBlobDocumentStorage extends SignedApplicationUrlProvider {
  async upload(input: { key: string; bytes: Uint8Array; mimeType: string }) {
    const blob = await put(input.key, Buffer.from(input.bytes), { access: "private", contentType: input.mimeType, addRandomSuffix: false });
    return { storageKey: blob.url };
  }

  async delete(storageKey: string) { await del(storageKey); }

  async download(storageKey: string) {
    const result = await get(storageKey, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) throw new Error("DOCUMENT_NOT_FOUND");
    return { body: result.stream, contentType: result.blob.contentType };
  }
}

export class LocalPrivateDocumentStorage extends SignedApplicationUrlProvider {
  private readonly root = path.join(process.cwd(), "uploads", "documents");

  private resolve(storageKey: string) {
    if (!/^[a-zA-Z0-9/_-]+\.[a-zA-Z0-9]+$/.test(storageKey)) throw new Error("INVALID_STORAGE_KEY");
    return path.join(this.root, storageKey);
  }

  async upload(input: { key: string; bytes: Uint8Array; mimeType: string }) {
    const destination = this.resolve(input.key);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, input.bytes, { flag: "wx" });
    return { storageKey: input.key };
  }

  async delete(storageKey: string) { await rm(this.resolve(storageKey), { force: true }); }
  async download(storageKey: string) { return { body: await readFile(this.resolve(storageKey)) }; }
}

export function getDocumentStorageProvider(): DocumentStorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID ? "blob" : "local");
  if (provider === "blob") return new VercelBlobDocumentStorage();
  if (provider === "local" || provider === "mock") {
    if (process.env.NODE_ENV === "production") throw new Error("PRIVATE_DOCUMENT_STORAGE_REQUIRED");
    return new LocalPrivateDocumentStorage();
  }
  throw new Error(`UNSUPPORTED_STORAGE_PROVIDER:${provider}`);
}
