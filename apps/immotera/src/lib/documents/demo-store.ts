import type { DocumentListFilters, DocumentRecord } from "./types";

const globalDocuments = globalThis as unknown as { intelligenceImmobilierDocuments?: DocumentRecord[] };
const store = globalDocuments.intelligenceImmobilierDocuments ?? [];
if (process.env.NODE_ENV !== "production") globalDocuments.intelligenceImmobilierDocuments = store;

export function listDemoDocuments(filters: DocumentListFilters) {
  const search = filters.search?.toLocaleLowerCase("fr");
  return store.filter((document) => !document.deletedAt)
    .filter((document) => !filters.category || document.category === filters.category)
    .filter((document) => !filters.resourceType || document.resourceType === filters.resourceType)
    .filter((document) => !filters.resourceId || document.resourceId === filters.resourceId)
    .filter((document) => !filters.uploader || document.uploaderName.toLocaleLowerCase("fr").includes(filters.uploader.toLocaleLowerCase("fr")))
    .filter((document) => !search || [document.name, document.category, document.resourceLabel].some((value) => value?.toLocaleLowerCase("fr").includes(search)))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function getDemoDocument(id: string, organizationId: string) {
  return store.find((document) => document.id === id && document.organizationId === organizationId && !document.deletedAt) ?? null;
}

export function saveDemoDocument(document: DocumentRecord) { store.push(document); return document; }

export function deleteDemoDocument(id: string, organizationId: string) {
  const document = getDemoDocument(id, organizationId);
  if (!document) return null;
  document.deletedAt = new Date().toISOString();
  document.updatedAt = document.deletedAt;
  return document;
}
