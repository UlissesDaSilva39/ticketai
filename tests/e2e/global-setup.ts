import { chromium, FullConfig } from "@playwright/test";
import path from "path";
import fs from "fs";

const AUTH_DIR = path.join(__dirname, ".auth");
const AUTH_FILE = path.join(AUTH_DIR, "user.json");

async function globalSetup(config: FullConfig) {
  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  const baseURL = config.projects[0]?.use?.baseURL || "http://localhost:3000";
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    console.log("[globalSetup] No TEST_USER_EMAIL/PASSWORD - skipping auth setup");
    await browser.close();
    return;
  }

  try {
    await page.goto(`${baseURL}/login`, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 });
    await context.storageState({ path: AUTH_FILE });
    console.log("[globalSetup] Auth state saved to", AUTH_FILE);
  } catch (e) {
    console.log("[globalSetup] Login failed:", (e as Error).message);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
