import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { immoteraPrisma?: PrismaClient };

export const db = globalForPrisma.immoteraPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.immoteraPrisma = db;
