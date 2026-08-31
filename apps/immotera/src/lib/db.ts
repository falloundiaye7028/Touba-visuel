import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { intelligenceImmobilierPrisma?: PrismaClient };

export const db = globalForPrisma.intelligenceImmobilierPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.intelligenceImmobilierPrisma = db;
