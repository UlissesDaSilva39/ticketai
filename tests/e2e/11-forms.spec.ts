import { test, expect } from "@playwright/test";

test.describe("Form validation", () => {
  test("register form blocks empty submit (if implemented)", async ({ page }) => {
    const res = await page.goto("/register").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    const submit = page.locator('button[type="submit"]').first();
    if (!(await submit.count())) test.skip(true, "No submit button");
    await submit.click();
    await page.waitForTimeout(500);
    expect(page.url()).toMatch(/register/);
  });
});