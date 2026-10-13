import { test, expect } from "./fixtures/base";

/* ============================================================
 *  Follow System — Artist + Venue
 * ============================================================ */

const TEST_ARTIST_SLUG = "basement-collective";
const TEST_ARTIST_URL = "/artist/" + TEST_ARTIST_SLUG;
const TEST_VENUE_SLUG = "test-first-veneu";
const TEST_VENUE_URL = "/venue/" + TEST_VENUE_SLUG;

// ============================================================
//  Artist follow
// ============================================================
test.describe("Follow System — Artist profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_ARTIST_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("F1. artist profile loads", async ({ page }) => {
    expect(page.url()).toContain("/artist/");
  });

  test("F2. artist heading is visible", async ({ page }) => {
    const h = page.getByRole("heading", { level: 1 }).first();
    await expect(h).toBeVisible({ timeout: 15000 });
    expect((await h.innerText()).toLowerCase()).toContain("basement");
  });

  test("F3. Follow button exists + enabled", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    await expect(b).toBeEnabled();
  });

  test("F4. Follow button shows count", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    const text = await b.innerText();
    expect(/\d+/.test(text)).toBe(true);
  });

  test("F5. clicking Follow toggles state", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    const before = (await b.innerText()).toLowerCase();
    const wasFollowing = before.includes("following");
    const apiCall = page.waitForResponse(
      (r) => r.url().includes("/api/artists/") && r.url().includes("/follow") && r.request().method() === "POST",
      { timeout: 10000 }
    ).catch(() => null);
    await b.click();
    const resp = await apiCall;
    await page.waitForTimeout(600);
    const after = (await b.innerText()).toLowerCase();
    expect(after.includes("following")).toBe(!wasFollowing);
    if (resp) expect(resp.status()).toBeLessThan(500);
    await b.click();
    await page.waitForTimeout(500);
  });

  test("F7. unauth API returns 401/307", async ({ request }) => {
    const res = await request.post("/api/artists/" + TEST_ARTIST_SLUG + "/follow", {
      data: { following: true },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 403, 307]).toContain(res.status());
  });
});

// ============================================================
//  Venue follow
// ============================================================
test.describe("Follow System — Venue", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_VENUE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("V1. venue profile loads", async ({ page }) => {
    expect(page.url()).toContain("/venue/");
  });

  test("V2. venue Follow button exists", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    await expect(b).toBeEnabled();
  });

  test("V3. venue Follow button shows count", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    const text = await b.innerText();
    expect(/\d+/.test(text)).toBe(true);
  });

  test("V4. clicking venue Follow toggles state", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    const before = (await b.innerText()).toLowerCase();
    const wasFollowing = before.includes("following");
    const apiCall = page.waitForResponse(
      (r) => r.url().includes("/api/follows/") && r.request().method() === "POST",
      { timeout: 10000 }
    ).catch(() => null);
    await b.click();
    const resp = await apiCall;
    await page.waitForTimeout(600);
    const after = (await b.innerText()).toLowerCase();
    expect(after.includes("following")).toBe(!wasFollowing);
    if (resp) expect(resp.status()).toBeLessThan(500);
    await b.click();
    await page.waitForTimeout(500);
  });

  test("V5. unauth venue API returns 401", async ({ request }) => {
    const res = await request.post("/api/follows/toggle", {
      data: { targetType: "venue", targetId: TEST_VENUE_SLUG },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 403, 307]).toContain(res.status());
  });
});
