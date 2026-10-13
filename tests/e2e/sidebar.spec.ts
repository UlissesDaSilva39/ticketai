import { test, expect } from "./fixtures/base";

// Routes that should share the same sidebar
const SIDEBAR_ROUTES = ["/artists", "/opportunities", "/following", "/friends"];

test.describe("sidebar consistency", () => {
  for (const route of SIDEBAR_ROUTES) {
    test(`${route} has exactly one YOUR LIBRARY sidebar`, async ({ page }) => {
      await page.goto(route);
      if (page.url().includes("/login")) { test.skip(true, "Auth required"); }
      const labels = page.getByText(/your library/i);
      await expect(labels).toHaveCount(1);
    });
  }
});
