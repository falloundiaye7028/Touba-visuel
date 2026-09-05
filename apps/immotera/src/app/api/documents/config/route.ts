import path from "node:path";
import { randomUUID } from "node:crypto";
import { DOCUMENT_ACCEPT, DOCUMENT_MAX_SIZE_BYTES, DOCUMENT_MAX_SIZE_MB } from "@/lib/documents/config";
import { documentErrorResponse } from "@/lib/documents/request";
import { requireContext } from "@/lib/server-context";

export async function GET() {
  try {
    await requireContext("documents.read");
    return Response.json({ accept: DOCUMENT_ACCEPT, maxSizeBytes: DOCUMENT_MAX_SIZE_BYTES, maxSizeMb: DOCUMENT_MAX_SIZE_MB });
  } catch (cause) { return documentErrorResponse(cause); }
}

export async function POST(request: Request) {
  try {
    const context = await requireContext("documents.write");
    const { originalName } = await request.json() as { originalName?: string };
    const extension = path.extname(originalName ?? "").slice(1).toLowerCase();
    const direct = Boolean(process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN) || process.env.STORAGE_PROVIDER === "blob");
    return Response.json({ mode: direct ? "blob" : "server", pathname: `${context.organizationId}/${randomUUID()}.${extension}`, accept: DOCUMENT_ACCEPT, maxSizeBytes: DOCUMENT_MAX_SIZE_BYTES, maxSizeMb: DOCUMENT_MAX_SIZE_MB });
  } catch (cause) { return documentErrorResponse(cause); }
}
