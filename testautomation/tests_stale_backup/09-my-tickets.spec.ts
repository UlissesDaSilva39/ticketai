import { test, expect } from "@playwright/test";
import { signInAsDemo } from "../helpers/auth";

test.describe("My Tickets page", () => {
  test("requires login", async ({ page }) => {
    await page.goto("/my-tickets");
    await expect(page).toHaveURL(/\/login/);
  });

  test("loads when signed in", async ({ page }) => {
    await signInAsDemo(page);
    const res = await page.goto("/my-tickets");
    expect(res?.status()).toBeLessThan(400);
  });
});
