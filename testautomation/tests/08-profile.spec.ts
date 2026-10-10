import { test, expect } from "@playwright/test";
import { login, CREDS } from "../helpers/auth";

test.describe("08 - Profile", () => {
  test.beforeEach(async ({ page }) => login(page, ...CREDS.alice));
  test("8.1 avatar menu shows identity", async ({ page }) => {
    const avatar = page.locator("[data-testid=\"avatar\"]").or(page.getByRole("button", { name: /profile|account|avatar/i })).first();
    await avatar.click();
    await expect(page.getByText(/ulissesdasilva39@gmail.com/i).first()).toBeVisible();
  });
  test("8.2 profile edit renders", async ({ page }) => {
    await page.goto("/profile/edit");
    await expect(page).not.toHaveURL(/\/login/);
  });
});
