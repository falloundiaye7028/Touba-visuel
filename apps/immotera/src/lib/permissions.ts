export const roles = ["OWNER", "ADMIN", "MANAGER", "AGENT", "ACCOUNTANT", "VIEWER"] as const;
export type Role = (typeof roles)[number];

export const permissions = [
  "organization.manage", "users.manage", "properties.write", "properties.read",
  "crm.write", "finance.write", "finance.read", "maintenance.write", "reports.read", "audit.read",
] as const;
export type Permission = (typeof permissions)[number];

const rolePermissions: Record<Role, ReadonlySet<Permission>> = {
  OWNER: new Set(permissions),
  ADMIN: new Set(permissions),
  MANAGER: new Set(["properties.write", "properties.read", "crm.write", "finance.read", "maintenance.write", "reports.read"]),
  AGENT: new Set(["properties.read", "crm.write", "maintenance.write"]),
  ACCOUNTANT: new Set(["properties.read", "finance.write", "finance.read", "reports.read"]),
  VIEWER: new Set(["properties.read", "finance.read", "reports.read"]),
};

export function can(role: Role, permission: Permission) {
  return rolePermissions[role].has(permission);
}

export function assertTenantScope(activeOrganizationId: string, recordOrganizationId: string) {
  if (activeOrganizationId !== recordOrganizationId) throw new Error("TENANT_SCOPE_VIOLATION");
}
