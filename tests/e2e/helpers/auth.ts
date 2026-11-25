import { Page } from "@playwright/test";

export async function tryLogin(
  page: Page,
  email = process.env.E2E_EMAIL ?? "test@example.com",
  password = process.env.E2E_PASSWORD ?? "password123"
): Promise<boolean> {
  const candidates = ["/login", "/auth/login", "/signin", "/auth/signin"];
  for (const path of candidates) {
    const res = await page.goto(path, { waitUntil: "domcontentloaded" }).catch(() => null);
    if (!res || res.status() >= 400) continue;

    const emailInput = page.locator(
      'input[type="email"], input[name="email"], input[id="email"]'
    ).first();
    if (!(await emailInput.count())) continue;

    await emailInput.fill(email);
    const pwInput = page.locator(
      'input[type="password"], input[name="password"], input[id="password"]'
    ).first();
    if (await pwInput.count()) await pwInput.fill(password);

    const submit = page.locator(
      'button[type="submit"], button:has-text("Log in"), button:has-text("Login"), button:has-text("Sign in")'
    ).first();
    if (await submit.count()) {
      await submit.click();
      await page.waitForLoadState("networkidle").catch(() => {});
      return true;
    }
  }
  return false;
}