import { prisma } from "@/lib/db";
import { tckContributionSchema } from "@/lib/tck/contribution";
import { auditData, requireTckRole, tckApiError, tckReference, TCK_STAFF_ROLES } from "@/lib/tck/server";

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
    const parsed = tckContributionSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Contribution invalide", issues: parsed.error.flatten() }, { status: 400 });
    const member = await prisma.tckMember.findUnique({ where: { memberCode: parsed.data.memberCode } });
    if (!member) return Response.json({ error: "Membre TCK introuvable" }, { status: 404 });
    if (member.status === "SUSPENDED") return Response.json({ error: "Ce membre est suspendu" }, { status: 400 });
    if (parsed.data.externalReference) {
      const duplicate = await prisma.tckContribution.findUnique({ where: { externalReference: parsed.data.externalReference }, select: { id: true } });
      if (duplicate) return Response.json({ error: "Cette référence de transaction a déjà été utilisée" }, { status: 409 });
    }

    const contribution = await prisma.$transaction(async (tx) => {
      const { memberCode: _memberCode, ...contributionData } = parsed.data;
      const created = await tx.tckContribution.create({ data: { ...contributionData, memberId: member.id, recordedById: actor.id, receiptNumber: tckReference("REC"), externalReference: contributionData.externalReference || undefined } });
      await tx.tckAuditEvent.create({ data: { action: "CONTRIBUTION_CREATED", entity: "CONTRIBUTION", entityId: created.id, actorId: actor.id, metadata: auditData({ receiptNumber: created.receiptNumber, memberCode: member.memberCode, amount: created.amount, channel: created.channel }) } });
      return created;
    });
    return Response.json({
      record: {
        receiptNumber: contribution.receiptNumber,
        amount: contribution.amount,
        channel: contribution.channel,
        externalReference: contribution.externalReference,
        contributedAt: contribution.contributedAt,
        status: contribution.status,
        member: { memberCode: member.memberCode, name: member.name, zone: member.zone },
        recordedBy: { memberCode: actor.memberCode, name: actor.name },
      },
    }, { status: 201 });
  } catch (error) {
    return tckApiError(error);
  }
}
