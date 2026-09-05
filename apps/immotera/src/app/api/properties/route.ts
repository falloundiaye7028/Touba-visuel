import { z } from "zod";
import { db } from "@/lib/db";
import { requireContext } from "@/lib/server-context";

const propertyInput = z.object({ reference: z.string().min(3).max(40), name: z.string().min(2).max(160), type: z.string().min(2).max(50), address: z.string().min(4).max(250), district: z.string().max(100).optional(), city: z.string().min(2).max(100), monthlyRent: z.number().int().nonnegative(), ownerId: z.string().uuid().optional() });

export async function GET() {
  try {
    const context = await requireContext("properties.read");
    const properties = await db.property.findMany({ where: { organizationId: context.organizationId, deletedAt: null }, orderBy: { createdAt: "desc" }, take: 50, select: { id: true, reference: true, name: true, type: true, status: true, city: true, district: true, monthlyRent: true, currency: true } });
    return Response.json({ data: properties });
  } catch { return Response.json({ error: "Unauthorized" }, { status: 401 }); }
}

export async function POST(request: Request) {
  try {
    const context = await requireContext("properties.write");
    const input = propertyInput.parse(await request.json());
    const property = await db.$transaction(async (transaction) => {
      const { ownerId, ...propertyData } = input;
      const created = await transaction.property.create({ data: { ...propertyData, organizationId: context.organizationId, country: "SN", currency: "XOF", owners: ownerId ? { create: { ownerId } } : undefined } });
      await transaction.auditLog.create({ data: { organizationId: context.organizationId, actorId: context.userId, action: "PROPERTY_CREATED", resourceType: "Property", resourceId: created.id, after: { reference: created.reference, name: created.name } } });
      return created;
    });
    return Response.json(property, { status: 201 });
  } catch (cause) { return Response.json({ error: cause instanceof Error ? cause.message : "PROPERTY_FAILED" }, { status: 400 }); }
}
