const fs = require("fs");
const content = `import { chromium, FullConfig } from "@playwright/test";
import path from "path";
import fs from "fs";

const AUTH_DIR = path.join(__dirname, ".auth");
const AUTH_FILE = path.join(AUTH_DIR, "user.json");

async function globalSetup(config: FullConfig) {
  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  if (!email || !password) {
    console.log("[globalSetup] No TEST_USER_EMAIL/PASSWORD - skipping");
    return;
  }
  const baseURL = config.projects[0]?.use?.baseURL || "http://localhost:3000";
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    console.log("[globalSetup] Navigating to " + baseURL + "/login");
    await page.goto(baseURL + "/login", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("input", { timeout: 15000 });
    let emailInput = page.locator('input[type="email"]').first();
    if ((await emailInput.count()) === 0) emailInput = page.locator('input[name="email"]').first();
    if ((await emailInput.count()) === 0) emailInput = page.locator('input[placeholder*="mail" i]').first();
    if ((await emailInput.count()) === 0) emailInput = page.locator("input").first();
    let passwordInput = page.locator('input[type="password"]').first();
    if ((await passwordInput.count()) === 0) passwordInput = page.locator('input[name="password"]').first();
    if ((await passwordInput.count()) === 0) passwordInput = page.locator("input").nth(1);
    await emailInput.fill(email);
    await passwordInput.fill(password);
    let submit = page.getByRole("button", { name: /sign in|log in|login|continue|submit/i }).first();
    if ((await submit.count()) === 0) submit = page.locator('button[type="submit"]').first();
    if ((await submit.count()) === 0) submit = page.locator("form button").first();
    await submit.click();
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20000 });
    await context.storageState({ path: AUTH_FILE });
    console.log("[globalSetup] Auth state saved");
  } catch (e) {
    console.log("[globalSetup] FAILED: " + (e as Error).message);
    try {
      const html = await page.content();
      fs.writeFileSync(path.join(AUTH_DIR, "login-debug.html"), html);
      console.log("[globalSetup] Dumped login HTML");
    } catch {}
  } finally {
    await browser.close();
  }
}
export default globalSetup;
`;
fs.writeFileSync("tests/e2e/global-setup.ts", content, "utf8");
console.log("  global-setup.ts rewritten (" + content.split("\n").length + " lines)");
