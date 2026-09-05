import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const artifactDirectory = path.join(process.cwd(), "artifacts", "v3");

test("generate the V3 visual QA set", async ({ page }) => {
  await mkdir(artifactDirectory, { recursive: true });

  for (const width of [1440, 1280, 768, 390]) {
    await page.setViewportSize({ width, height: width >= 1024 ? 1000 : 900 });
    await page.goto("/");
    await page.locator(".ii-hero-shell").waitFor();
    await page.screenshot({ path: path.join(artifactDirectory, `home-${width}.jpg`), fullPage: true, type: "jpeg", quality: 72 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const sections = [
    ["hero", ".ii-hero-shell"],
    ["product", "#produit"],
    ["ai", "#intelligence"],
    ["owner", "#proprietaires"],
    ["crm", "#crm"],
    ["pricing", "#tarifs"],
    ["final-cta", ".ii-final-cta"],
  ] as const;

  for (const [name, selector] of sections) {
    const section = page.locator(selector);
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({ path: path.join(artifactDirectory, `${name}.jpg`), type: "jpeg", quality: 82 });
  }
});
