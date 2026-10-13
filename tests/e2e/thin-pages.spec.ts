import { test, expect } from "@playwright/test";

test.describe("rebuilt thin pages", () => {
  test("/feed redirects to /home", async ({ page }) => {
    await page.goto("/feed", { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\\/home|\\/login/);
    expect(page.url()).toMatch(/\\/home|\\/login/);
  });

  test("/signup renders form fields", async ({ page }) => {
    const res = await page.goto("/signup", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#full_name")).toBeVisible();
    await expect(page.locator("#username")).toBeVisible();
    await expect(page.locator("#city")).toBeVisible();
  });

  test("/signup has role selector with aria-pressed", async ({ page }) => {
    await page.goto("/signup", { waitUntil: "domcontentloaded" });
    const artistBtn = page.getByRole("button", { name: /^artist$/i });
    await expect(artistBtn).toBeVisible();
    await expect(artistBtn).toHaveAttribute("aria-pressed", "false");
    await artistBtn.click();
    await expect(artistBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("/signup submit button exists and is enabled", async ({ page }) => {
    await page.goto("/signup", { waitUntil: "domcontentloaded" });
    const submit = page.getByRole("button", { name: /create account/i });
    await expect(submit).toBeEnabled();
  });

  test("/refund-policy renders heading and content", async ({ page }) => {
    const res = await page.goto("/refund-policy", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: /refund policy/i })).toBeVisible();
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/refund window|cancelled|48 hours/i);
  });

  test("/artist renders a grid or empty state", async ({ page }) => {
    const res = await page.goto("/artist", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: /^artists$/i })).toBeVisible();
  });
});

test.describe("/settings (auth-gated)", () => {
  test("/settings redirects to login or renders hub", async ({ page }) => {
    const res = await page.goto("/settings", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) {
      expect(page.url()).toContain("/login");
      return;
    }
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: /settings/i })).toBeVisible();
  });

  test("/settings shows section cards when logged in", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    await expect(page.getByText(/notifications/i).first()).toBeVisible();
    await expect(page.getByText(/profile/i).first()).toBeVisible();
  });
});

test.describe("/connections (auth-gated)", () => {
  test("/connections redirects to login or renders", async ({ page }) => {
    const res = await page.goto("/connections", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) {
      expect(page.url()).toContain("/login");
      return;
    }
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: /connections/i })).toBeVisible();
  });
});
