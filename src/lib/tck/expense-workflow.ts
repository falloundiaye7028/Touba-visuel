export const INITIAL_EXPENSE_QUORUM = 13;

export type ExpenseStage = "DRAFT" | "SUBMITTED" | "APPROVED" | "PAID" | "AUDITED" | "REJECTED";
export type Expense = {
  id: string;
  amountXof: number;
  stage: ExpenseStage;
  requesterId: string;
  approverIds: string[];
  payerId?: string;
  auditorId?: string;
};

function assertDifferent(actorId: string, actors: Array<string | undefined>, message: string) {
  if (actors.includes(actorId)) throw new Error(message);
}

export function submitExpense(expense: Expense, actorId: string): Expense {
  if (expense.stage !== "DRAFT" || expense.requesterId !== actorId) throw new Error("Soumission non autorisée");
  if (!Number.isSafeInteger(expense.amountXof) || expense.amountXof <= 0) throw new Error("Montant XOF invalide");
  return { ...expense, stage: "SUBMITTED" };
}

export function approveExpense(expense: Expense, actorId: string, quorum = INITIAL_EXPENSE_QUORUM): Expense {
  if (expense.stage !== "SUBMITTED") throw new Error("La dépense doit être soumise");
  assertDifferent(actorId, [expense.requesterId], "Le demandeur ne peut pas approuver");
  const approverIds = [...new Set([...expense.approverIds, actorId])];
  return { ...expense, approverIds, stage: approverIds.length >= quorum ? "APPROVED" : "SUBMITTED" };
}

export function payExpense(expense: Expense, actorId: string): Expense {
  if (expense.stage !== "APPROVED") throw new Error("Quorum non atteint");
  assertDifferent(actorId, [expense.requesterId, ...expense.approverIds], "Le payeur doit être indépendant");
  return { ...expense, payerId: actorId, stage: "PAID" };
}

export function auditExpense(expense: Expense, actorId: string): Expense {
  if (expense.stage !== "PAID") throw new Error("La dépense doit être payée");
  assertDifferent(actorId, [expense.requesterId, expense.payerId, ...expense.approverIds], "Le contrôleur doit être indépendant");
  return { ...expense, auditorId: actorId, stage: "AUDITED" };
}
