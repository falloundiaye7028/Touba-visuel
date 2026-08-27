import { z } from "zod";
import { prisma } from "@/lib/db";
import { auditData, requireTckRole, tckApiError, tckReference, TCK_STAFF_ROLES } from "@/lib/tck/server";

const createMemberSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional(),
  zone: z.string().trim().max(120).optional(),
  country: z.string().trim().min(2).max(80).default("Sénégal"),
});

export async function GET() {
  try {
    await requireTckRole(TCK_STAFF_ROLES);
    const records = await prisma.tckMember.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
    return Response.json({ records });
  } catch (error) {
    return tckApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireTckRole(["ADMIN", "COLLECTOR"]);
    const parsed = createMemberSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Données membre invalides", issues: parsed.error.flatten() }, { status: 400 });

    const member = await prisma.$transaction(async (tx) => {
      const created = await tx.tckMember.create({ data: { ...parsed.data, memberCode: tckReference("TCK"), role: "MEMBER" } });
      await tx.tckAuditEvent.create({ data: { action: "MEMBER_CREATED", entity: "MEMBER", entityId: created.id, actorId: actor.id, metadata: auditData({ memberCode: created.memberCode, name: created.name, zone: created.zone }) } });
      return created;
    });
    return Response.json({ record: member }, { status: 201 });
  } catch (error) {
    return tckApiError(error);
  }
}
