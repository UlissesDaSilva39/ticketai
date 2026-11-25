import { test, expect } from "@playwright/test";
import { ROUTES } from "./helpers/routes";
import { captureConsole } from "./helpers/console";
import { tryLogin } from "./helpers/auth";

test.describe("Route smoke tests", () => {
  for (const route of ROUTES) {
    test(`route: ${route.name} (${route.path})`, async ({ page }) => {
      if (route.requiresAuth) {
        const ok = await tryLogin(page);
        if (!ok) test.skip(true, "Login not available — skipping protected route");
      }

      const console = captureConsole(page);
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });

      if (!response || response.status() === 404) {
        test.skip(true, `Route ${route.path} not implemented (404)`);
      }

      expect(response!.status(), `Status for ${route.path}`).toBeLessThan(500);

      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(500);

      if (route.expectText) {
        const body = (await page.textContent("body")) ?? "";
        expect(
          body.toLowerCase().includes(route.expectText.toLowerCase()),
          `Expected text "${route.expectText}" on ${route.path}`
        ).toBe(true);
      }

      expect(
        console.pageErrors,
        `Uncaught errors on ${route.path}: ${console.pageErrors.join(" | ")}`
      ).toHaveLength(0);
    });
  }
});