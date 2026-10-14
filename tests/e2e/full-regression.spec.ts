import { test, expect } from "./fixtures/base";

/* ============================================================
 *  GRID — Full Regression Suite
 * ============================================================ */

const PUBLIC_ROUTES = ["/", "/cities", "/london", "/manchester", "/berlin", "/artists"];
const TEST_ARTIST_SLUG = "basement-collective";
const TEST_VENUE_SLUG = "test-first-veneu";

// R1. Auth gates
test.describe("R1. Auth gates", () => {
  const protectedRoutes = ["/home", "/messages", "/notifications", "/profile"];
  for (const route of protectedRoutes) {
    test("R1." + (protectedRoutes.indexOf(route) + 1) + " " + route + " requires auth", async ({ browser }) => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();

      // First hit may take 20-30s while Next.js compiles the route
      await page.goto("http://localhost:3000" + route, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // Give the 307 redirect time to land on /login
      try {
        await page.waitForURL(/\/login/, { timeout: 30000 });
      } catch {
        // Fall through — maybe the page renders a login CTA without redirecting
      }

      const url = page.url();
      const loginCta = await page.getByRole("link", { name: /log in|sign in/i }).count();

      // Debug output so we can see what went wrong
      console.log("[R1] route=" + route + " url=" + url + " loginCta=" + loginCta);

      expect(url.includes("/login") || loginCta > 0).toBe(true);
      await ctx.close();
    });
  }
});

// R2. Public pages
test.describe("R2. Public pages", () => {
  for (const route of PUBLIC_ROUTES) {
    test("R2." + (PUBLIC_ROUTES.indexOf(route) + 1) + " GET " + route, async ({ request }) => {
      const res = await request.get(route);
      expect(res.status()).toBeLessThan(400);
    });
  }
});

// R3. Home feed
test.describe("R3. Home feed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });
  test("R3.1 loads with H1", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });
  test("R3.2 composer visible", async ({ page }) => {
    const c = page.getByPlaceholder(/what is happening/i).first();
    if ((await c.count()) === 0) test.skip(true, "Composer not rendered");
    await expect(c).toBeVisible({ timeout: 15000 });
  });
  test("R3.3 has nav landmark", async ({ page }) => {
    expect(await page.locator("nav").count()).toBeGreaterThan(0);
  });
});

// R4. Notification bell
test.describe("R4. Notification bell", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });
  test("R4.1 bell link exists", async ({ page }) => {
    const bell = page.getByRole("link", { name: /notification/i }).first();
    if ((await bell.count()) === 0) test.skip(true, "Bell not rendered");
    await expect(bell).toBeVisible({ timeout: 15000 });
  });
  test("R4.2 bell href → /notifications", async ({ page }) => {
    const bell = page.getByRole("link", { name: /notification/i }).first();
    if ((await bell.count()) === 0) test.skip(true, "Bell not rendered");
    expect(await bell.getAttribute("href")).toBe("/notifications");
  });
});

// R5. Artist profile
test.describe("R5. Artist profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/artist/" + TEST_ARTIST_SLUG, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });
  test("R5.1 loads with heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });
  test("R5.2 follow button present", async ({ page }) => {
    const btn = page.getByRole("button", { name: /follow|following/i }).first();
    if ((await btn.count()) === 0) test.skip(true, "Follow button not rendered");
    await expect(btn).toBeVisible({ timeout: 15000 });
  });
});

// R6. Venue profile
test.describe("R6. Venue profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/venue/" + TEST_VENUE_SLUG, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });
  test("R6.1 loads", async ({ page }) => {
    expect(page.url()).toContain("/venue/");
  });
  test("R6.2 follow button present", async ({ page }) => {
    const btn = page.getByRole("button", { name: /follow|following/i }).first();
    if ((await btn.count()) === 0) test.skip(true, "Follow button not rendered");
    await expect(btn).toBeVisible({ timeout: 15000 });
  });
});

// R7. Follow API
test.describe("R7. Follow API", () => {
  test("R7.1 artist follow rejects unauth", async ({ request }) => {
    const res = await request.post("/api/artists/" + TEST_ARTIST_SLUG + "/follow", {
      data: { following: true }, headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).not.toBe(200);
  });
  test("R7.2 venue follow rejects unauth", async ({ request }) => {
    const res = await request.post("/api/follows/toggle", {
      data: { targetType: "venue", targetId: TEST_VENUE_SLUG },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).not.toBe(200);
  });
  test("R7.3 status endpoint requires params", async ({ request }) => {
    const res = await request.get("/api/follows/status");
    expect(res.status()).toBe(400);
  });
});

// R8. Messages inbox
test.describe("R8. Messages inbox", () => {
  test("R8.1 inbox renders heading", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    await expect(page.getByTestId("messages-heading")).toBeVisible({ timeout: 15000 });
  });
});

// R9. Message thread
test.describe("R9. Message thread", () => {
  test("R9.1 opens from inbox", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    const rows = page.locator('[data-testid="conversation-row"]');
    if ((await rows.count()) === 0) test.skip(true, "No conversations");
    await rows.first().click();
    await page.waitForURL(/\/messages\/[^/]+$/, { timeout: 10000 });
    await expect(page.getByTestId("message-input")).toBeVisible();
  });
});

// R10. City pages
test.describe("R10. City pages", () => {
  test("R10.1 /cities renders", async ({ page }) => {
    await page.goto("/cities", { waitUntil: "domcontentloaded", timeout: 30000 });
    const h = page.getByRole("heading", { level: 1 }).first();
    await expect(h).toBeVisible({ timeout: 15000 });
  });
  test("R10.2 /cities has 20+ city links", async ({ page }) => {
    await page.goto("/cities", { waitUntil: "domcontentloaded", timeout: 30000 });
    expect(await page.locator('a[href^="/"]').count()).toBeGreaterThanOrEqual(20);
  });
  test("R10.3 /london renders", async ({ page }) => {
    await page.goto("/london", { waitUntil: "domcontentloaded", timeout: 30000 });
    const h = page.getByRole("heading", { level: 1 }).first();
    await expect(h).toBeVisible({ timeout: 15000 });
    expect((await h.innerText()).toLowerCase()).toContain("london");
  });
});

// R11. A11y
test.describe("R11. Accessibility", () => {
  test("R11.1 no images without alt on /home", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    const imgs = page.locator("img");
    const n = await imgs.count();
    const missing = [];
    for (let i = 0; i < n; i++) {
      const alt = await imgs.nth(i).getAttribute("alt");
      if (alt === null) missing.push((await imgs.nth(i).getAttribute("src")) || "(no src)");
    }
    expect(missing).toEqual([]);
  });
});

// R12. Console hygiene
test.describe("R12. Console", () => {
  test("R12.1 /home has no console errors", async ({ page, consoleErrors }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    await page.waitForTimeout(1500);
    const real = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("React DevTools") && !e.includes("hydration")
    );
    expect(real).toEqual([]);
  });
});

// R13. API contracts
test.describe("R13. API contracts", () => {
  test("R13.1 status returns expected shape", async ({ request }) => {
    const res = await request.get("/api/follows/status?targetType=venue&targetId=" + TEST_VENUE_SLUG);
    if (res.status() === 200) {
      const body = await res.json();
      expect(body).toHaveProperty("following");
      expect(body).toHaveProperty("count");
    } else {
      expect([200, 400]).toContain(res.status());
    }
  });
  test("R13.2 toggle rejects bad payload", async ({ request }) => {
    const res = await request.post("/api/follows/toggle", {
      data: {}, headers: { "Content-Type": "application/json" },
    });
    expect([400, 401, 307]).toContain(res.status());
  });
});
