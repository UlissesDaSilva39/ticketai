const fs = require("fs");
const path = require("path");

const spec = `import { test, expect } from "./fixtures/base";

/* ============================================================
 *  GRID — Full Regression Suite
 *  ------------------------------------------------------------
 *  Single-file E2E regression covering every critical user path.
 * ============================================================ */

const PUBLIC_ROUTES = [
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
];

// ============================================================
// R1. Auth gates
// ============================================================
test.describe("R1. Auth gates - signed-out users", () => {
  const protectedRoutes = ["/home", "/messages", "/notifications", "/profile"];

  for (const route of protectedRoutes) {
    test("R1." + (protectedRoutes.indexOf(route) + 1) + " " + route + " redirects to /login", async ({ browser }) => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto("http://localhost:3000" + route, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.waitForURL(/\\/login/, { timeout: 8000 }).catch(() => {});
      expect(page.url()).toContain("/login");
      await ctx.close();
    });
  }
});

// ============================================================
// R2. Public pages
// ============================================================
test.describe("R2. Public pages", () => {
  for (const route of PUBLIC_ROUTES) {
    test("R2." + (PUBLIC_ROUTES.indexOf(route) + 1) + " GET " + route + " returns < 400", async ({ request }) => {
      const res = await request.get(route);
      expect(res.status()).toBeLessThan(400);
    });
  }
});

// ============================================================
// R3. Home feed
// ============================================================
test.describe("R3. Home feed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("R3.1 home loads with H1", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({ timeout: 15000 });
  });

  test("R3.2 composer placeholder visible", async ({ page }) => {
    await expect(page.getByPlaceholder(/what is happening/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("R3.3 has main + nav landmarks", async ({ page }) => {
    expect(await page.locator("main").count()).toBeGreaterThan(0);
    expect(await page.locator("nav").count()).toBeGreaterThan(0);
  });

  test("R3.4 at least one post", async ({ page }) => {
    const n = await page.locator('[data-testid="post-card"], article').count();
    expect(n).toBeGreaterThan(0);
  });
});

// ============================================================
// R4. Notification bell
// ============================================================
test.describe("R4. Notification bell", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("R4.1 bell link exists", async ({ page }) => {
    const bell = page.getByRole("link", { name: /notification/i }).first();
    await expect(bell).toBeVisible({ timeout: 15000 });
  });

  test("R4.2 bell href points to /notifications", async ({ page }) => {
    const bell = page.getByRole("link", { name: /notification/i }).first();
    const href = await bell.getAttribute("href");
    expect(href).toBe("/notifications");
  });
});

// ============================================================
// R5. Artist profile
// ============================================================
test.describe("R5. Artist profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/artist/basement-collective", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("R5.1 loads with heading", async ({ page }) => {
    const h = page.getByRole("heading", { level: 1 }).first();
    await expect(h).toBeVisible({ timeout: 15000 });
  });

  test("R5.2 follow button present", async ({ page }) => {
    const btn = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(btn).toBeVisible({ timeout: 15000 });
  });
});

// ============================================================
// R6. Venue profile
// ============================================================
test.describe("R6. Venue profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/venue/test-first-veneu", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("R6.1 loads", async ({ page }) => {
    expect(page.url()).toContain("/venue/");
  });

  test("R6.2 follow button present", async ({ page }) => {
    const btn = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(btn).toBeVisible({ timeout: 15000 });
  });
});

// ============================================================
// R7. Follow API contracts
// ============================================================
test.describe("R7. Follow API contracts", () => {
  test("R7.1 artist follow rejects unauth", async ({ request }) => {
    const res = await request.post("/api/artists/basement-collective/follow", {
      data: { following: true },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 403, 307]).toContain(res.status());
  });

  test("R7.2 venue follow toggle rejects unauth", async ({ request }) => {
    const res = await request.post("/api/follows/toggle", {
      data: { targetType: "venue", targetId: "test-first-veneu" },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 403, 307]).toContain(res.status());
  });

  test("R7.3 status endpoint requires params", async ({ request }) => {
    const res = await request.get("/api/follows/status");
    expect(res.status()).toBe(400);
  });
});

// ============================================================
// R8. Messages inbox
// ============================================================
test.describe("R8. Messages inbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("R8.1 inbox renders heading", async ({ page }) => {
    await expect(page.getByTestId("messages-heading")).toBeVisible({ timeout: 15000 });
  });

  test("R8.2 shows empty state or rows", async ({ page }) => {
    const rows = await page.locator('[data-testid="conversation-row"]').count();
    const empty = await page.getByText(/no conversations yet/i).count();
    expect(rows + empty).toBeGreaterThan(0);
  });
});

// ============================================================
// R9. Message thread
// ============================================================
test.describe("R9. Message thread", () => {
  test("R9.1 opens from inbox and shows input", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const rows = page.locator('[data-testid="conversation-row"]');
    if ((await rows.count()) === 0) test.skip(true, "No conversations");

    await rows.first().click();
    await page.waitForURL(/\\/messages\\/[^/]+$/, { timeout: 10000 });

    await expect(page.getByTestId("thread-heading")).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("message-input")).toBeVisible();
    await expect(page.getByTestId("message-send")).toBeVisible();
  });

  test("R9.2 invalid conversation id returns 404 or /login", async ({ page }) => {
    await page.goto("/messages/00000000-0000-0000-0000-000000000000", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    const url = page.url();
    const is404 = (await page.getByText(/404|not found/i).count()) > 0;
    expect(url.includes("/login") || is404).toBe(true);
  });
});

// ============================================================
// R10. City pages
// ============================================================
test.describe("R10. City pages", () => {
  test("R10.1 /cities index renders", async ({ page }) => {
    await page.goto("/cities", { waitUntil: "domcontentloaded", timeout: 30000 });
    await expect(page.getByTestId("cities-heading")).toBeVisible({ timeout: 15000 });
  });

  test("R10.2 /cities shows 20+ tiles", async ({ page }) => {
    await page.goto("/cities", { waitUntil: "domcontentloaded", timeout: 30000 });
    expect(await page.getByTestId("city-tile").count()).toBeGreaterThanOrEqual(20);
  });

  test("R10.3 /london renders city heading", async ({ page }) => {
    await page.goto("/london", { waitUntil: "domcontentloaded", timeout: 30000 });
    await expect(page.getByTestId("city-heading")).toBeVisible({ timeout: 15000 });
  });
});

// ============================================================
// R11. Accessibility
// ============================================================
test.describe("R11. Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("R11.1 no unlabeled buttons", async ({ page }) => {
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

  test("R11.2 no images without alt", async ({ page }) => {
    const imgs = page.locator("img");
    const n = await imgs.count();
    const missing: string[] = [];
    for (let i = 0; i < n; i++) {
      const alt = await imgs.nth(i).getAttribute("alt");
      if (alt === null) missing.push((await imgs.nth(i).getAttribute("src")) || "(no src)");
    }
    expect(missing).toEqual([]);
  });
});

// ============================================================
// R12. Console hygiene
// ============================================================
test.describe("R12. Console hygiene", () => {
  test("R12.1 /home has no console errors", async ({ page, consoleErrors }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    await page.waitForTimeout(1000);
    const real = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("React DevTools")
    );
    expect(real).toEqual([]);
  });

  test("R12.2 /cities has no console errors", async ({ page, consoleErrors }) => {
    await page.goto("/cities", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(1000);
    const real = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("React DevTools")
    );
    expect(real).toEqual([]);
  });
});

// ============================================================
// R13. API contracts
// ============================================================
test.describe("R13. API contracts", () => {
  test("R13.1 follow status returns expected shape", async ({ request }) => {
    const res = await request.get("/api/follows/status?targetType=venue&targetId=test-first-veneu");
    if (res.status() === 200) {
      const body = await res.json();
      expect(body).toHaveProperty("following");
      expect(body).toHaveProperty("count");
      expect(body).toHaveProperty("signedIn");
    } else {
      expect([200, 401]).toContain(res.status());
    }
  });

  test("R13.2 follow toggle rejects bad payload", async ({ request }) => {
    const res = await request.post("/api/follows/toggle", {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    expect([400, 401]).toContain(res.status());
  });
});
`;

fs.mkdirSync("tests/e2e", { recursive: true });
fs.writeFileSync("tests/e2e/full-regression.spec.ts", spec, "utf8");
const lines = spec.split("\n").length;
const tests = (spec.match(/test\(/g) || []).length;
console.log("Written: tests/e2e/full-regression.spec.ts");
console.log("Lines: " + lines);
console.log("Test blocks: " + tests);
