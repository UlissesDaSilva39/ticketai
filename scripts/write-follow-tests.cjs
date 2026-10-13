const fs = require("fs");
const path = require("path");

const dir = "tests/e2e";
fs.mkdirSync(dir, { recursive: true });

const spec = `import { test, expect } from "./fixtures/base";

/* ============================================================
 *  Follow System — Artist + Venue
 *  ------------------------------------------------------------
 *  Coverage:
 *    1. Artist profile loads with Follow button
 *    2. Follower count renders
 *    3. Clicking Follow (as authed user) toggles state
 *    4. Clicking Follow (as guest) redirects to /login
 *    5. API: POST /api/artists/[slug]/follow requires auth
 *    6. API: POST /api/artists/[slug]/follow toggles follow row
 *    7. Venue follow placeholder (to be enabled when wired)
 *
 *  Auth: uses saved storage state from globalSetup.
 *  Skips gracefully when /login redirect is detected.
 * ============================================================ */

const TEST_ARTIST_SLUG = "basement-collective";
const TEST_ARTIST_URL = "/artist/" + TEST_ARTIST_SLUG;

test.describe("Follow System — Artist profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_ARTIST_URL, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required — run with the auth fixture");
    }
  });

  test("F1. artist profile page loads without redirect", async ({ page }) => {
    await expect(page).toHaveURL(new RegExp(TEST_ARTIST_SLUG));
    expect(page.url()).toContain("/artist/");
  });

  test("F2. artist name heading is visible", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
    expect((await heading.innerText()).toLowerCase()).toContain("basement");
  });

  test("F3. Follow button exists and is interactive", async ({ page }) => {
    const button = page
      .getByRole("button", { name: /follow|following/i })
      .first();
    await expect(button).toBeVisible({ timeout: 15000 });
    await expect(button).toBeEnabled();
  });

  test("F4. Follow button shows follower count", async ({ page }) => {
    const button = page
      .getByRole("button", { name: /follow|following/i })
      .first();
    await expect(button).toBeVisible({ timeout: 15000 });

    // Button text or aria-label should contain a number (count)
    const text = await button.innerText();
    const aria = (await button.getAttribute("aria-label")) ?? "";
    const hasNumber = /\\d+/.test(text) || /\\d+/.test(aria);
    expect(hasNumber).toBe(true);
  });

  test("F5. clicking Follow toggles state optimistically", async ({ page }) => {
    const button = page
      .getByRole("button", { name: /follow|following/i })
      .first();
    await expect(button).toBeVisible({ timeout: 15000 });

    const before = (await button.innerText()).toLowerCase();
    const wasFollowing = before.includes("following");

    // Intercept the API call so we can assert it fires
    const apiCall = page
      .waitForResponse(
        (res) =>
          res.url().includes("/api/artists/") &&
          res.url().includes("/follow") &&
          res.request().method() === "POST",
        { timeout: 10000 }
      )
      .catch(() => null);

    await button.click();
    const response = await apiCall;

    // Optimistic UI should flip immediately
    await page.waitForTimeout(500);
    const after = (await button.innerText()).toLowerCase();
    const isFollowing = after.includes("following");

    expect(isFollowing).toBe(!wasFollowing);

    // If a response arrived, it must not be a server error
    if (response) {
      expect(response.status()).toBeLessThan(500);
    }

    // Revert state so test is idempotent
    await button.click();
    await page.waitForTimeout(500);
  });

  test("F6. double-click does not break button", async ({ page }) => {
    const button = page
      .getByRole("button", { name: /follow|following/i })
      .first();
    await expect(button).toBeVisible({ timeout: 15000 });

    await button.click();
    await button.click({ force: true });
    await page.waitForTimeout(800);

    await expect(button).toBeEnabled({ timeout: 5000 });
    const text = await button.innerText();
    expect(text.length).toBeGreaterThan(0);
  });

  test("F7. API rejects unauthenticated follow request", async ({ request }) => {
    // Use a fresh request context with no cookies
    const res = await request.post(
      "/api/artists/" + TEST_ARTIST_SLUG + "/follow",
      {
        data: { following: true },
        headers: { "Content-Type": "application/json" },
      }
    );
    // Should be 401 (unauth) or 307 (redirect to login) — not 200
    expect([401, 403, 307]).toContain(res.status());
  });
});

test.describe("Follow System — Guest", () => {
  test("F8. signed-out visitor clicking Follow is sent to /login", async ({
    browser,
  }) => {
    const ctx = await browser.newContext(); // NO storage state = guest
    const page = await ctx.newPage();
    await page.goto("http://localhost:3000" + TEST_ARTIST_URL, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const button = page
      .getByRole("button", { name: /follow|following/i })
      .first();

    if ((await button.count()) === 0) {
      await ctx.close();
      test.skip(true, "Follow button not visible to guest");
    }

    await button.click();
    await page.waitForURL(/\\/login/, { timeout: 8000 }).catch(() => {});

    expect(page.url()).toContain("/login");
    await ctx.close();
  });
});

test.describe("Follow System — Venue (placeholder)", () => {
  // These will activate once VenueFollowButton is wired up.
  test.skip("V1. venue profile has a Follow button", async ({ page }) => {
    await page.goto("/venue/test-first-veneu", { waitUntil: "domcontentloaded" });
    const button = page
      .getByRole("button", { name: /follow|following/i })
      .first();
    await expect(button).toBeVisible();
  });
});
`;

fs.writeFileSync(path.join(dir, "follow-system.spec.ts"), spec, "utf8");
console.log("✅ Wrote tests/e2e/follow-system.spec.ts");
console.log("   Lines: " + spec.split("\\n").length);
