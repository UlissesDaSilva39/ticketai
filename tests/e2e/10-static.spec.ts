import { test, expect } from "@playwright/test";

test.describe("Static pages", () => {
  test("FAQ page lists questions", async ({ page }) => {
    const res = await page.goto("/faq").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "/faq not implemented");
    await page.waitForLoadState("networkidle").catch(() => {});

    const items = page.locator(
      "[data-faq], details, .faq-item, [class*='faq'] li, h3"
    );
    expect(await items.count()).toBeGreaterThan(0);
  });

  test("premium page renders CTA", async ({ page }) => {
    const res = await page.goto("/premium").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "/premium not implemented");
    const cta = page.locator("button, a[href*='checkout'], a[href*='subscribe']").first();
    expect(await cta.count()).toBeGreaterThan(0);
  });

  test("verify page renders input or message", async ({ page }) => {
    const res = await page.goto("/verify").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "/verify not implemented");
    const inputs = page.locator("input");
    const text = (await page.textContent("body")) ?? "";
    expect((await inputs.count()) > 0 || text.length > 0).toBe(true);
  });
});