import { randomUUID } from "node:crypto";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  organizationName: z.string().min(2).max(160), country: z.string().length(2), currency: z.string().length(3), organizationPhone: z.string().max(40).optional(),
  ownerFirstName: z.string().max(100).optional(), ownerLastName: z.string().min(2).max(100), ownerPhone: z.string().max(40).optional(), ownerEmail: z.union([z.string().email(), z.literal("")]).optional(),
  propertyName: z.string().min(2).max(160), propertyType: z.string().min(2).max(50), monthlyRent: z.number().int().nonnegative().max(10_000_000_000), propertyAddress: z.string().min(4).max(250),
});

function slugify(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 45); }

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Données d’onboarding invalides" }, { status: 400 });
  const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  if (demoMode) {
    const response = NextResponse.json({ organizationId: "00000000-0000-4000-8000-000000000101", demo: true }, { status: 201 });
    response.cookies.set("intelligenceimmobilier.organization", "00000000-0000-4000-8000-000000000101", { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
    return response;
  }
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  const userId = session.user.id;
  const input = parsed.data;
  const result = await db.$transaction(async (transaction) => {
    const organization = await transaction.organization.create({ data: { name: input.organizationName, slug: `${slugify(input.organizationName)}-${randomUUID().slice(0,6)}`, phone: input.organizationPhone, country: input.country, currency: input.currency, locale: "fr-SN" } });
    await transaction.membership.create({ data: { userId, organizationId: organization.id, role: "OWNER" } });
    const owner = await transaction.owner.create({ data: { organizationId: organization.id, firstName: input.ownerFirstName, lastName: input.ownerLastName, phone: input.ownerPhone, email: input.ownerEmail || undefined } });
    const property = await transaction.property.create({ data: { organizationId: organization.id, reference: "PROP-001", name: input.propertyName, type: input.propertyType.toUpperCase(), address: input.propertyAddress, city: "Dakar", country: input.country, currency: input.currency, monthlyRent: input.monthlyRent, owners: { create: { ownerId: owner.id } } } });
    await transaction.auditLog.create({ data: { organizationId: organization.id, actorId: userId, action: "ORGANIZATION_ONBOARDED", resourceType: "Organization", resourceId: organization.id, after: { organization: organization.name, ownerId: owner.id, propertyId: property.id } } });
    return { organizationId: organization.id };
  });
  const response = NextResponse.json(result, { status: 201 });
  response.cookies.set("intelligenceimmobilier.organization", result.organizationId, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
  return response;
}
