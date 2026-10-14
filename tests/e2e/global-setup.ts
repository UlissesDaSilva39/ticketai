import { chromium, FullConfig } from "@playwright/test";
import path from "path";
import fs from "fs";

const AUTH_DIR = path.join(__dirname, ".auth");
const AUTH_FILE = path.join(AUTH_DIR, "user.json");

async function globalSetup(config: FullConfig) {
  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  if (!email || !password) {
    console.log("[globalSetup] No credentials - skipping auth");
    return;
  }

  const baseURL = config.projects[0]?.use?.baseURL || "http://localhost:3000";
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("pageerror", (e) => console.log("[globalSetup] pageerror:", e.message));

  try {
    console.log("[globalSetup] Navigating to", baseURL + "/login");
    await page.goto(baseURL + "/login", { waitUntil: "domcontentloaded", timeout: 60000 });

    await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 30000 });
    console.log("[globalSetup] email input found");

    await page.locator('input[type="email"], input[name="email"]').first().fill(email);
    await page.locator('input[type="password"]').first().fill(password);

    const submit = page
      .getByRole("button", { name: /sign in|log in|login|continue|submit/i })
      .first();
    await submit.click();
    console.log("[globalSetup] Submitted, waiting for redirect...");

    // KEY FIX: wait for URL to leave /login instead of fixed timeout
    try {
      await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20000 });
      console.log("[globalSetup] Auth success - URL is now", page.url());
    } catch {
      console.log("[globalSetup] Still on /login after 20s - auth failed");
      fs.writeFileSync(path.join(AUTH_DIR, "login-debug.html"), await page.content());
      try { fs.writeFileSync(path.join(AUTH_DIR, "login-debug.png"), await page.screenshot()); } catch {}
    }

    // Extra safety: wait for Supabase cookies to actually be set
    await page.waitForTimeout(1000);

    await context.storageState({ path: AUTH_FILE });
    console.log("[globalSetup] Saved storage state");
  } catch (e) {
    console.log("[globalSetup] Error:", (e as Error).message);
    try { await context.storageState({ path: AUTH_FILE }); } catch {}
  } finally {
    await browser.close();
  }
}

export default globalSetup;
