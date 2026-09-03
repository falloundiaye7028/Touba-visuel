import { z } from "zod";
import { DOCUMENT_CATEGORIES, DOCUMENT_RESOURCE_TYPES } from "./config";
import { sanitizeDocumentName } from "./validation";

export const documentMetadataSchema = z.object({
  name: z.string().min(1).max(180).transform(sanitizeDocumentName),
  category: z.enum(DOCUMENT_CATEGORIES),
  description: z.string().max(2000).optional().default(""),
  resourceType: z.enum(DOCUMENT_RESOURCE_TYPES).default("OTHER"),
  resourceId: z.string().max(100).nullable().optional().transform((value) => value || null),
  documentDate: z.string().date().optional().or(z.literal("")),
  tags: z.array(z.string().min(1).max(40)).max(20).default([]),
});

export function metadataFromFormData(formData: FormData) {
  return documentMetadataSchema.parse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description") ?? "",
    resourceType: formData.get("resourceType") ?? "OTHER",
    resourceId: formData.get("resourceId") || null,
    documentDate: formData.get("documentDate") ?? "",
    tags: String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
  });
}

export function documentErrorResponse(cause: unknown) {
  const message = cause instanceof Error ? cause.message : "DOCUMENT_OPERATION_FAILED";
  const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : message === "DOCUMENT_NOT_FOUND" || message === "RESOURCE_NOT_FOUND" ? 404 : 400;
  const friendly: Record<string, string> = {
    FORBIDDEN: "Vous n’avez pas l’autorisation d’effectuer cette action.",
    RESOURCE_NOT_FOUND: "Vous n’avez pas l’autorisation d’ajouter un document à cette ressource.",
    PRIVATE_DOCUMENT_STORAGE_REQUIRED: "Le stockage documentaire privé n’est pas configuré.",
    DOCUMENT_OPERATION_FAILED: "Le téléversement a échoué. Aucun document n’a été enregistré.",
  };
  return Response.json({ error: friendly[message] ?? message }, { status });
}
