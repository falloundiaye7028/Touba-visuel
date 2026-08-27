import { z } from "zod";
import { prisma } from "@/lib/db";
import { auditData, requireTckRole, tckApiError, tckReference, TCK_STAFF_ROLES } from "@/lib/tck/server";

const createExpenseSchema = z.object({
  label: z.string().trim().min(3).max(180),
  commission: z.string().trim().min(2).max(100),
  amount: z.coerce.number().int().min(1_000).max(2_000_000_000),
  justification: z.string().trim().min(3).max(2_000),
});

export async function GET() {
  try {
    await requireTckRole(TCK_STAFF_ROLES);
    const records = await prisma.tckExpense.findMany({ include: { _count: { select: { approvals: true } } }, orderBy: { submittedAt: "desc" }, take: 250 });
    return Response.json({ records });
  } catch (error) {
    return tckApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireTckRole(["ADMIN", "COMMISSION_MANAGER"]);
    const parsed = createExpenseSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Dépense invalide", issues: parsed.error.flatten() }, { status: 400 });
    const expense = await prisma.$transaction(async (tx) => {
      const created = await tx.tckExpense.create({ data: { ...parsed.data, expenseNumber: tckReference("DEP"), submittedById: actor.id } });
      await tx.tckAuditEvent.create({ data: { action: "EXPENSE_CREATED", entity: "EXPENSE", entityId: created.id, actorId: actor.id, metadata: auditData({ expenseNumber: created.expenseNumber, label: created.label, amount: created.amount, commission: created.commission }) } });
      return created;
    });
    return Response.json({ record: expense }, { status: 201 });
  } catch (error) {
    return tckApiError(error);
  }
}
