import { test, expect } from "@playwright/test";
import { login, CREDS } from "../helpers/auth";

test.describe("05 - My Tickets", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ...CREDS.alice);
    await page.goto("/my-tickets");
  });
  test("5.1 page header", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /my tickets/i }).first()).toBeVisible();
    await expect(page.getByText(/Signed in as/i).first()).toBeVisible();
  });
  test("5.2 at least one ticket", async ({ page }) => {
    const cards = page.locator("div, article").filter({ hasText: /VALID|USED|RETURNED/ });
    expect(await cards.count()).toBeGreaterThan(0);
  });
  test("5.3 status badges and prices", async ({ page }) => {
    await expect(page.getByText(/^\s*(VALID|USED|RETURNED)\s*$/).first()).toBeVisible();
    await expect(page.getByText(/£\d/).first()).toBeVisible();
  });
  test("5.4 print / QR actions", async ({ page }) => {
    await expect(page.getByText(/Print Ticket|Ticket QR code/i).first()).toBeVisible();
  });
});
