import { afterEach, describe, expect, it } from "vitest";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { createToubaInfosMcpServer } from "@/lib/touba-infos-mcp-server";

const closers: Array<() => Promise<void>> = [];

afterEach(async () => {
  while (closers.length) await closers.pop()?.();
});

describe("Touba Infos MCP server", () => {
  it("expose exactement les quatre outils prévus, sans suppression", async () => {
    const handler = createMcpHandler(() => createToubaInfosMcpServer(), {
      responseMode: "json",
    });
    const transport = new StreamableHTTPClientTransport(
      new URL("http://test.local/mcp"),
      {
        fetch: (url, init) => handler.fetch(new Request(url, init)),
      },
    );
    const client = new Client(
      { name: "touba-infos-test", version: "1.0.0" },
      { versionNegotiation: { mode: "auto" } },
    );
    closers.push(async () => {
      await client.close();
      await handler.close();
    });

    await client.connect(transport);
    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name).sort()).toEqual([
      "create_article_draft",
      "get_article_status",
      "publish_article",
      "update_article_draft",
    ]);
    expect(tools.tools.some((tool) => tool.name.includes("delete"))).toBe(false);
    expect(
      tools.tools.find((tool) => tool.name === "get_article_status")?.annotations
        ?.readOnlyHint,
    ).toBe(true);
    expect(
      tools.tools.find((tool) => tool.name === "publish_article")?.annotations
        ?.readOnlyHint,
    ).toBe(false);
  });
});
