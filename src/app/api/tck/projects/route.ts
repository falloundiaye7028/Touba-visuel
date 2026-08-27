import { z } from "zod";
import { prisma } from "@/lib/db";
import { auditData, requireTckRole, tckApiError, tckReference, TCK_STAFF_ROLES } from "@/lib/tck/server";

const createProjectSchema = z.object({
  name: z.string().trim().min(3).max(180),
  domain: z.string().trim().min(2).max(100),
  place: z.string().trim().max(160).optional(),
  budget: z.coerce.number().int().min(0).max(2_000_000_000),
  status: z.enum(["PLANNED", "IN_PROGRESS", "FINALIZATION", "COMPLETED"]).default("PLANNED"),
  public: z.boolean().default(true),
});

export async function GET() {
  try {
    await requireTckRole(TCK_STAFF_ROLES);
    const records = await prisma.tckProject.findMany({ orderBy: { updatedAt: "desc" }, take: 250 });
    return Response.json({ records });
  } catch (error) {
    return tckApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireTckRole(["ADMIN", "COMMISSION_MANAGER"]);
    const parsed = createProjectSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Projet invalide", issues: parsed.error.flatten() }, { status: 400 });
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.tckProject.create({ data: { ...parsed.data, projectCode: tckReference("PRJ"), createdById: actor.id } });
      await tx.tckAuditEvent.create({ data: { action: "PROJECT_CREATED", entity: "PROJECT", entityId: created.id, actorId: actor.id, metadata: auditData({ projectCode: created.projectCode, name: created.name, budget: created.budget }) } });
      return created;
    });
    return Response.json({ record: project }, { status: 201 });
  } catch (error) {
    return tckApiError(error);
  }
}
