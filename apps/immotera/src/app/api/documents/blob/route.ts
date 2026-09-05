import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { DOCUMENT_ALLOWED_MIME_TYPES, DOCUMENT_MAX_SIZE_BYTES } from "@/lib/documents/config";
import { documentErrorResponse } from "@/lib/documents/request";
import { requireContext } from "@/lib/server-context";

export async function POST(request: Request) {
  try {
    const body = await request.json() as HandleUploadBody;
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const context = await requireContext("documents.write");
        if (!pathname.startsWith(`${context.organizationId}/`)) throw new Error("FORBIDDEN");
        return { allowedContentTypes: [...DOCUMENT_ALLOWED_MIME_TYPES], maximumSizeInBytes: DOCUMENT_MAX_SIZE_BYTES, addRandomSuffix: false, allowOverwrite: false };
      },
    });
    return Response.json(result);
  } catch (cause) { return documentErrorResponse(cause); }
}
