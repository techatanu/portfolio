import { defineConfig, devices } from "@playwright/test";

// Runs against the static export in out/ (run `npm run build` first).
const PORT = 4173;

export default defineConfig({
  testDir: "tests",
  outputDir: "test-results",
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `python3 scripts/serve-out.py ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
