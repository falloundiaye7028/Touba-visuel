import { z } from "zod";
import { documentErrorResponse } from "@/lib/documents/request";
import { createDocumentSignedUrl, getDocumentForContext } from "@/lib/services/documents";
import { requireContext } from "@/lib/server-context";

const dispositionSchema = z.enum(["inline", "attachment"]);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await requireContext("documents.read");
    const { id } = await params;
    const document = await getDocumentForContext(context, id);
    if (!document) throw new Error("DOCUMENT_NOT_FOUND");
    const disposition = dispositionSchema.parse(new URL(request.url).searchParams.get("disposition") ?? "inline");
    const url = await createDocumentSignedUrl(context, document, disposition, new URL(request.url).origin);
    return Response.json({ url, expiresInSeconds: 300 });
  } catch (cause) { return documentErrorResponse(cause); }
}
