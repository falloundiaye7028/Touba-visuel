import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const staffRoles = new Set(["ADMIN", "COLLECTOR", "COMMISSION_MANAGER", "CONTROLLER"]);

async function main() {
  const email = process.env.TCK_ADMIN_EMAIL?.trim().toLowerCase();
  const role = (process.env.TCK_ADMIN_ROLE || "ADMIN").trim().toUpperCase();
  const password = process.env.TCK_ADMIN_PASSWORD;
  const name = process.env.TCK_ADMIN_NAME?.trim() || "Administrateur TCK";

  if (!email) throw new Error("TCK_ADMIN_EMAIL est obligatoire.");
  if (!staffRoles.has(role)) throw new Error(`TCK_ADMIN_ROLE invalide : ${role}`);

  let user = await prisma.user.findUnique({ where: { email } });
  let createdUser = false;
  if (!user) {
    if (!password || password.length < 12) {
      throw new Error("Le compte n’existe pas : TCK_ADMIN_PASSWORD (12 caractères minimum) est obligatoire pour le créer.");
    }
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 12),
      },
    });
    createdUser = true;
  }

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

  console.log(`${createdUser ? "Compte créé et activé" : "Compte TCK activé"} : ${member.memberCode} · ${member.role} · ${email}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
