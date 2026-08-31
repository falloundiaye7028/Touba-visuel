import { hash } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();
const organizationId = "00000000-0000-4000-8000-000000000101";
const userId = "00000000-0000-4000-8000-000000000001";

async function main() {
  await prisma.user.upsert({ where: { email: "demo@intelligenceimmobilier.com" }, update: {}, create: { id: userId, name: "Mamadou Kane", email: "demo@intelligenceimmobilier.com", phone: "+221 77 000 00 00", passwordHash: await hash("Demo2026!", 12) } });
  await prisma.organization.upsert({ where: { slug: "intelligenceimmobilier-demo-dakar" }, update: {}, create: { id: organizationId, name: "IntelligenceImmobilier Démo Dakar", slug: "intelligenceimmobilier-demo-dakar", phone: "+221 33 800 00 00", email: "demo@intelligenceimmobilier.com", address: "Dakar, Sénégal", country: "SN", currency: "XOF", subscriptionPlan: "AGENCY", subscriptionStatus: "ACTIVE" } });
  await prisma.membership.upsert({ where: { userId_organizationId: { userId, organizationId } }, update: { role: "OWNER" }, create: { userId, organizationId, role: "OWNER" } });
  const owner = await prisma.owner.findFirst({ where: { organizationId, email: "aminata.fall@example.invalid" } }) ?? await prisma.owner.create({ data: { organizationId, firstName: "Aminata", lastName: "Fall", phone: "+221 77 450 18 32", email: "aminata.fall@example.invalid", preferredPayment: "WAVE" } });
  await prisma.property.upsert({ where: { organizationId_reference: { organizationId, reference: "PROP-001" } }, update: {}, create: { organizationId, reference: "PROP-001", name: "Villa Ndar", type: "VILLA", status: "RENTED", address: "Route des Almadies", district: "Almadies", city: "Dakar", country: "SN", rooms: 6, bedrooms: 4, bathrooms: 3, monthlyRent: 850000, deposit: 1700000, currency: "XOF", owners: { create: { ownerId: owner.id, share: 100 } } } });
}

main().finally(async () => prisma.$disconnect());
