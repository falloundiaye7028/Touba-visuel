import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { canWithOverrides, type Permission, type Role } from "@/lib/permissions";

export async function requireContext(permission?: Permission) {
  if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
    return { userId: "00000000-0000-4000-8000-000000000001", organizationId: "00000000-0000-4000-8000-000000000101", role: "OWNER" as Role };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  const cookieStore = await cookies();
  const activeOrganizationId = cookieStore.get("intelligenceimmobilier.organization")?.value;
  if (!activeOrganizationId) throw new Error("ORGANIZATION_REQUIRED");
  const membership = await db.membership.findUnique({ where: { userId_organizationId: { userId: session.user.id, organizationId: activeOrganizationId } } });
  if (!membership?.isActive) throw new Error("FORBIDDEN");
  const role = membership.role as Role;
  if (permission && !canWithOverrides(role, permission, membership.permissions)) throw new Error("FORBIDDEN");
  return { userId: session.user.id, organizationId: activeOrganizationId, role };
}
