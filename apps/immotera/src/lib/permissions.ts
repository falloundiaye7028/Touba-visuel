export const roles = ["OWNER", "ADMIN", "MANAGER", "AGENT", "ACCOUNTANT", "VIEWER"] as const;
export type Role = (typeof roles)[number];

export const permissions = [
  "organization.manage", "users.manage", "properties.write", "properties.read",
  "crm.write", "finance.write", "finance.read", "maintenance.write", "reports.read", "audit.read",
  "documents.read", "documents.write", "documents.delete",
] as const;
export type Permission = (typeof permissions)[number];

const rolePermissions: Record<Role, ReadonlySet<Permission>> = {
  OWNER: new Set(permissions),
  ADMIN: new Set(permissions),
  MANAGER: new Set(["properties.write", "properties.read", "crm.write", "finance.read", "maintenance.write", "reports.read", "documents.read", "documents.write", "documents.delete"]),
  AGENT: new Set(["properties.read", "crm.write", "maintenance.write", "documents.read"]),
  ACCOUNTANT: new Set(["properties.read", "finance.write", "finance.read", "reports.read", "documents.read"]),
  VIEWER: new Set(["properties.read", "finance.read", "reports.read", "documents.read"]),
};

export function can(role: Role, permission: Permission) {
  return rolePermissions[role].has(permission);
}

export function canWithOverrides(role: Role, permission: Permission, overrides: unknown) {
  if (can(role, permission)) return true;
  if (!Array.isArray(overrides)) return false;
  return overrides.some((item) => item === permission);
}

export function assertTenantScope(activeOrganizationId: string, recordOrganizationId: string) {
  if (activeOrganizationId !== recordOrganizationId) throw new Error("TENANT_SCOPE_VIOLATION");
}
