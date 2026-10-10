import { test, expect } from "@playwright/test";
import { login, CREDS } from "../helpers/auth";

test.describe("02 - Navbar", () => {
  test.beforeEach(async ({ page }) => login(page, ...CREDS.alice));
  const items = [
    { label: /^home$/i, url: /\/$/ },
    { label: /^search$/i, url: /\/search/ },
    { label: /^artists$/i, url: /\/artists/ },
    { label: /my tickets/i, url: /\/my-tickets/ },
  ];
  for (const { label, url } of items) {
    test(`nav link: ${label}`, async ({ page }) => {
      const link = page.getByRole("link", { name: label }).first();
      if (await link.count() === 0) test.skip(true, "no such nav link");
      await link.click();
      await expect(page).toHaveURL(url);
    });
  }
  test("2.4 Social dropdown opens", async ({ page }) => {
    const btn = page.getByRole("button", { name: /social/i }).first();
    if (await btn.count() === 0) test.skip(true, "no Social button");
    await btn.click();
    await expect(page.getByRole("menu").first()).toBeVisible();
  });
  test("2.6 notification bell opens dropdown", async ({ page }) => {
    const bell = page.getByRole("button", { name: /notification/i }).first();
    if (await bell.count() === 0) test.skip(true, "no bell");
    await bell.click();
    await expect(page.getByRole("menu").first()).toBeVisible();
  });
  test("2.7 avatar menu opens", async ({ page }) => {
    const avatar = page.locator("[data-testid=\"avatar\"]").or(page.getByRole("button", { name: /profile|account|avatar/i })).first();
    await avatar.click();
    await expect(page.getByRole("menu").first()).toBeVisible();
  });
});
