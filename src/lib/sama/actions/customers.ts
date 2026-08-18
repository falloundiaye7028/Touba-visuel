"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertPermission, logActivity } from "@/lib/sama/tenant";
import { checkLimit } from "@/lib/sama/limits";
import type { FormState } from "./products";

const customerSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  source: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export async function createCustomerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { business, role, userId } = await requireTenant();
  try {
    assertPermission(role, "customers.manage");
  } catch {
    return { error: "Permission refusée." };
  }
  const parsed = customerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  const limitError = await checkLimit(business, "customers");
  if (limitError) return { error: limitError };

  const customer = await prisma.samaCustomer.create({
    data: {
      businessId: business.id,
      name: d.name,
      phone: d.phone || null,
      email: d.email || null,
      address: d.address || null,
      city: d.city || null,
      source: d.source || null,
      notes: d.notes || null,
    },
  });
  await logActivity(business.id, userId, "customer.created", { entity: "customer", entityId: customer.id, meta: { name: d.name } });
  revalidatePath("/sama/clients");
  return { ok: true };
}

export async function updateCustomerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { business, role, userId } = await requireTenant();
  try {
    assertPermission(role, "customers.manage");
  } catch {
    return { error: "Permission refusée." };
  }
  const id = String(formData.get("id") || "");
  const existing = await prisma.samaCustomer.findFirst({ where: { id, businessId: business.id } });
  if (!existing) return { error: "Client introuvable." };

  const parsed = customerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;

  await prisma.samaCustomer.update({
    where: { id },
    data: {
      name: d.name,
      phone: d.phone || null,
      email: d.email || null,
      address: d.address || null,
      city: d.city || null,
      source: d.source || null,
      notes: d.notes || null,
    },
  });
  await logActivity(business.id, userId, "customer.updated", { entity: "customer", entityId: id });
  revalidatePath("/sama/clients");
  revalidatePath(`/sama/clients/${id}`);
  return { ok: true };
}
