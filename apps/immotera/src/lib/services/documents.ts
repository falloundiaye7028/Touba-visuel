import "server-only";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import type { Role } from "@/lib/permissions";
import { DOCUMENT_SIGNED_URL_TTL_SECONDS, type DocumentResourceType } from "@/lib/documents/config";
import { deleteDemoDocument, getDemoDocument, listDemoDocuments, saveDemoDocument } from "@/lib/documents/demo-store";
import { assertDocumentResourceAccess } from "@/lib/documents/resource-access";
import { getDocumentStorageProvider } from "@/lib/documents/storage";
import type { DocumentDisposition } from "@/lib/documents/signed-url";
import type { DocumentListFilters, DocumentRecord } from "@/lib/documents/types";

export interface DocumentContext { userId: string; organizationId: string; role: Role }
export interface CreateDocumentInput {
  originalName: string;
  size: number;
  bytes: Uint8Array;
  extension: string;
  mimeType: string;
  checksum: string;
  name: string;
  category: string;
  description?: string;
  resourceType: DocumentResourceType;
  resourceId: string | null;
  documentDate?: string;
  tags: string[];
  storageKey?: string;
}

const usesDatabase = () => Boolean(process.env.DATABASE_URL);

function demoResourceLabel(type: DocumentResourceType, id: string | null) {
  if (!id) return "Bibliothèque générale";
  if (type === "PROPERTY" || type === "PROJECT") return id.startsWith("PROP-") ? "Villa Ndar" : `Bien ${id.slice(0, 8)}`;
  return `${type.charAt(0)}${type.slice(1).toLowerCase()} ${id.slice(0, 8)}`;
}

function toRecord(document: {
  id: string; organizationId: string; name: string; originalName: string; category: string; description: string | null; mimeType: string; size: number; storageKey: string; checksum: string | null; resourceType: DocumentResourceType; resourceId: string | null; documentDate: Date | null; tags: string[]; uploadedBy: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null;
}, uploaderName: string, resourceLabel: string | null): DocumentRecord {
  return { ...document, uploaderName, resourceLabel, documentDate: document.documentDate?.toISOString() ?? null, createdAt: document.createdAt.toISOString(), updatedAt: document.updatedAt.toISOString(), deletedAt: document.deletedAt?.toISOString() ?? null };
}

export async function listDocuments(context: DocumentContext, filters: DocumentListFilters = {}) {
  if (!usesDatabase()) return listDemoDocuments(filters);
  const search = filters.search?.trim();
  const uploaderIds = filters.uploader ? (await db.user.findMany({ where: { memberships: { some: { organizationId: context.organizationId, isActive: true } }, OR: [{ name: { contains: filters.uploader, mode: "insensitive" } }, { email: { contains: filters.uploader, mode: "insensitive" } }] }, select: { id: true } })).map((user) => user.id) : undefined;
  const endDate = filters.to ? new Date(`${filters.to}T23:59:59.999Z`) : undefined;
  const documents = await db.document.findMany({
    where: {
      organizationId: context.organizationId,
      deletedAt: null,
      category: filters.category || undefined,
      resourceType: filters.resourceType,
      resourceId: filters.resourceId || undefined,
      uploadedBy: uploaderIds ? { in: uploaderIds } : undefined,
      createdAt: filters.from || filters.to ? { gte: filters.from ? new Date(filters.from) : undefined, lte: endDate } : undefined,
    },
    orderBy: { createdAt: "desc" }, take: 100,
  });
  const users = await db.user.findMany({ where: { id: { in: documents.flatMap((document) => document.uploadedBy ? [document.uploadedBy] : []) } }, select: { id: true, name: true, email: true } });
  const uploaderNames = new Map(users.map((user) => [user.id, user.name ?? user.email]));
  const records = await Promise.all(documents.map(async (document) => {
    let resourceLabel: string | null = null;
    try { resourceLabel = (await assertDocumentResourceAccess(context.organizationId, document.resourceType as DocumentResourceType, document.resourceId)).label; } catch { resourceLabel = document.resourceId; }
    return toRecord(document as Parameters<typeof toRecord>[0], document.uploadedBy ? uploaderNames.get(document.uploadedBy) ?? "Utilisateur" : "Utilisateur historique", resourceLabel);
  }));
  if (!search) return records;
  const normalized = search.toLocaleLowerCase("fr");
  return records.filter((document) => [document.name, document.category, document.resourceLabel].some((value) => value?.toLocaleLowerCase("fr").includes(normalized)));
}

export async function createDocument(context: DocumentContext, input: CreateDocumentInput) {
  const resource = usesDatabase() ? await assertDocumentResourceAccess(context.organizationId, input.resourceType, input.resourceId) : { label: demoResourceLabel(input.resourceType, input.resourceId) };
  const id = randomUUID();
  const storage = getDocumentStorageProvider();
  const storagePath = `${context.organizationId}/${id}.${input.extension}`;
  if (input.storageKey) {
    const pathname = (() => { try { return new URL(input.storageKey).pathname; } catch { return input.storageKey; } })();
    if (!pathname.includes(`/${context.organizationId}/`)) throw new Error("INVALID_STORAGE_KEY");
  }
  const uploaded = input.storageKey ? { storageKey: input.storageKey } : await storage.upload({ key: storagePath, bytes: input.bytes, mimeType: input.mimeType });
  try {
    if (!usesDatabase()) {
      const now = new Date().toISOString();
      return saveDemoDocument({ id, organizationId: context.organizationId, name: input.name, originalName: input.originalName, category: input.category, description: input.description || null, mimeType: input.mimeType, size: input.size, storageKey: uploaded.storageKey, checksum: input.checksum, resourceType: input.resourceType, resourceId: input.resourceId, resourceLabel: resource.label, documentDate: input.documentDate ? new Date(input.documentDate).toISOString() : null, tags: input.tags, uploadedBy: context.userId, uploaderName: "Mamadou Kane", createdAt: now, updatedAt: now, deletedAt: null });
    }
    const created = await db.$transaction(async (transaction) => {
      const document = await transaction.document.create({ data: { id, organizationId: context.organizationId, name: input.name, originalName: input.originalName, category: input.category, description: input.description || null, mimeType: input.mimeType, size: input.size, storageKey: uploaded.storageKey, checksum: input.checksum, resourceType: input.resourceType, resourceId: input.resourceId, documentDate: input.documentDate ? new Date(input.documentDate) : null, tags: input.tags, uploadedBy: context.userId } });
      await transaction.auditLog.create({ data: { organizationId: context.organizationId, actorId: context.userId, action: "DOCUMENT_UPLOADED", resourceType: input.resourceType, resourceId: document.id, after: { documentId: document.id, resourceId: input.resourceId, category: input.category, mimeType: input.mimeType, size: input.size } } });
      return document;
    });
    return toRecord(created as Parameters<typeof toRecord>[0], "Utilisateur", resource.label);
  } catch (cause) {
    await storage.delete(uploaded.storageKey).catch(() => undefined);
    throw cause;
  }
}

export async function getDocumentForContext(context: DocumentContext, id: string) {
  if (!usesDatabase()) return getDemoDocument(id, context.organizationId);
  const document = await db.document.findFirst({ where: { id, organizationId: context.organizationId, deletedAt: null } });
  if (!document) return null;
  return toRecord(document as Parameters<typeof toRecord>[0], "Utilisateur", null);
}

export async function createDocumentSignedUrl(context: DocumentContext, document: DocumentRecord, disposition: DocumentDisposition, origin: string) {
  return getDocumentStorageProvider().getSignedUrl({ documentId: document.id, organizationId: context.organizationId, disposition, expiresInSeconds: DOCUMENT_SIGNED_URL_TTL_SECONDS, origin });
}

export async function auditDocumentAccess(context: DocumentContext, document: DocumentRecord, disposition: DocumentDisposition) {
  if (!usesDatabase()) return;
  await db.auditLog.create({ data: { organizationId: context.organizationId, actorId: context.userId, action: disposition === "attachment" ? "DOCUMENT_DOWNLOADED" : "DOCUMENT_VIEWED", resourceType: document.resourceType, resourceId: document.id, after: { documentId: document.id, resourceId: document.resourceId } } });
}

export async function softDeleteDocument(context: DocumentContext, id: string) {
  if (!usesDatabase()) return deleteDemoDocument(id, context.organizationId);
  return db.$transaction(async (transaction) => {
    const document = await transaction.document.findFirst({ where: { id, organizationId: context.organizationId, deletedAt: null } });
    if (!document) return null;
    const deleted = await transaction.document.update({ where: { id }, data: { deletedAt: new Date() } });
    await transaction.auditLog.create({ data: { organizationId: context.organizationId, actorId: context.userId, action: "DOCUMENT_DELETED", resourceType: document.resourceType, resourceId: document.id, before: { documentId: document.id, resourceId: document.resourceId, storageKey: "[REDACTED]" } } });
    return deleted;
  });
}
