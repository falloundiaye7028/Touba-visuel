import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DOCUMENT_MAX_SIZE_BYTES } from "@/lib/documents/config";
import { deleteDemoDocument, getDemoDocument, saveDemoDocument } from "@/lib/documents/demo-store";
import { documentMetadataSchema } from "@/lib/documents/request";
import { createDocumentAccessToken, verifyDocumentAccessToken } from "@/lib/documents/signed-url";
import { DocumentValidationError, validateDocumentBytes, validateDocumentFile } from "@/lib/documents/validation";
import { can, canWithOverrides } from "@/lib/permissions";

describe("secure documents", () => {
  it("accepts a PDF with a matching extension, MIME and signature", async () => {
    const bytes = await readFile(path.join(process.cwd(), "fixtures/documents/sample-property-document.pdf"));
    const file = new File([bytes], "sample-property-document.pdf", { type: "application/pdf" });
    const result = await validateDocumentFile(file);
    expect(result.mimeType).toBe("application/pdf");
    expect(result.checksum).toHaveLength(64);
  });

  it("rejects forbidden, mismatched and oversized files", () => {
    expect(() => validateDocumentBytes({ name: "payload.exe", type: "application/octet-stream", size: 4, bytes: new Uint8Array([0x4d, 0x5a, 0, 0]) })).toThrow(DocumentValidationError);
    expect(() => validateDocumentBytes({ name: "fake.pdf", type: "application/pdf", size: 4, bytes: new Uint8Array([1, 2, 3, 4]) })).toThrow("Le fichier PDF semble invalide.");
    expect(() => validateDocumentBytes({ name: "large.pdf", type: "application/pdf", size: DOCUMENT_MAX_SIZE_BYTES + 1, bytes: new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]) })).toThrow(/dépasse la limite/);
  });

  it("binds signed links to the document, tenant, disposition and expiry", () => {
    const expiry = Date.now() + 60_000;
    const token = createDocumentAccessToken("doc-1", "org-a", "inline", expiry);
    expect(verifyDocumentAccessToken(token, "doc-1", "org-a", "inline")).toBe(true);
    expect(verifyDocumentAccessToken(token, "doc-1", "org-b", "inline")).toBe(false);
    expect(verifyDocumentAccessToken(token, "doc-1", "org-a", "attachment")).toBe(false);
    expect(verifyDocumentAccessToken(token, "doc-1", "org-a", "inline", expiry + 1)).toBe(false);
  });

  it("keeps demo document lookup tenant-scoped", () => {
    const now = new Date().toISOString();
    saveDemoDocument({ id: "tenant-test-document", organizationId: "org-a", name: "Permis", originalName: "permis.pdf", category: "Administratif", description: null, mimeType: "application/pdf", size: 100, storageKey: "org-a/permis.pdf", checksum: null, resourceType: "PROJECT", resourceId: "project-1", resourceLabel: "Résidence Diamniadio", documentDate: null, tags: [], uploadedBy: "user-a", uploaderName: "Awa", createdAt: now, updatedAt: now, deletedAt: null });
    expect(getDemoDocument("tenant-test-document", "org-a")?.resourceType).toBe("PROJECT");
    expect(getDemoDocument("tenant-test-document", "org-b")).toBeNull();
    expect(deleteDemoDocument("tenant-test-document", "org-b")).toBeNull();
    expect(deleteDemoDocument("tenant-test-document", "org-a")?.deletedAt).not.toBeNull();
    expect(getDemoDocument("tenant-test-document", "org-a")).toBeNull();
  });

  it.each([["PROJECT", "project-1"], ["PROPERTY", "property-1"]] as const)("keeps a %s resource attachment", (resourceType, resourceId) => {
    const parsed = documentMetadataSchema.parse({ name: "Permis", category: "Administratif", resourceType, resourceId, tags: [] });
    expect(parsed).toMatchObject({ resourceType, resourceId });
  });

  it("enforces viewer read-only access and explicit agent grants", () => {
    expect(can("VIEWER", "documents.read")).toBe(true);
    expect(can("VIEWER", "documents.write")).toBe(false);
    expect(can("VIEWER", "documents.delete")).toBe(false);
    expect(can("MANAGER", "documents.write")).toBe(true);
    expect(canWithOverrides("AGENT", "documents.write", ["documents.write"])).toBe(true);
  });
});
