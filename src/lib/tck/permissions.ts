/** Le référentiel d'autorisation TCK. Les contrôles UI ne remplacent jamais ce contrôle serveur. */
export const TCK_ROLES = [
  "SUPER_ADMIN", "MORAL_AUTHORITY", "DIRECTING_COMMITTEE", "EXECUTIVE_BOARD",
  "GENERAL_SECRETARIAT", "COMMISSION_LEAD", "FINANCE_TEAM", "AUDITOR",
  "COLLECTOR", "FIELD_AGENT", "ZONE_MANAGER", "MEMBER", "PARTNER", "PUBLIC",
] as const;

export type TckRole = (typeof TCK_ROLES)[number];
export type TckAction =
  | "dashboard:read" | "member:read" | "member:write" | "contribution:collect"
  | "expense:request" | "expense:approve" | "expense:pay" | "expense:audit"
  | "project:read" | "project:write" | "request:read" | "request:write"
  | "report:public-read" | "audit:read";

const EVERY_INTERNAL: TckAction[] = ["dashboard:read", "project:read", "report:public-read"];

const permissions: Record<TckRole, readonly TckAction[]> = {
  SUPER_ADMIN: [...EVERY_INTERNAL, "member:read", "member:write", "project:write", "request:read", "request:write", "audit:read"],
  MORAL_AUTHORITY: [...EVERY_INTERNAL, "member:read", "request:read", "audit:read"],
  DIRECTING_COMMITTEE: [...EVERY_INTERNAL, "member:read", "expense:approve", "project:write", "request:read", "audit:read"],
  EXECUTIVE_BOARD: [...EVERY_INTERNAL, "member:read", "expense:request", "expense:approve", "project:write", "request:read"],
  GENERAL_SECRETARIAT: [...EVERY_INTERNAL, "member:read", "member:write", "expense:request", "project:write", "request:read", "request:write"],
  COMMISSION_LEAD: [...EVERY_INTERNAL, "member:read", "expense:request", "expense:approve", "project:write", "request:read", "request:write"],
  FINANCE_TEAM: [...EVERY_INTERNAL, "member:read", "expense:approve", "expense:pay", "audit:read"],
  AUDITOR: [...EVERY_INTERNAL, "member:read", "expense:audit", "audit:read"],
  COLLECTOR: ["dashboard:read", "member:read", "contribution:collect", "report:public-read"],
  FIELD_AGENT: ["dashboard:read", "project:read", "project:write", "request:read", "request:write", "report:public-read"],
  ZONE_MANAGER: [...EVERY_INTERNAL, "member:read", "member:write", "request:read", "request:write"],
  MEMBER: ["dashboard:read", "project:read", "report:public-read"],
  PARTNER: ["dashboard:read", "project:read", "report:public-read"],
  PUBLIC: ["report:public-read"],
};

export function can(role: TckRole, action: TckAction): boolean {
  return permissions[role].includes(action);
}

export type AccessContext = { commissionId?: string; zoneId?: string; projectId?: string };
export type ResourceScope = AccessContext;

/** Un périmètre non renseigné sur l'utilisateur ne donne jamais un accès implicite. */
export function isWithinScope(user: AccessContext, resource: ResourceScope): boolean {
  return (["commissionId", "zoneId", "projectId"] as const).every((key) =>
    resource[key] === undefined || (user[key] !== undefined && user[key] === resource[key]),
  );
}
