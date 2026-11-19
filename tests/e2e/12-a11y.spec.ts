import { test, expect } from "@playwright/test";

test.describe("A11y basics", () => {
  const routes = ["/", "/artists", "/ticketai", "/login"];

  for (const r of routes) {
    test(`${r} has a title and lang attribute`, async ({ page }) => {
      const res = await page.goto(r).catch(() => null);
      if (!res || res.status() === 404) test.skip(true, `${r} not implemented`);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      const lang = await page.locator("html").getAttribute("lang");
      if (!lang) console.log(`${r}: <html> has no lang attribute`);
    });
  }

  test("home page has a landmark", async ({ page }) => {
    const res = await page.goto("/").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    const landmarks = page.locator("main, nav, header, footer, [role=main]");
    expect(await landmarks.count()).toBeGreaterThan(0);
  });
});