import { test, expect } from "@playwright/test";

test.describe("11 - SEO", () => {
  test("11.1 sitemap.xml", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    expect(await res.text()).toContain("<urlset");
  });
  test("11.2 robots.txt", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
  });
  for (const p of ["/events/london", "/events/house", "/events/london/house", "/london"]) {
    test(`11.x ${p} responds`, async ({ page }) => {
      const res = await page.goto(p);
      expect(res?.status() ?? 200).toBeLessThan(500);
    });
  }
});
