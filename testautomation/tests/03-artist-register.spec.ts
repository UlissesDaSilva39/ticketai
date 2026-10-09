import { test, expect } from "@playwright/test";
import { signInAsDemo } from "../helpers/auth";

test.describe("Artist registration page", () => {
  test("redirects to login when signed out", async ({ page }) => {
    await page.goto("/artist/register");
    await expect(page).toHaveURL(/\/login\?next=/);
  });

  test("renders the form when signed in", async ({ page }) => {
    await signInAsDemo(page);
    await page.goto("/artist/register");
    await expect(page).toHaveURL(/\/artist\/register/);
    await expect(page.getByRole("heading", { name: /artist registration/i })).toBeVisible();
    await expect(page.getByLabel(/artist \/ band name/i)).toBeVisible();
    await expect(page.getByLabel(/handle/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /register as artist/i })).toBeVisible();
  });
});
