import { documentErrorResponse } from "@/lib/documents/request";
import { softDeleteDocument } from "@/lib/services/documents";
import { requireContext } from "@/lib/server-context";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await requireContext("documents.delete");
    const deleted = await softDeleteDocument(context, (await params).id);
    if (!deleted) throw new Error("DOCUMENT_NOT_FOUND");
    return Response.json({ ok: true });
  } catch (cause) { return documentErrorResponse(cause); }
}
