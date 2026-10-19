import { test, expect, Page } from "@playwright/test";

/* ============================================================
 *  GRID — Full Regression Suite
 *  ------------------------------------------------------------
 *  Covers every stable surface in one file. Tests that need
 *  seeded data (specific artist slugs, event IDs) skip
 *  gracefully if the data isn't present — they never fail
 *  on missing fixtures.
 * ============================================================ */

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

// ---------------- Known-good fixtures from your DB ----------------
const KNOWN_ARTIST = "samokafor";           // has merch seeded
const KNOWN_VENUE  = "test-first-veneu";
const KNOWN_EVENT  = "3eb54bca-8851-46ba-86b5-480fc7ef9ed1";
const KNOWN_PROMOTER_ID = "";               // fill in if you have one

// ============================================================
// 1. PUBLIC ROUTES — must return < 400
// ============================================================
test.describe("1. Public routes", () => {
  const routes = [
    "/",
    "/cities",
    "/london",
    "/manchester",
    "/berlin",
    "/artists",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/people",
    "/venues",
    "/promoters",
  ];

  for (const route of routes) {
    test(`GET ${route} returns < 400`, async ({ request }) => {
      const res = await request.get(route);
      expect(res.status(), `${route} returned ${res.status()}`).toBeLessThan(400);
    });
  }
});

// ============================================================
// 2. AUTH GATES — protected routes redirect or prompt login
// ============================================================
test.describe("2. Auth gates", () => {
  const protectedRoutes = ["/home", "/messages", "/notifications", "/profile", "/my-tickets", "/feed"];

  for (const route of protectedRoutes) {
    test(`${route} requires auth`, async ({ browser }) => {
      const ctx = await browser.newContext();  // NO storage state
      const page = await ctx.newPage();
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(800);

      const url = page.url();
      const loginCta = await page.getByRole("link", { name: /log in|sign in/i }).count();
      const isProtected = url.includes("/login") || loginCta > 0 || url.includes("/home");
      expect(isProtected, `${route} did not gate auth (url=${url})`).toBe(true);
      await ctx.close();
    });
  }
});

// ============================================================
// 3. HOME FEED — composer, tabs, posts
// ============================================================
test.describe("3. Home feed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("3.1 renders H1", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });

  test("3.2 composer textarea visible", async ({ page }) => {
    const ta = page.getByPlaceholder(/what is happening/i).first();
    if ((await ta.count()) === 0) test.skip(true, "No composer");
    await expect(ta).toBeVisible();
  });

  test("3.3 has main/nav landmarks", async ({ page }) => {
    expect(await page.locator("main").count()).toBeGreaterThan(0);
    expect(await page.locator("nav").count()).toBeGreaterThan(0);
  });

  test("3.4 YOUR LIBRARY sidebar present", async ({ page }) => {
    await expect(page.getByText(/your library/i).first()).toBeVisible();
  });

  test("3.5 at least one post", async ({ page }) => {
    const n = await page.locator('[data-testid="post-card"], article').count();
    expect(n).toBeGreaterThan(0);
  });

  test("3.6 Trending widget renders", async ({ page }) => {
    await expect(page.getByText(/trending/i).first()).toBeVisible();
  });

  test("3.7 People to follow widget renders", async ({ page }) => {
    await expect(page.getByText(/people to follow/i).first()).toBeVisible();
  });
});

// ============================================================
// 4. ARTIST PROFILE
// ============================================================
test.describe("4. Artist profile", () => {
  test("4.1 /artists/<username> loads", async ({ page }) => {
    const res = await page.goto(`${BASE}/artists/${KNOWN_ARTIST}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    expect(res?.status()).toBeLessThan(400);
  });

  test("4.2 artist profile has an H1", async ({ page }) => {
    await page.goto(`${BASE}/artists/${KNOWN_ARTIST}`);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });

  test("4.3 Follow button present", async ({ page }) => {
    await page.goto(`${BASE}/artists/${KNOWN_ARTIST}`);
    const btn = page.getByRole("button", { name: /follow|following/i }).first();
    if ((await btn.count()) === 0) test.skip(true, "No follow button");
    await expect(btn).toBeVisible();
  });

  test("4.4 merch section renders if seeded", async ({ page }) => {
    await page.goto(`${BASE}/artists/${KNOWN_ARTIST}`);
    await page.waitForLoadState("networkidle");
    const hasMerch = await page.getByRole("heading", { name: /^merch$/i }).count();
    if (hasMerch === 0) test.skip(true, "No merch seeded for this artist");
    await expect(page.getByRole("heading", { name: /^merch$/i })).toBeVisible();
  });

  test("4.5 merch 'View all' links to /artists/<username>/merch", async ({ page }) => {
    await page.goto(`${BASE}/artists/${KNOWN_ARTIST}`);
    await page.waitForLoadState("networkidle");
    const link = page.getByRole("link", { name: /view all/i }).first();
    if ((await link.count()) === 0) test.skip(true, "No merch 'View all'");
    const href = await link.getAttribute("href");
    expect(href).toBe(`/artists/${KNOWN_ARTIST}/merch`);
  });
});

// ============================================================
// 5. ARTIST MERCH LISTING
// ============================================================
test.describe("5. Artist merch listing", () => {
  test("5.1 loads", async ({ page }) => {
    const res = await page.goto(`${BASE}/artists/${KNOWN_ARTIST}/merch`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    expect(res?.status()).toBeLessThan(400);
  });

  test("5.2 has artist name heading", async ({ page }) => {
    await page.goto(`${BASE}/artists/${KNOWN_ARTIST}/merch`);
    await page.waitForLoadState("networkidle");
    const heading = page.getByRole("heading", { level: 1 }).first();
    await expect(heading).toBeVisible();
  });
});

// ============================================================
// 6. MERCH DETAIL
// ============================================================
test.describe("6. Merch detail", () => {
  test("6.1 reachable from artist page", async ({ page }) => {
    await page.goto(`${BASE}/artists/${KNOWN_ARTIST}`);
    await page.waitForLoadState("networkidle");
    const link = page.locator('a[href^="/merch/"]').first();
    if ((await link.count()) === 0) test.skip(true, "No merch to open");
    const href = await link.getAttribute("href");
    const res = await page.goto(BASE + href);
    expect(res?.status()).toBeLessThan(400);
  });

  test("6.2 detail page has H1 + price", async ({ page }) => {
    await page.goto(`${BASE}/artists/${KNOWN_ARTIST}`);
    const link = page.locator('a[href^="/merch/"]').first();
    if ((await link.count()) === 0) test.skip(true, "No merch to open");
    const href = await link.getAttribute("href");
    await page.goto(BASE + href);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByText(/£\d+\.\d{2}/).first()).toBeVisible();
  });
});

// ============================================================
// 7. VENUE PROFILE
// ============================================================
test.describe("7. Venue profile", () => {
  test("7.1 /venue/<slug> loads", async ({ page }) => {
    const res = await page.goto(`${BASE}/venue/${KNOWN_VENUE}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    expect(res?.status()).toBeLessThan(400);
  });

  test("7.2 venue has H1", async ({ page }) => {
    await page.goto(`${BASE}/venue/${KNOWN_VENUE}`);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });

  test("7.3 availability calendar section present", async ({ page }) => {
    await page.goto(`${BASE}/venue/${KNOWN_VENUE}`);
    await page.waitForLoadState("networkidle");
    // either the calendar or "Booked" legend
    const hasLegend = await page.getByText(/available|booked|past/i).count();
    expect(hasLegend).toBeGreaterThan(0);
  });
});

// ============================================================
// 8. EVENT PAGE
// ============================================================
test.describe("8. Event page", () => {
  test("8.1 /event/<id> loads", async ({ page }) => {
    const res = await page.goto(`${BASE}/event/${KNOWN_EVENT}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    expect(res?.status()).toBeLessThan(400);
  });

  test("8.2 Get Tickets CTA present", async ({ page }) => {
    await page.goto(`${BASE}/event/${KNOWN_EVENT}`);
    await page.waitForLoadState("networkidle");
    const cta = page.getByRole("link", { name: /get tickets/i }).first();
    if ((await cta.count()) === 0) test.skip(true, "No Get Tickets");
    await expect(cta).toBeVisible();
  });

  test("8.3 ticket price shows £", async ({ page }) => {
    await page.goto(`${BASE}/event/${KNOWN_EVENT}`);
    await expect(page.getByText(/£\d+\.\d{2}/).first()).toBeVisible();
  });

  test("8.4 no mojibake on page", async ({ page }) => {
    await page.goto(`${BASE}/event/${KNOWN_EVENT}`);
    const body = await page.locator("body").innerText();
    const bad = ["Ã", "£", "Ãƒ", "â€", "·"];
    const found = bad.filter((b) => body.includes(b));
    expect(found, "mojibake found: " + found.join(", ")).toEqual([]);
  });
});

// ============================================================
// 9. PEOPLE PAGE
// ============================================================
test.describe("9. People page", () => {
  test("9.1 /people loads with heading", async ({ page }) => {
    await page.goto(`${BASE}/people`);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });

  test("9.2 has search bar", async ({ page }) => {
    await page.goto(`${BASE}/people`);
    await expect(page.getByPlaceholder(/search/i).first()).toBeVisible();
  });

  test("9.3 shows a role tab", async ({ page }) => {
    await page.goto(`${BASE}/people`);
    // "All" tab with count
    await expect(page.getByRole("link", { name: /^All\s*\d+$/ })).toBeVisible();
  });

  test("9.4 at least one person card", async ({ page }) => {
    await page.goto(`${BASE}/people`);
    const n = await page.locator("article").count();
    expect(n).toBeGreaterThan(0);
  });

  test("9.5 role filter narrows the list", async ({ page }) => {
    await page.goto(`${BASE}/people`);
    const aarTab = page.getByRole("link", { name: /^A&R\s*\d+$/ });
    if ((await aarTab.count()) === 0) test.skip(true, "No A&R tab");
    await aarTab.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/role=a_and_r/);
  });
});

// ============================================================
// 10. CITIES PAGES
// ============================================================
test.describe("10. Cities pages", () => {
  test("10.1 /cities renders", async ({ page }) => {
    await page.goto(`${BASE}/cities`);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });

  test("10.2 /cities has 20+ links", async ({ page }) => {
    await page.goto(`${BASE}/cities`);
    const n = await page.locator('a[href^="/"]').count();
    expect(n).toBeGreaterThanOrEqual(20);
  });

  test("10.3 /london renders", async ({ page }) => {
    await page.goto(`${BASE}/london`);
    const h = page.getByRole("heading", { level: 1 }).first();
    await expect(h).toBeVisible({ timeout: 15000 });
    expect((await h.innerText()).toLowerCase()).toContain("london");
  });
});

// ============================================================
// 11. API CONTRACTS
// ============================================================
test.describe("11. API contracts", () => {
  test("11.1 /api/follows/status requires params", async ({ request }) => {
    const res = await request.get("/api/follows/status");
    expect(res.status()).toBe(400);
  });

  test("11.2 /api/follows/status returns shape", async ({ request }) => {
    const res = await request.get(
      `/api/follows/status?targetType=venue&targetId=${KNOWN_VENUE}`
    );
    expect([200, 400]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(body).toHaveProperty("following");
      expect(body).toHaveProperty("count");
    }
  });

  test("11.3 /api/follows/toggle rejects bad payload", async ({ request }) => {
    const res = await request.post("/api/follows/toggle", {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    expect([400, 401]).toContain(res.status());
  });

  test("11.4 /api/merch/checkout requires merchId", async ({ request }) => {
    const res = await request.post("/api/merch/checkout", { data: {} });
    expect([400, 500]).toContain(res.status());
  });

  test("11.5 /api/merch/webhook requires signature", async ({ request }) => {
    const res = await request.post("/api/merch/webhook", {
      data: { type: "checkout.session.completed" },
    });
    expect(res.status()).toBe(400);
  });

  test("11.6 artist follow endpoint requires auth", async ({ request }) => {
    const res = await request.post(`/api/artists/${KNOWN_ARTIST}/follow`, {
      data: { following: true },
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).not.toBe(200);
  });

  test("11.7 /sitemap.xml returns 200", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
  });

  test("11.8 /robots.txt returns 200", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
  });
});

// ============================================================
// 12. ACCESSIBILITY
// ============================================================
test.describe("12. Accessibility", () => {
  test("12.1 /home has no unlabeled buttons", async ({ page }) => {
    await page.goto(`${BASE}/home`);
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    const buttons = page.getByRole("button");
    const n = await buttons.count();
    const offenders: string[] = [];
    for (let i = 0; i < n; i++) {
      const b = buttons.nth(i);
      const al = await b.getAttribute("aria-label");
      const t = (await b.innerText().catch(() => "")).trim();
      if (!al && !t) offenders.push(await b.evaluate((el) => el.outerHTML.slice(0, 120)));
    }
    expect(offenders).toEqual([]);
  });

  test("12.2 /home has no images without alt", async ({ page }) => {
    await page.goto(`${BASE}/home`);
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    const imgs = page.locator("img");
    const n = await imgs.count();
    const missing: string[] = [];
    for (let i = 0; i < n; i++) {
      const alt = await imgs.nth(i).getAttribute("alt");
      if (alt === null) missing.push((await imgs.nth(i).getAttribute("src")) || "(no src)");
    }
    expect(missing).toEqual([]);
  });

  test("12.3 /people has no unlabeled buttons", async ({ page }) => {
    await page.goto(`${BASE}/people`);
    const buttons = page.getByRole("button");
    const n = await buttons.count();
    const offenders: string[] = [];
    for (let i = 0; i < n; i++) {
      const b = buttons.nth(i);
      const al = await b.getAttribute("aria-label");
      const t = (await b.innerText().catch(() => "")).trim();
      if (!al && !t) offenders.push(await b.evaluate((el) => el.outerHTML.slice(0, 120)));
    }
    expect(offenders).toEqual([]);
  });
});

// ============================================================
// 13. CONSOLE HYGIENE
// ============================================================
test.describe("13. Console hygiene", () => {
  test("13.1 /home no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    await page.waitForTimeout(1500);

    const real = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("React DevTools") &&
        !e.includes("manifest.webmanifest") &&
        !e.includes("hydration") &&
        !e.includes("katalonextensionid")
    );
    expect(real).toEqual([]);
  });

  test("13.2 /cities no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/cities`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(1500);

    const real = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("React DevTools") &&
        !e.includes("manifest.webmanifest") &&
        !e.includes("hydration") &&
        !e.includes("katalonextensionid")
    );
    expect(real).toEqual([]);
  });

  test("13.3 /people no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`${BASE}/people`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(1500);

    const real = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("React DevTools") &&
        !e.includes("manifest.webmanifest") &&
        !e.includes("hydration") &&
        !e.includes("katalonextensionid")
    );
    expect(real).toEqual([]);
  });
});

// ============================================================
// 14. NAVIGATION FLOW
// ============================================================
test.describe("14. Navigation flow", () => {
  test("14.1 home → artist profile → back", async ({ page }) => {
    await page.goto(`${BASE}/artists`);
    await page.waitForLoadState("networkidle");
    const link = page.locator('a[href^="/artists/"]').first();
    if ((await link.count()) === 0) test.skip(true, "No artist links");
    const href = await link.getAttribute("href");
    await link.click();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain(href!);
  });

  test("14.2 event → Get Tickets flow", async ({ page }) => {
    await page.goto(`${BASE}/event/${KNOWN_EVENT}`);
    await page.waitForLoadState("networkidle");
    const cta = page.getByRole("link", { name: /get tickets/i }).first();
    if ((await cta.count()) === 0) test.skip(true, "No Get Tickets");
    const href = await cta.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/checkout|event/);
  });

  test("14.3 404 page renders", async ({ page }) => {
    await page.goto(`${BASE}/this-page-does-not-exist-${Date.now()}`);
    const notFound = await page.getByText(/404|not found|this page could not be found/i).count();
    expect(notFound).toBeGreaterThan(0);
  });
});