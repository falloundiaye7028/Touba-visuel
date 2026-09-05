export type ScheduleBalance = { id: string; dueAt: Date; balance: number };
export type Allocation = { scheduleId: string; amount: number };

export function assertMoney(value: number) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("INVALID_MONEY_AMOUNT");
  return value;
}

export function allocatePayment(amount: number, schedules: ScheduleBalance[]) {
  assertMoney(amount);
  let remaining = amount;
  const allocations: Allocation[] = [];
  const ordered = [...schedules].sort((left, right) => left.dueAt.getTime() - right.dueAt.getTime());
  for (const schedule of ordered) {
    assertMoney(schedule.balance);
    if (remaining === 0) break;
    if (schedule.balance === 0) continue;
    const allocated = Math.min(remaining, schedule.balance);
    allocations.push({ scheduleId: schedule.id, amount: allocated });
    remaining -= allocated;
  }
  return { allocations, unallocated: remaining };
}

export function calculateCommission(baseAmount: number, rule: { type: "percentage"; basisPoints: number } | { type: "fixed"; amount: number }) {
  assertMoney(baseAmount);
  if (rule.type === "fixed") return assertMoney(rule.amount);
  if (!Number.isSafeInteger(rule.basisPoints) || rule.basisPoints < 0 || rule.basisPoints > 10_000) throw new Error("INVALID_COMMISSION_RATE");
  return Math.round((baseAmount * rule.basisPoints) / 10_000);
}

export function calculateOwnerStatement(input: { rentCollected: number; expenses: number; commissions: number; withholdings?: number }) {
  const rentCollected = assertMoney(input.rentCollected);
  const expenses = assertMoney(input.expenses);
  const commissions = assertMoney(input.commissions);
  const withholdings = assertMoney(input.withholdings ?? 0);
  const netAmount = rentCollected - expenses - commissions - withholdings;
  if (netAmount < 0) throw new Error("NEGATIVE_OWNER_STATEMENT");
  return { rentCollected, expenses, commissions, withholdings, netAmount };
}
