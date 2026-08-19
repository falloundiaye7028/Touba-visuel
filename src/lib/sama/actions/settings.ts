"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertMemberCan, logActivity } from "@/lib/sama/tenant";
import type { FormState } from "./products";

const settingsSchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  description: z.string().trim().optional(),
  openingHours: z.string().trim().optional(),
  brandColor: z.string().trim().optional(),
  invoiceFooter: z.string().trim().optional(),
  logoUrl: z.string().trim().optional(),
  bannerUrl: z.string().trim().optional(),
});

export async function updateSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { business, member, userId } = await requireTenant();
  try { assertMemberCan(member, "settings.manage"); } catch { return { error: "Permission refusée." }; }

  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  await prisma.samaBusiness.update({
    where: { id: business.id },
    data: {
      name: d.name, phone: d.phone || null, whatsapp: d.whatsapp || null, email: d.email || null,
      address: d.address || null, city: d.city || null, description: d.description || null,
      openingHours: d.openingHours || null, brandColor: d.brandColor || "#0e7d52",
      invoiceFooter: d.invoiceFooter || null,
      logoUrl: d.logoUrl || null, bannerUrl: d.bannerUrl || null,
    },
  });
  await logActivity(business.id, userId, "settings.updated");
  revalidatePath("/sama/parametres");
  revalidatePath("/sama/dashboard");
  return { ok: true };
}

export async function toggleStoreAction(formData: FormData): Promise<void> {
  const { business, member, userId } = await requireTenant();
  assertMemberCan(member, "settings.manage");
  const publish = String(formData.get("publish")) === "true";
  await prisma.samaBusiness.update({ where: { id: business.id }, data: { storePublished: publish } });
  await logActivity(business.id, userId, publish ? "store.published" : "store.unpublished");
  revalidatePath("/sama/boutique");
}
