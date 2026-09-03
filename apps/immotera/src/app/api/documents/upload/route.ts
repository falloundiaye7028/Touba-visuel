import { metadataFromFormData, documentErrorResponse } from "@/lib/documents/request";
import { validateDocumentFile } from "@/lib/documents/validation";
import { createDocument } from "@/lib/services/documents";
import { requireContext } from "@/lib/server-context";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const context = await requireContext("documents.write");
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Sélectionnez un fichier à téléverser." }, { status: 400 });
    const metadata = metadataFromFormData(formData);
    const validated = await validateDocumentFile(file);
    const document = await createDocument(context, { ...metadata, documentDate: metadata.documentDate || undefined, originalName: file.name, size: file.size, ...validated });
    return Response.json({ data: document }, { status: 201 });
  } catch (cause) { return documentErrorResponse(cause); }
}
