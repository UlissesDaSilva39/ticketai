const fs = require("fs");

const spec = `import { test, expect } from "./fixtures/base";

/* ============================================================
 *  City Landing Pages — /london, /manchester, /cities
 *  ------------------------------------------------------------
 *  Y1.  /cities index renders with heading
 *  Y2.  /cities shows city tiles
 *  Y3.  /london loads (HTTP 200, no redirect)
 *  Y4.  /london has city heading "London"
 *  Y5.  /london events section renders (empty-state OR cards)
 *  Y6.  /manchester loads
 *  Y7.  /berlin loads (city with different country)
 *  Y8.  /city/london (canonical form) works
 *  Y9.  /not-a-real-city returns 404
 *  Y10. City page has correct metadata title
 * ============================================================ */

test.describe("City landing pages", () => {
  test("Y1. /cities index renders", async ({ page }) => {
    await page.goto("/cities", { waitUntil: "domcontentloaded", timeout: 30000 });
    await expect(page.getByTestId("cities-heading")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("cities-heading")).toHaveText(/cities/i);
  });

  test("Y2. /cities shows at least 20 city tiles", async ({ page }) => {
    await page.goto("/cities", { waitUntil: "domcontentloaded", timeout: 30000 });
    const tiles = page.getByTestId("city-tile");
    const count = await tiles.count();
    expect(count).toBeGreaterThanOrEqual(20);
  });

  test("Y3. /london loads without redirect", async ({ page }) => {
    const res = await page.goto("/london", { waitUntil: "domcontentloaded", timeout: 30000 });
    // Not redirecting to /login
    expect(page.url()).not.toContain("/login");
    expect(res?.status() ?? 0).toBeLessThan(400);
  });

  test("Y4. /london heading says London", async ({ page }) => {
    await page.goto("/london", { waitUntil: "domcontentloaded", timeout: 30000 });
    const heading = page.getByTestId("city-heading");
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toHaveText(/london/i);
  });

  test("Y5. /london events section renders", async ({ page }) => {
    await page.goto("/london", { waitUntil: "domcontentloaded", timeout: 30000 });
    const events = page.getByTestId("city-events");
    await expect(events).toBeVisible({ timeout: 15000 });
    // Either event cards, or the "no events" message
    const cards = events.getByTestId("city-event-card");
    const emptyMsg = events.getByText(/no upcoming events/i);
    const total = (await cards.count()) + (await emptyMsg.count());
    expect(total).toBeGreaterThan(0);
  });

  test("Y6. /manchester loads", async ({ page }) => {
    await page.goto("/manchester", { waitUntil: "domcontentloaded", timeout: 30000 });
    const heading = page.getByTestId("city-heading");
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toHaveText(/manchester/i);
  });

  test("Y7. /berlin loads (different country)", async ({ page }) => {
    await page.goto("/berlin", { waitUntil: "domcontentloaded", timeout: 30000 });
    const heading = page.getByTestId("city-heading");
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toHaveText(/berlin/i);
  });

  test("Y8. /city/london canonical form works", async ({ page }) => {
    await page.goto("/city/london", { waitUntil: "domcontentloaded", timeout: 30000 });
    const heading = page.getByTestId("city-heading");
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toHaveText(/london/i);
  });

  test("Y9. /not-a-real-city returns 404", async ({ page }) => {
    const res = await page.goto("/not-a-real-city", { waitUntil: "domcontentloaded", timeout: 30000 });
    // Next.js notFound() → 404
    expect(res?.status() ?? 0).toBe(404);
  });

  test("Y10. /london has expected title", async ({ page }) => {
    await page.goto("/london", { waitUntil: "domcontentloaded", timeout: 30000 });
    await expect(page).toHaveTitle(/london/i);
  });
});
`;

fs.mkdirSync("tests/e2e", { recursive: true });
fs.writeFileSync("tests/e2e/cities.spec.ts", spec, "utf8");
console.log("  ✅ tests/e2e/cities.spec.ts (" + spec.split("\n").length + " lines)");
