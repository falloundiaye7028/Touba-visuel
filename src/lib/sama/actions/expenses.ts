"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireTenant, assertMemberCan, logActivity } from "@/lib/sama/tenant";
import { parseAmount } from "@/lib/sama/money";
import type { FormState } from "./products";

const expenseSchema = z.object({
  category: z.string().trim().min(1, "Catégorie requise"),
  amount: z.string().min(1, "Montant requis"),
  description: z.string().trim().optional(),
  date: z.string().optional(),
});

export async function createExpenseAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { business, member, userId } = await requireTenant();
  try {
    assertMemberCan(member, "expenses.manage");
  } catch {
    return { error: "Permission refusée." };
  }
  const parsed = expenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  const d = parsed.data;
  const amount = parseAmount(d.amount);
  if (amount <= 0) return { error: "Montant invalide." };

  await prisma.samaExpense.create({
    data: {
      businessId: business.id,
      category: d.category,
      amount,
      description: d.description || null,
      date: d.date ? new Date(d.date) : new Date(),
      createdBy: userId,
    },
  });
  await logActivity(business.id, userId, "expense.created", { meta: { category: d.category, amount } });
  revalidatePath("/sama/depenses");
  revalidatePath("/sama/dashboard");
  return { ok: true };
}

export async function deleteExpenseAction(formData: FormData): Promise<void> {
  const { business, member, userId } = await requireTenant();
  assertMemberCan(member, "expenses.manage");
  const id = String(formData.get("id") || "");
  await prisma.samaExpense.deleteMany({ where: { id, businessId: business.id } });
  await logActivity(business.id, userId, "expense.deleted", { entityId: id });
  revalidatePath("/sama/depenses");
  revalidatePath("/sama/dashboard");
}
