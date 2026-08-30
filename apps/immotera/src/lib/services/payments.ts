import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { allocatePayment } from "@/lib/domain/finance";
import { requireContext } from "@/lib/server-context";

const paymentInput = z.object({
  contractId: z.string().uuid(),
  tenantId: z.string().uuid(),
  propertyId: z.string().uuid(),
  amount: z.number().int().positive().max(10_000_000_000),
  method: z.enum(["CASH", "WAVE", "ORANGE_MONEY", "TRANSFER", "CHECK", "CARD", "OTHER"]),
  externalRef: z.string().max(120).optional(),
  paidAt: z.coerce.date(),
});

export async function recordRentPayment(rawInput: unknown) {
  const input = paymentInput.parse(rawInput);
  const context = await requireContext("finance.write");
  return db.$transaction(async (transaction) => {
    const contract = await transaction.contract.findFirst({ where: { id: input.contractId, organizationId: context.organizationId, deletedAt: null }, select: { id: true } });
    if (!contract) throw new Error("CONTRACT_NOT_FOUND");
    const schedules = await transaction.rentSchedule.findMany({ where: { contractId: input.contractId, organizationId: context.organizationId, balance: { gt: 0 } }, select: { id: true, dueDate: true, balance: true, amountPaid: true }, orderBy: { dueDate: "asc" } });
    const allocation = allocatePayment(input.amount, schedules.map((schedule) => ({ id: schedule.id, dueAt: schedule.dueDate, balance: schedule.balance })));
    const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
    const reference = `PAY-${input.paidAt.getUTCFullYear()}-${suffix}`;
    const receiptNumber = `REC-${input.paidAt.getUTCFullYear()}-${suffix}`;
    const payment = await transaction.payment.create({
      data: {
        organizationId: context.organizationId, reference, receiptNumber, tenantId: input.tenantId,
        propertyId: input.propertyId, contractId: input.contractId, type: "RENT", amount: input.amount,
        method: input.method, externalRef: input.externalRef, paidAt: input.paidAt, status: "CONFIRMED",
        allocations: { create: allocation.allocations.map((item) => ({ rentScheduleId: item.scheduleId, amount: item.amount })) },
      },
    });
    for (const item of allocation.allocations) {
      const schedule = schedules.find((candidate) => candidate.id === item.scheduleId);
      if (!schedule) throw new Error("SCHEDULE_NOT_FOUND");
      const balance = schedule.balance - item.amount;
      await transaction.rentSchedule.update({ where: { id: item.scheduleId }, data: { amountPaid: schedule.amountPaid + item.amount, balance, status: balance === 0 ? "PAID" : "PARTIAL" } });
    }
    await transaction.auditLog.create({ data: { organizationId: context.organizationId, actorId: context.userId, action: "PAYMENT_CONFIRMED", resourceType: "Payment", resourceId: payment.id, after: { reference, receiptNumber, amount: input.amount, allocations: allocation.allocations } } });
    return { payment, unallocated: allocation.unallocated };
  });
}
