import { z } from "zod";
import { documentMetadataSchema, documentErrorResponse } from "@/lib/documents/request";
import { getDocumentStorageProvider } from "@/lib/documents/storage";
import { validateDocumentBytes } from "@/lib/documents/validation";
import { createDocument } from "@/lib/services/documents";
import { requireContext } from "@/lib/server-context";

const finalizeSchema = documentMetadataSchema.extend({
  originalName: z.string().min(1).max(255),
  storageKey: z.string().url(),
  mimeType: z.string().min(1).max(150),
  size: z.number().int().positive(),
});

async function streamToBytes(body: ReadableStream<Uint8Array> | Uint8Array) {
  if (body instanceof Uint8Array) return body;
  const response = new Response(body);
  return new Uint8Array(await response.arrayBuffer());
}

export async function POST(request: Request) {
  let cleanupKey: string | null = null;
  try {
    const context = await requireContext("documents.write");
    const input = finalizeSchema.parse(await request.json());
    const pathname = new URL(input.storageKey).pathname;
    if (!pathname.includes(`/${context.organizationId}/`)) throw new Error("FORBIDDEN");
    cleanupKey = input.storageKey;
    const storage = getDocumentStorageProvider();
    const stored = await storage.download(input.storageKey);
    const bytes = await streamToBytes(stored.body);
    const validated = validateDocumentBytes({ name: input.originalName, type: stored.contentType ?? input.mimeType, size: bytes.byteLength, bytes });
    const document = await createDocument(context, { ...input, documentDate: input.documentDate || undefined, size: bytes.byteLength, ...validated, storageKey: input.storageKey });
    cleanupKey = null;
    return Response.json({ data: document }, { status: 201 });
  } catch (cause) {
    if (cleanupKey) await getDocumentStorageProvider().delete(cleanupKey).catch(() => undefined);
    return documentErrorResponse(cause);
  }
}
