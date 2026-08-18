/**
 * Numérotation séquentielle par entreprise et par type de document.
 * Format : CMD-2026-000001, FAC-2026-000001, DEV-2026-000001, REC-2026-000001,
 * VTE-2026-000001. Chaque entreprise possède ses propres compteurs (isolation).
 */
import type { Prisma, PrismaClient } from "@prisma/client";

export type DocPrefix = "CMD" | "FAC" | "DEV" | "REC" | "VTE" | "BC";

type Tx = Prisma.TransactionClient | PrismaClient;

/**
 * Réserve et retourne le prochain numéro pour un type de document donné.
 * Doit être appelé dans une transaction pour garantir l'unicité.
 */
export async function nextNumber(tx: Tx, businessId: string, prefix: DocPrefix): Promise<string> {
  const year = new Date().getFullYear();
  const key = `${prefix}-${year}`;

  const counter = await tx.samaCounter.upsert({
    where: { businessId_key: { businessId, key } },
    create: { businessId, key, value: 1 },
    update: { value: { increment: 1 } },
  });

  const seq = String(counter.value).padStart(6, "0");
  return `${prefix}-${year}-${seq}`;
}

/** Génère un slug URL-safe à partir d'un nom d'entreprise. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "boutique";
}

/**
 * Garantit l'unicité d'un slug en base en ajoutant un suffixe si nécessaire.
 */
export async function uniqueSlug(tx: Tx, base: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let i = 1;
  // Boucle bornée pour éviter tout blocage
  while (i < 100) {
    const existing = await tx.samaBusiness.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    candidate = `${root}-${i++}`;
  }
  return `${root}-${Date.now().toString(36)}`;
}
