import { Prisma, TckRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/sama/auth";
import { prisma } from "@/lib/db";

export class TckHttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireTckRole(allowed: TckRole[]) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) throw new TckHttpError(401, "Authentification requise");

  const actor = await prisma.tckMember.findUnique({ where: { userId } });
  if (!actor) throw new TckHttpError(403, "Compte TCK non activé");
  if (!allowed.includes(actor.role)) throw new TckHttpError(403, "Permission insuffisante");
  return actor;
}

export function tckApiError(error: unknown) {
  if (error instanceof TckHttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("TCK API error", error);
  return Response.json(
    { error: "Service TCK temporairement indisponible", code: "TCK_SERVICE_UNAVAILABLE" },
    { status: 503 },
  );
}

export function tckReference(prefix: string) {
  const date = new Date();
  const stamp = `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;
  return `${prefix}-${stamp}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export function auditData(data: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

export const TCK_ALL_ROLES: TckRole[] = ["ADMIN", "COLLECTOR", "COMMISSION_MANAGER", "CONTROLLER", "MEMBER"];
export const TCK_STAFF_ROLES: TckRole[] = ["ADMIN", "COLLECTOR", "COMMISSION_MANAGER", "CONTROLLER"];
