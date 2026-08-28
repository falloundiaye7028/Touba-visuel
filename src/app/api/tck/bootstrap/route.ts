import { prisma } from "@/lib/db";
import { requireTckRole, TCK_STAFF_ROLES, tckApiError } from "@/lib/tck/server";

export async function GET() {
  try {
    const actor = await requireTckRole(TCK_STAFF_ROLES);
    const monthStart = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1));
    const [members, contributions, projects, expenses, audit, activeMembers, monthlyContributions, activeProjects] = await Promise.all([
      prisma.tckMember.findMany({ select: { memberCode: true, name: true, phone: true, zone: true, country: true, status: true, role: true, createdAt: true, user: { select: { email: true } } }, orderBy: { createdAt: "desc" }, take: 250 }),
      prisma.tckContribution.findMany({ select: { receiptNumber: true, amount: true, channel: true, contributedAt: true, member: { select: { memberCode: true, name: true, zone: true } } }, orderBy: { contributedAt: "desc" }, take: 250 }),
      prisma.tckProject.findMany({ select: { projectCode: true, name: true, domain: true, budget: true, spent: true, progress: true, place: true, status: true }, orderBy: { updatedAt: "desc" }, take: 100 }),
      prisma.tckExpense.findMany({ select: { id: true, expenseNumber: true, label: true, commission: true, amount: true, status: true, required: true, submittedAt: true, _count: { select: { approvals: true } } }, orderBy: { submittedAt: "desc" }, take: 100 }),
      prisma.tckAuditEvent.findMany({ select: { action: true, entityId: true, metadata: true, createdAt: true, actor: { select: { name: true, memberCode: true } } }, orderBy: { createdAt: "desc" }, take: 250 }),
      prisma.tckMember.count({ where: { status: "ACTIVE" } }),
      prisma.tckContribution.aggregate({ where: { status: "VALIDATED", contributedAt: { gte: monthStart } }, _sum: { amount: true }, _count: true }),
      prisma.tckProject.count({ where: { status: { in: ["IN_PROGRESS", "FINALIZATION"] } } }),
    ]);
    return Response.json({
      mode: "server",
      actor: { id: actor.id, name: actor.name, role: actor.role },
      metrics: {
        activeMembers,
        collectedThisMonth: monthlyContributions._sum.amount || 0,
        contributionCount: monthlyContributions._count,
        activeProjects,
      },
      members,
      contributions,
      projects,
      expenses,
      audit,
    });
  } catch (error) {
    return tckApiError(error);
  }
}
