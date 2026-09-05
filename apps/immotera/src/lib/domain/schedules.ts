export type RentScheduleDraft = { periodStart: Date; periodEnd: Date; dueDate: Date; amountExpected: number; balance: number };

function daysInMonth(year: number, month: number) { return new Date(Date.UTC(year, month + 1, 0)).getUTCDate(); }

export function generateMonthlySchedules(input: { startDate: Date; endDate: Date; dueDay: number; rent: number; charges: number }) {
  if (input.endDate < input.startDate) throw new Error("INVALID_CONTRACT_DATES");
  if (!Number.isInteger(input.dueDay) || input.dueDay < 1 || input.dueDay > 31) throw new Error("INVALID_DUE_DAY");
  if (!Number.isSafeInteger(input.rent) || !Number.isSafeInteger(input.charges) || input.rent < 0 || input.charges < 0) throw new Error("INVALID_MONEY_AMOUNT");
  const schedules: RentScheduleDraft[] = [];
  let cursor = new Date(Date.UTC(input.startDate.getUTCFullYear(), input.startDate.getUTCMonth(), 1));
  const endMonth = new Date(Date.UTC(input.endDate.getUTCFullYear(), input.endDate.getUTCMonth(), 1));
  while (cursor <= endMonth) {
    const year = cursor.getUTCFullYear(); const month = cursor.getUTCMonth();
    const periodStart = new Date(Date.UTC(year, month, 1));
    const periodEnd = new Date(Date.UTC(year, month, daysInMonth(year, month), 23, 59, 59, 999));
    const dueDate = new Date(Date.UTC(year, month, Math.min(input.dueDay, daysInMonth(year, month))));
    const amountExpected = input.rent + input.charges;
    schedules.push({ periodStart, periodEnd, dueDate, amountExpected, balance: amountExpected });
    cursor = new Date(Date.UTC(year, month + 1, 1));
  }
  return schedules;
}
