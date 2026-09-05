import { DOCUMENT_RESOURCE_TYPES } from "@/lib/documents/config";
import { documentErrorResponse } from "@/lib/documents/request";
import { listDocuments } from "@/lib/services/documents";
import { requireContext } from "@/lib/server-context";

export async function GET(request: Request) {
  try {
    const context = await requireContext("documents.read");
    const query = new URL(request.url).searchParams;
    const rawResourceType = query.get("resourceType");
    const resourceType = rawResourceType && DOCUMENT_RESOURCE_TYPES.includes(rawResourceType as (typeof DOCUMENT_RESOURCE_TYPES)[number]) ? rawResourceType as (typeof DOCUMENT_RESOURCE_TYPES)[number] : undefined;
    const data = await listDocuments(context, { search: query.get("search") ?? undefined, category: query.get("category") ?? undefined, resourceType, resourceId: query.get("resourceId") ?? undefined, uploader: query.get("uploader") ?? undefined, from: query.get("from") ?? undefined, to: query.get("to") ?? undefined });
    return Response.json({ data });
  } catch (cause) { return documentErrorResponse(cause); }
}
