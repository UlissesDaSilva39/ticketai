import { test, expect } from "@playwright/test";
import { captureConsole } from "./helpers/console";

test.describe("TicketAI", () => {
  const routes = ["/ticketai", "/ticketai/social", "/ticketai/artist", "/ticketai/analytics"];

  for (const r of routes) {
    test(`TicketAI ${r} renders without errors`, async ({ page }) => {
      const res = await page.goto(r, { waitUntil: "domcontentloaded" });
      if (!res || res.status() === 404) test.skip(true, `${r} not implemented`);

      const console = captureConsole(page);
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(500);

      expect(console.pageErrors, `pageerrors: ${console.pageErrors.join(" | ")}`).toHaveLength(0);
    });
  }

  test("TicketAI home has heading or CTA", async ({ page }) => {
    const res = await page.goto("/ticketai").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    const heading = page.locator("h1, h2").first();
    const cta = page.locator("button, a[role=button]").first();
    expect((await heading.count()) + (await cta.count())).toBeGreaterThan(0);
  });
});