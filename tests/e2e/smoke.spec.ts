import { test, expect } from "./fixtures/base";

// Every static route we know about. Dynamic routes ([id]) are skipped here
// — they're covered in dedicated spec files below.
const STATIC_ROUTES = [
  "/",
  "/home",
  "/feed",
  "/login",
  "/signup",
  "/artists",
  "/artist",
  "/venues",
  "/promoters",
  "/organizer",
  "/search",
  "/opportunities",
  "/contact",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/for-promoters",
  "/for-venues",
  "/venues/join",
  "/promoters/join",
  "/artist/register",
  "/discover/artists",
  "/discover/events",
  "/discover/promoters",
  "/discover/venues",
  "/settings",
  "/profile",
  "/my-tickets",
  "/following",
  "/friends",
  "/friends/requests",
  "/network",
  "/people",
  "/notifications",
  "/connections",
  "/checkout",
  "/confirmation",
  "/refunds",
  // City pages
  "/london",
  "/manchester",
  "/birmingham",
  "/bristol",
  "/brighton",
  "/leeds",
  "/glasgow",
  "/paris",
  "/berlin",
  "/amsterdam",
  "/barcelona",
  "/dublin",
  "/new-york",
  "/los-angeles",
  "/chicago",
  "/miami",
  "/san-francisco",
  "/toronto",
  "/montreal",
  "/calgary",
  "/vancouver",
  "/sydney",
  "/melbourne",
  "/brisbane",
  "/perth",
  // Genre pages
  "/techno",
  "/house-music",
  "/live-music",
  "/comedy",
];

test.describe("smoke: every static route renders", () => {
  for (const route of STATIC_ROUTES) {
    test(`GET ${route} ? 2xx and no 500`, async ({ page, consoleErrors }) => {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res, `${route} did not return a response`).not.toBeNull();
      expect(
        res!.status(),
        `${route} returned ${res!.status()}`
      ).toBeLessThan(400);

      // Page should have some body
      const body = await page.locator("body").innerText();
      expect(body.length, `${route} rendered empty body`).toBeGreaterThan(0);

      // No uncaught JS errors
      const realErrors = consoleErrors.filter(
        (e) =>
          !e.includes("favicon") &&
          !e.includes("Download the React DevTools")
      );
      expect(
        realErrors,
        `${route} had console errors:\n${realErrors.join("\n")}`
      ).toEqual([]);
    });
  }
});
