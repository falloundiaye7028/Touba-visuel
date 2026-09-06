import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("Touba Infos MCP HTTP gate", () => {
  it("refuse une initialisation sans authentification et annonce OAuth", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/touba-infos/mcp", {
        method: "POST",
        headers: {
          Host: "localhost:3000",
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-11-25",
            capabilities: {},
            clientInfo: { name: "unauthenticated-test", version: "1.0.0" },
          },
        }),
      }),
    );

    expect(response.status).toBe(401);
    expect(response.headers.get("www-authenticate")).toContain("Bearer");
    expect(response.headers.get("www-authenticate")).toContain(
      "resource_metadata",
    );
    await expect(response.json()).resolves.toMatchObject({
      error: "invalid_token",
    });
  });
});
