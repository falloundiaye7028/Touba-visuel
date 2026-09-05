import { documentErrorResponse } from "@/lib/documents/request";
import { getDocumentStorageProvider } from "@/lib/documents/storage";
import { verifyDocumentAccessToken, type DocumentDisposition } from "@/lib/documents/signed-url";
import { auditDocumentAccess, getDocumentForContext } from "@/lib/services/documents";
import { requireContext } from "@/lib/server-context";

function safeFilename(name: string) { return name.replace(/[\r\n"\\/]/g, "_"); }

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await requireContext("documents.read");
    const { id } = await params;
    const query = new URL(request.url).searchParams;
    const disposition = (query.get("disposition") === "attachment" ? "attachment" : "inline") as DocumentDisposition;
    if (!verifyDocumentAccessToken(query.get("token") ?? "", id, context.organizationId, disposition)) return Response.json({ error: "Ce lien a expiré ou n’est pas valide." }, { status: 403 });
    const document = await getDocumentForContext(context, id);
    if (!document) throw new Error("DOCUMENT_NOT_FOUND");
    const stored = await getDocumentStorageProvider().download(document.storageKey);
    await auditDocumentAccess(context, document, disposition);
    return new Response(stored.body as BodyInit, { headers: { "Content-Type": document.mimeType, "Content-Length": String(document.size), "Content-Disposition": `${disposition}; filename="${safeFilename(document.originalName)}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (cause) { return documentErrorResponse(cause); }
}
