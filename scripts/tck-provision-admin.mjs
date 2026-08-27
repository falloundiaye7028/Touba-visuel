import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const staffRoles = new Set(["ADMIN", "COLLECTOR", "COMMISSION_MANAGER", "CONTROLLER"]);

async function main() {
  const email = process.env.TCK_ADMIN_EMAIL?.trim().toLowerCase();
  const role = (process.env.TCK_ADMIN_ROLE || "ADMIN").trim().toUpperCase();

  if (!email) throw new Error("TCK_ADMIN_EMAIL est obligatoire.");
  if (!staffRoles.has(role)) throw new Error(`TCK_ADMIN_ROLE invalide : ${role}`);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error(`Aucun compte utilisateur trouvé pour ${email}. Créez d’abord le compte via l’inscription existante.`);

  const memberCode = `TCK-STAFF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const member = await prisma.tckMember.upsert({
    where: { userId: user.id },
    update: { name: user.name || email, phone: user.phone, role, status: "ACTIVE" },
    create: {
      memberCode,
      userId: user.id,
      name: user.name || email,
      phone: user.phone,
      country: "Sénégal",
      role,
      status: "ACTIVE",
    },
  });

  console.log(`Compte TCK activé : ${member.memberCode} · ${member.role} · ${email}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
