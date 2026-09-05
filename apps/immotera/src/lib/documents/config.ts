export const DOCUMENT_ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp", "doc", "docx"] as const;

export const DOCUMENT_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const DOCUMENT_MAX_SIZE_MB = (() => {
  const configured = Number.parseInt(process.env.DOCUMENT_MAX_SIZE_MB ?? "20", 10);
  return Number.isFinite(configured) && configured > 0 ? configured : 20;
})();

export const DOCUMENT_MAX_SIZE_BYTES = DOCUMENT_MAX_SIZE_MB * 1024 * 1024;
export const DOCUMENT_SIGNED_URL_TTL_SECONDS = 300;
export const DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx";

export const DOCUMENT_RESOURCE_TYPES = [
  "PROPERTY", "PROJECT", "BUILDING", "UNIT", "OWNER", "TENANT", "CONTRACT", "MAINTENANCE", "VENDOR", "OTHER",
] as const;

export type DocumentResourceType = (typeof DOCUMENT_RESOURCE_TYPES)[number];

export const DOCUMENT_CATEGORIES = ["Contrats", "Administratif", "Finance", "Plans", "Identité", "Maintenance", "Autres"] as const;
