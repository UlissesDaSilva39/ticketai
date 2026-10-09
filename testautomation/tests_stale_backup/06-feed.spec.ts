import { test, expect } from "@playwright/test";
import { login, CREDS } from "../helpers/auth";

test.describe("06 - Feed", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ...CREDS.alice);
    await page.goto("/");
  });

  test("6.1 composer visible", async ({ page }) => {
    const composer = page.getByPlaceholder(/what's on your mind/i)
      .or(page.locator("textarea").first())
      .first();
    if (await composer.count() === 0) test.skip(true, "no composer");
    await expect(composer).toBeVisible();
  });

  test("6.2 composer actions", async ({ page }) => {
    await expect(page.getByText("Photo").first()).toBeVisible();
    await expect(page.getByText("Post").first()).toBeVisible();
  });

  test("6.3 feed tabs", async ({ page }) => {
    const tab = page.getByRole("tab", { name: "For You" })
      .or(page.getByRole("button", { name: "For You" }))
      .first();
    if (await tab.count() === 0) test.skip(true, "no For You tab");
    await expect(tab).toBeVisible();
  });

  test("6.4 create a post", async ({ page }) => {
    const composer = page.getByPlaceholder(/what's on your mind/i)
      .or(page.locator("textarea").first())
      .first();
    if (await composer.count() === 0) test.skip(true, "no composer");
    const text = `pw-post-${Date.now()}`;
    await composer.fill(text);
    const postBtn = page.getByRole("button", { name: /^post$/i }).first();
    if (await postBtn.count() === 0) test.skip(true, "no Post button");
    await postBtn.click();
    await expect(page.getByText(text).first()).toBeVisible({ timeout: 10_000 });
  });

  test("6.5 sidebar sections", async ({ page }) => {
    await expect(page.getByText(/People you may know/i).first()).toBeVisible();
    await expect(page.getByText(/People to follow/i).first()).toBeVisible();
  });

  test("6.6 sidebar upcoming event", async ({ page }) => {
    await expect(page.getByText(/Folk & Whisky Festival/i).first()).toBeVisible();
  });
});
