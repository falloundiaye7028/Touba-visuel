import { createHash } from "node:crypto";
import path from "node:path";
import { DOCUMENT_ALLOWED_EXTENSIONS, DOCUMENT_ALLOWED_MIME_TYPES, DOCUMENT_MAX_SIZE_BYTES, DOCUMENT_MAX_SIZE_MB } from "./config";

type AllowedMime = (typeof DOCUMENT_ALLOWED_MIME_TYPES)[number];

const mimeByExtension: Record<(typeof DOCUMENT_ALLOWED_EXTENSIONS)[number], readonly AllowedMime[]> = {
  pdf: ["application/pdf"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  webp: ["image/webp"],
  doc: ["application/msword"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

function hasValidSignature(bytes: Uint8Array, mimeType: AllowedMime) {
  if (mimeType === "application/pdf") return startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]);
  if (mimeType === "image/jpeg") return startsWith(bytes, [0xff, 0xd8, 0xff]);
  if (mimeType === "image/png") return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (mimeType === "image/webp") return startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (mimeType === "application/msword") return startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    if (!startsWith(bytes, [0x50, 0x4b, 0x03, 0x04])) return false;
    // DOCX is a ZIP package. These entry names are present in its central directory
    // even when the XML payloads themselves are compressed.
    const packageDirectory = new TextDecoder("latin1").decode(bytes);
    return packageDirectory.includes("[Content_Types].xml") && packageDirectory.includes("word/");
  }
  return false;
}

export class DocumentValidationError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
  }
}

export function validateDocumentBytes(input: { name: string; type: string; size: number; bytes: Uint8Array }) {
  if (!input.size) throw new DocumentValidationError("EMPTY_FILE", "Le fichier est vide.");
  if (input.size > DOCUMENT_MAX_SIZE_BYTES) throw new DocumentValidationError("FILE_TOO_LARGE", `Ce fichier dépasse la limite de ${DOCUMENT_MAX_SIZE_MB} Mo.`);

  const extension = path.extname(input.name).slice(1).toLowerCase() as (typeof DOCUMENT_ALLOWED_EXTENSIONS)[number];
  if (!DOCUMENT_ALLOWED_EXTENSIONS.includes(extension)) throw new DocumentValidationError("EXTENSION_NOT_ALLOWED", "Ce format n’est pas autorisé.");
  if (!DOCUMENT_ALLOWED_MIME_TYPES.includes(input.type as AllowedMime)) throw new DocumentValidationError("MIME_NOT_ALLOWED", "Ce format n’est pas autorisé.");
  if (!mimeByExtension[extension].includes(input.type as AllowedMime)) throw new DocumentValidationError("TYPE_MISMATCH", "L’extension et le type du fichier ne correspondent pas.");

  if (!hasValidSignature(input.bytes, input.type as AllowedMime)) {
    const message = input.type === "application/pdf" ? "Le fichier PDF semble invalide." : "La signature du fichier semble invalide.";
    throw new DocumentValidationError("INVALID_SIGNATURE", message);
  }

  return {
    bytes: input.bytes,
    extension,
    mimeType: input.type as AllowedMime,
    checksum: createHash("sha256").update(input.bytes).digest("hex"),
  };
}

export async function validateDocumentFile(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return validateDocumentBytes({ name: file.name, type: file.type, size: file.size, bytes });
}

export function sanitizeDocumentName(value: string) {
  return value.normalize("NFKC").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 180);
}
