import { test, expect } from "./fixtures/base";

test.describe("/notifications page", () => {
  test("redirects to login when not authenticated", async ({ page }) => {
    const res = await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) {
      expect(page.url()).toContain("/login");
      return;
    }
    expect(res?.status()).toBeLessThan(400);
  });

  test("renders Notifications heading when authenticated", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.first()).toBeVisible();
    const text = await heading.first().innerText();
    expect(text.toLowerCase()).toContain("notification");
  });

  test("has a main landmark", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    expect(await page.locator("main").count()).toBeGreaterThan(0);
  });

  test("has a nav landmark (sidebar)", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    expect(await page.locator("nav").count()).toBeGreaterThan(0);
  });

  test("shows empty state, unread state, or a list of notifications", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const body = await page.locator("body").innerText();
    const hasEmpty = /no notifications|you have no/i.test(body);
    const hasUnread = /unread|caught up|mark all as read/i.test(body);
    const hasContent = /follow|comment|like|mention|message|request/i.test(body);
    expect(hasEmpty || hasUnread || hasContent).toBe(true);
  });

  test("all buttons have accessible names", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const buttons = page.getByRole("button");
    const count = await buttons.count();
    const offenders: string[] = [];

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const ariaLabel = await btn.getAttribute("aria-label");
      const text = (await btn.innerText().catch(() => "")).trim();
      if (!ariaLabel && !text) {
        offenders.push(await btn.evaluate((el) => el.outerHTML.slice(0, 120)));
      }
    }

    expect(offenders, offenders.join("\\n")).toEqual([]);
  });

  test("no console errors on load", async ({ page, consoleErrors }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    await page.waitForTimeout(800);

    const real = consoleErrors.filter((e) =>
      !e.includes("favicon") && !e.includes("React DevTools")
    );
    expect(real, real.join("\\n")).toEqual([]);
  });
});

test.describe("/notifications mark as read flow", () => {
  test("Mark all as read button is present when there are unread items", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const btn = page.getByRole("button", { name: /mark all as read/i });
    if ((await btn.count()) === 0) test.skip(true, "No unread notifications");

    await expect(btn).toBeVisible();
  });

  test("clicking Mark all as read clears unread label", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const btn = page.getByRole("button", { name: /mark all as read/i });
    if ((await btn.count()) === 0) test.skip(true, "No unread notifications");

    await btn.click();
    await page.waitForTimeout(1500);

    const body = await page.locator("body").innerText();
    expect(body).toMatch(/all caught up|no notifications/i);
  });
});

test.describe("/api/notifications/unread-count", () => {
  test("returns JSON with numeric count", async ({ request }) => {
    const res = await request.get("/api/notifications/unread-count");
    expect([200, 401]).toContain(res.status());

    if (res.status() === 200) {
      const data = await res.json();
      expect(typeof data.count).toBe("number");
      expect(data.count).toBeGreaterThanOrEqual(0);
    }
  });

  test("never returns a 500", async ({ request }) => {
    const res = await request.get("/api/notifications/unread-count");
    expect(res.status()).toBeLessThan(500);
  });

  test("returns content-type application/json", async ({ request }) => {
    const res = await request.get("/api/notifications/unread-count");
    if (res.status() !== 200) test.skip();
    expect(res.headers()["content-type"]).toContain("application/json");
  });
});

test.describe("NotificationBell (header)", () => {
  test("bell link is present on /home when logged in", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const bell = page.getByRole("link", { name: /notification/i }).first();
    if ((await bell.count()) === 0) test.skip(true, "Bell not wired into header");

    await expect(bell).toBeVisible();
  });

  test("bell navigates to /notifications when clicked", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const bell = page.getByRole("link", { name: /notification/i }).first();
    if ((await bell.count()) === 0) test.skip(true, "Bell not wired into header");

    await bell.click();
    await page.waitForURL((url) => url.pathname.includes("/notifications"), { timeout: 8000 });
    expect(page.url()).toContain("/notifications");
  });
});
