import { test, expect } from "@playwright/test";

// Known working event from the DB (see /scripts/survey-event.mjs)
const KNOWN_EVENT_ID = "fb0eb49f-979a-4f45-9097-5f1e6ccf9cee";

test.describe("/event/[id] — public event page", () => {
  test("returns 200 for a known event", async ({ page }) => {
    const res = await page.goto("/event/" + KNOWN_EVENT_ID, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    expect(res, "no response").not.toBeNull();
    expect(res!.status(), "expected 200").toBe(200);
  });

  test("returns 404 for an unknown event ID", async ({ page }) => {
    const res = await page.goto("/event/00000000-0000-0000-0000-000000000000", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    expect(res, "no response").not.toBeNull();
    expect([400, 404], "expected 400 or 404").toContain(res!.status());
  });

  test("renders a heading", async ({ page }) => {
    await page.goto("/event/" + KNOWN_EVENT_ID, { waitUntil: "domcontentloaded" });
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.first()).toBeVisible();
  });

  test("body contains the event title", async ({ page }) => {
    await page.goto("/event/" + KNOWN_EVENT_ID, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    expect(body, "should show event title").toContain("Test 15%");
  });

  test("no generic 404 text on a valid event", async ({ page }) => {
    await page.goto("/event/" + KNOWN_EVENT_ID, { waitUntil: "domcontentloaded" });
    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body).not.toContain("this page could not be found");
  });

  test("no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/event/" + KNOWN_EVENT_ID, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const real = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("React DevTools") &&
        !e.includes("Download the React DevTools")
    );
    expect(real, real.join("\n")).toEqual([]);
  });
});

test.describe("/event/[id] — page elements", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/event/" + KNOWN_EVENT_ID, { waitUntil: "domcontentloaded" });
  });

  test("has <main> landmark", async ({ page }) => {
    expect(await page.locator("main").count()).toBeGreaterThan(0);
  });

  test("has at least one <nav> landmark", async ({ page }) => {
    expect(await page.locator("nav").count()).toBeGreaterThan(0);
  });

  test("has a hero image or hero container", async ({ page }) => {
    const heroImg = page.locator("main img").first();
    const heroDiv = page.locator('[class*="hero"], [class*="cover"]').first();
    const count = (await heroImg.count()) + (await heroDiv.count());
    expect(count, "expected hero image or hero container").toBeGreaterThan(0);
  });

  test("has a share or action button", async ({ page }) => {
    const buttons = page.getByRole("button");
    const count = await buttons.count();
    expect(count, "expected at least one button").toBeGreaterThan(0);
  });

  test("all buttons have accessible names", async ({ page }) => {
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

    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  test("all images have alt attributes", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();
    const missing: string[] = [];

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      if (alt === null) {
        const src = await img.getAttribute("src");
        missing.push(src || "(no src)");
      }
    }

    expect(missing, missing.join("\n")).toEqual([]);
  });
});

test.describe("/event/[id] — navigation", () => {
  test("event card on /home links to a working page", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const firstEvent = page.locator('a[href^="/event/"]').first();
    if ((await firstEvent.count()) === 0) test.skip(true, "No events on home");

    const href = (await firstEvent.getAttribute("href"))!;
    const res = await page.goto(href, { waitUntil: "domcontentloaded", timeout: 20000 });

    expect(res!.status(), href + " returned " + res!.status()).toBeLessThan(400);
  });

  test("event card on /artists links to a working page", async ({ page }) => {
    await page.goto("/artists", { waitUntil: "domcontentloaded" });

    const firstEvent = page.locator('a[href^="/event/"]').first();
    if ((await firstEvent.count()) === 0) test.skip(true, "No events on /artists");

    const href = (await firstEvent.getAttribute("href"))!;
    const res = await page.goto(href, { waitUntil: "domcontentloaded", timeout: 20000 });

    expect(res!.status(), href + " returned " + res!.status()).toBeLessThan(400);
  });

  test("event card on /london links to a working page", async ({ page }) => {
    await page.goto("/london", { waitUntil: "domcontentloaded" });

    const firstEvent = page.locator('a[href^="/event/"]').first();
    if ((await firstEvent.count()) === 0) test.skip(true, "No events in London");

    const href = (await firstEvent.getAttribute("href"))!;
    const res = await page.goto(href, { waitUntil: "domcontentloaded", timeout: 20000 });

    expect(res!.status(), href + " returned " + res!.status()).toBeLessThan(400);
  });
});

test.describe("/event/[id] — /events/[...slug] alias", () => {
  test("/events/test-15 returns a response (200, 3xx, or 404)", async ({ page }) => {
    const res = await page.goto("/events/test-15", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    expect(res, "no response").not.toBeNull();
    expect(res!.status(), "should not be a 500").toBeLessThan(500);
  });

  test("/events route does not crash the server", async ({ page }) => {
    await page.goto("/events/test-15", { waitUntil: "domcontentloaded" });
    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body).not.toContain("internal server error");
  });
});
