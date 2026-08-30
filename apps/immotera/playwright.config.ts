import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:3015", trace: "on-first-retry", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" } }],
  webServer: { command: "npm run dev -- -p 3015", url: "http://localhost:3015", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
