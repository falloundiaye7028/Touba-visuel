import { z } from "zod";
import { prisma } from "@/lib/db";
import { auditData, requireTckRole, tckApiError, tckReference, TCK_STAFF_ROLES } from "@/lib/tck/server";

const createContributionSchema = z.object({
  memberCode: z.string().trim().min(3).max(80),
  amount: z.coerce.number().int().min(100).max(1_000_000_000),
  channel: z.string().trim().min(2).max(80),
  externalReference: z.string().trim().min(2).max(160).optional(),
});

export async function GET() {
  try {
    await requireTckRole(TCK_STAFF_ROLES);
    const records = await prisma.tckContribution.findMany({ include: { member: true }, orderBy: { contributedAt: "desc" }, take: 500 });
    return Response.json({ records });
  } catch (error) {
    return tckApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireTckRole(["ADMIN", "COLLECTOR"]);
    const parsed = createContributionSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Contribution invalide", issues: parsed.error.flatten() }, { status: 400 });
    const member = await prisma.tckMember.findUnique({ where: { memberCode: parsed.data.memberCode.toUpperCase() } });
    if (!member) return Response.json({ error: "Membre TCK introuvable" }, { status: 404 });

    const contribution = await prisma.$transaction(async (tx) => {
      const { memberCode: _memberCode, ...contributionData } = parsed.data;
      const created = await tx.tckContribution.create({ data: { ...contributionData, memberId: member.id, recordedById: actor.id, receiptNumber: tckReference("REC"), externalReference: contributionData.externalReference || undefined } });
      await tx.tckAuditEvent.create({ data: { action: "CONTRIBUTION_CREATED", entity: "CONTRIBUTION", entityId: created.id, actorId: actor.id, metadata: auditData({ receiptNumber: created.receiptNumber, memberCode: member.memberCode, amount: created.amount, channel: created.channel }) } });
      return created;
    });
    return Response.json({ record: contribution }, { status: 201 });
  } catch (error) {
    return tckApiError(error);
  }
}
