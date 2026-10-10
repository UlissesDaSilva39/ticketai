import { Page, expect } from "@playwright/test";

export const CREDS = {
  alice: [process.env.ALICE_EMAIL!, process.env.ALICE_PASSWORD!] as const,
  bob: [process.env.BOB_EMAIL!, process.env.BOB_PASSWORD!] as const,
  promoter: [process.env.PROMOTER_EMAIL!, process.env.PROMOTER_PASSWORD!] as const,
};

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).or(page.locator("input[type=\"email\"]")).first();
  const passwordInput = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).or(page.locator("input[type=\"password\"]")).first();
  await emailInput.waitFor({ state: "visible" });
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await page.getByRole("button", { name: /sign in|log in|login/i }).first().click();
  await page.waitForURL((u) => !u.pathname.includes("/login"), { timeout: 20000 });
}

export async function logout(page: Page) {
  const avatar = page.locator("[data-testid=\"avatar\"]").or(page.getByRole("button", { name: /profile|account|avatar/i })).first();
  await avatar.click();
  await page.getByRole("menuitem", { name: /sign out|log out/i }).first().click();
  await page.waitForURL(/\/$|\/login/);
}

export async function expectRedirectToLogin(page: Page, path: string) {
  await page.goto(path);
  await expect(page).toHaveURL(/\/login/);
}
