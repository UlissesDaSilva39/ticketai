import { Page, expect } from "@playwright/test";

export const TEST_USERS = {
  demo: {
    email: process.env.DEMO_EMAIL || "demo@ticketai.org.uk",
    password: process.env.DEMO_PASSWORD || "password123",
  },
};

export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 15000,
  });
}

export async function signInAsDemo(page: Page) {
  await signIn(page, TEST_USERS.demo.email, TEST_USERS.demo.password);
}

export async function expectSignedIn(page: Page) {
  await expect(page).not.toHaveURL(/\/login/);
}
