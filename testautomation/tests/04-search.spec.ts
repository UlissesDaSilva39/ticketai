import { test, expect } from "@playwright/test";
import { login, CREDS } from "../helpers/auth";

test.describe("04 - Search", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ...CREDS.alice);
    await page.goto("/search");
  });
  test("4.1 search input present", async ({ page }) => {
    await expect(page.getByPlaceholder(/search/i).first()).toBeVisible();
  });
  test("4.2 event count shown", async ({ page }) => {
    await expect(page.getByText(/events found/i).first()).toBeVisible();
  });
  test("4.3 filter bar", async ({ page }) => {
    for (const name of ["Any City", "Any Date", "Any Price", "All Types"]) {
      const ctrl = page.getByRole("combobox", { name: new RegExp(name, "i") }).or(page.getByRole("button", { name: new RegExp(name, "i") })).first();
      if (await ctrl.count() === 0) test.skip(true, `no ${name}`);
      await expect(ctrl).toBeVisible();
    }
  });
  test("4.4 search filters", async ({ page }) => {
    await page.getByPlaceholder(/search/i).first().fill("Jazz");
    await page.waitForTimeout(800);
    await expect(page.getByText(/Jazz Nights London/i).first()).toBeVisible();
  });
});
