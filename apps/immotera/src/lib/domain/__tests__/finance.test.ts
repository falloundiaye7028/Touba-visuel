import { describe, expect, it } from "vitest";
import { allocatePayment, calculateCommission, calculateOwnerStatement } from "../finance";

describe("financial invariants", () => {
  it("allocates a payment to the oldest balance first", () => {
    const result = allocatePayment(750_000, [
      { id: "aug", dueAt: new Date("2026-08-05"), balance: 500_000 },
      { id: "jul", dueAt: new Date("2026-07-05"), balance: 400_000 },
    ]);
    expect(result).toEqual({ allocations: [{ scheduleId: "jul", amount: 400_000 }, { scheduleId: "aug", amount: 350_000 }], unallocated: 0 });
  });

  it("keeps excess payment unallocated", () => {
    expect(allocatePayment(600_000, [{ id: "aug", dueAt: new Date("2026-08-05"), balance: 500_000 }]).unallocated).toBe(100_000);
  });

  it("calculates percentage commissions with integer basis points", () => {
    expect(calculateCommission(850_000, { type: "percentage", basisPoints: 700 })).toBe(59_500);
  });

  it("calculates the owner net without silent rounding", () => {
    expect(calculateOwnerStatement({ rentCollected: 3_250_000, expenses: 185_000, commissions: 227_500 })).toEqual({ rentCollected: 3_250_000, expenses: 185_000, commissions: 227_500, withholdings: 0, netAmount: 2_837_500 });
  });
});
