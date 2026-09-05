import { db } from "@/lib/db";
import { requireContext } from "@/lib/server-context";

export async function getRentArrears() {
  const { organizationId } = await requireContext("finance.read");
  return db.rentSchedule.findMany({ where: { organizationId, balance: { gt: 0 }, dueDate: { lt: new Date() } }, select: { id: true, dueDate: true, balance: true, contract: { select: { reference: true, tenant: { select: { firstName: true, lastName: true } }, property: { select: { name: true } } } } }, orderBy: { dueDate: "asc" }, take: 100 });
}

export async function getVacantProperties() {
  const { organizationId } = await requireContext("properties.read");
  return db.property.findMany({ where: { organizationId, status: "AVAILABLE", deletedAt: null }, select: { id: true, reference: true, name: true, city: true, district: true, monthlyRent: true, currency: true }, take: 100 });
}

export async function getExpiringLeases(days = 60) {
  const { organizationId } = await requireContext("properties.read");
  const endDate = new Date(); endDate.setUTCDate(endDate.getUTCDate() + Math.min(Math.max(days, 1), 365));
  return db.contract.findMany({ where: { organizationId, status: "ACTIVE", deletedAt: null, endDate: { gte: new Date(), lte: endDate } }, select: { id: true, reference: true, endDate: true, tenant: { select: { firstName: true, lastName: true } }, property: { select: { name: true } } }, take: 100 });
}

export async function getMonthlyRevenue(start: Date, end: Date) {
  const { organizationId } = await requireContext("finance.read");
  return db.payment.aggregate({ where: { organizationId, status: "CONFIRMED", paidAt: { gte: start, lte: end }, deletedAt: null }, _sum: { amount: true }, _count: true });
}

export async function getOwnerStatements() {
  const { organizationId } = await requireContext("finance.read");
  return db.ownerStatement.findMany({ where: { organizationId }, select: { id: true, reference: true, netAmount: true, status: true, periodStart: true, periodEnd: true, owner: { select: { firstName: true, lastName: true, company: true } } }, orderBy: { periodEnd: "desc" }, take: 100 });
}
