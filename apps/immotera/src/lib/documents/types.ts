import type { DocumentResourceType } from "./config";

export interface DocumentRecord {
  id: string;
  organizationId: string;
  name: string;
  originalName: string;
  category: string;
  description: string | null;
  mimeType: string;
  size: number;
  storageKey: string;
  checksum: string | null;
  resourceType: DocumentResourceType;
  resourceId: string | null;
  resourceLabel: string | null;
  documentDate: string | null;
  tags: string[];
  uploadedBy: string | null;
  uploaderName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface DocumentListFilters {
  search?: string;
  category?: string;
  resourceType?: DocumentResourceType;
  uploader?: string;
  from?: string;
  to?: string;
  resourceId?: string;
}
