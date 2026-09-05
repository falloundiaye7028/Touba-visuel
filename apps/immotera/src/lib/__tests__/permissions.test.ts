import { describe, expect, it } from "vitest";
import { assertTenantScope, can } from "../permissions";

describe("RBAC and tenant isolation", () => {
  it("does not allow a viewer to write finances", () => expect(can("VIEWER", "finance.write")).toBe(false));
  it("allows an accountant to write finances", () => expect(can("ACCOUNTANT", "finance.write")).toBe(true));
  it("rejects cross-organization access", () => expect(() => assertTenantScope("org-a", "org-b")).toThrow("TENANT_SCOPE_VIOLATION"));
});
