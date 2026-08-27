import { prisma } from "@/lib/db";
import { requireTckRole, TCK_STAFF_ROLES, tckApiError } from "@/lib/tck/server";

export async function GET() {
  try {
    const actor = await requireTckRole(TCK_STAFF_ROLES);
    const [members, contributions, projects, expenses, audit] = await Promise.all([
      prisma.tckMember.findMany({ orderBy: { createdAt: "desc" }, take: 250 }),
      prisma.tckContribution.findMany({ include: { member: true }, orderBy: { contributedAt: "desc" }, take: 250 }),
      prisma.tckProject.findMany({ orderBy: { updatedAt: "desc" }, take: 100 }),
      prisma.tckExpense.findMany({ include: { _count: { select: { approvals: true } } }, orderBy: { submittedAt: "desc" }, take: 100 }),
      prisma.tckAuditEvent.findMany({ include: { actor: { select: { name: true, memberCode: true } } }, orderBy: { createdAt: "desc" }, take: 250 }),
    ]);
    return Response.json({ mode: "server", actor, members, contributions, projects, expenses, audit });
  } catch (error) {
    return tckApiError(error);
  }
}
