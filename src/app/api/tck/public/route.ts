import { prisma } from "@/lib/db";
import { tckApiError } from "@/lib/tck/server";

export async function GET() {
  try {
    const [activeMembers, monthly, projects] = await Promise.all([
      prisma.tckMember.count({ where: { status: "ACTIVE" } }),
      prisma.tckContribution.aggregate({
        where: { contributedAt: { gte: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)) }, status: "VALIDATED" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.tckProject.findMany({ where: { public: true }, select: { projectCode: true, name: true, domain: true, place: true, budget: true, spent: true, progress: true, status: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 24 }),
    ]);
    return Response.json({ activeMembers, collectedThisMonth: monthly._sum.amount || 0, contributionCount: monthly._count, projects }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  } catch (error) {
    return tckApiError(error);
  }
}
