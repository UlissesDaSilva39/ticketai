import 'dotenv/config';
import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import path from "path";

const authFile = path.join(__dirname, "tests/e2e", ".auth", "user.json");
const storageState = fs.existsSync(authFile) ? authFile : undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  timeout: 60000,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    storageState,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 60000,
    actionTimeout: 20000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
