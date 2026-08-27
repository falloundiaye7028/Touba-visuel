import { prisma } from "@/lib/db";
import { auditData, requireTckRole, TckHttpError, tckApiError } from "@/lib/tck/server";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireTckRole(["ADMIN", "CONTROLLER"]);
    const { id } = await params;
    const result = await prisma.$transaction(async (tx) => {
      const expense = await tx.tckExpense.findUnique({ where: { id }, include: { _count: { select: { approvals: true } } } });
      if (!expense) throw new TckHttpError(404, "Dépense introuvable");
      if (expense.status !== "PENDING") throw new TckHttpError(409, "Cette dépense n'est plus en attente");

      await tx.tckExpenseApproval.create({ data: { expenseId: id, approverId: actor.id } }).catch(() => { throw new TckHttpError(409, "Vous avez déjà validé cette dépense"); });
      const approvals = expense._count.approvals + 1;
      const updated = approvals >= expense.required
        ? await tx.tckExpense.update({ where: { id }, data: { status: "APPROVED", approvedAt: new Date() } })
        : expense;
      await tx.tckAuditEvent.create({ data: { action: "EXPENSE_APPROVED", entity: "EXPENSE", entityId: id, actorId: actor.id, metadata: auditData({ expenseNumber: expense.expenseNumber, approvals, required: expense.required, status: updated.status }) } });
      return { ...updated, approvals };
    });
    return Response.json({ record: result });
  } catch (error) {
    return tckApiError(error);
  }
}
