import { test, expect } from "./fixtures/base";

test.describe("/home feed", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
  });

  test("returns 200 and renders a heading", async ({ page }) => {
    const res = await page.goto("/home");
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: /feed|discover|home/i }).first()
    ).toBeVisible();
  });

  test("page body is not empty", async ({ page }) => {
    const body = await page.locator("body").innerText();
    expect(body.length).toBeGreaterThan(50);
  });

  test("composer input is visible", async ({ page }) => {
    const composer = page
      .getByPlaceholder(/what is happening/i)
      .or(page.getByRole("textbox", { name: /what is happening/i }))
      .first();
    await expect(composer).toBeVisible();
  });

  test("Post button exists", async ({ page }) => {
    await expect(page.getByRole("button", { name: /^post$/i }).first()).toBeVisible();
  });

  test("Post button is disabled when composer is empty", async ({ page }) => {
    const post = page.getByRole("button", { name: /^post$/i }).first();
    const composer = page.getByPlaceholder(/what is happening/i).first();
    await composer.fill("");
    await expect(post).toBeDisabled();
  });

  test("renders at least one post", async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"], article');
    const count = await posts.count();
    if (count === 0) {
      throw new Error("No posts found. Feed may be empty or missing data-testid='post-card'.");
    }
    expect(count).toBeGreaterThan(0);
  });

  test("no duplicate author name on any single post", async ({ page }) => {
    const cards = page.locator('[data-testid="post-card"], article');
    const count = await cards.count();
    if (count === 0) test.skip();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = await cards.nth(i).innerText();
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      for (let j = 1; j < lines.length; j++) {
        if (lines[j] === lines[j - 1] && lines[j].length > 1 && lines[j].length < 60) {
          throw new Error(`Duplicate line "${lines[j]}" in post ${i}:\n${text}`);
        }
      }
    }
  });

  test("'Yesterday' section does not contain today's posts", async ({ page }) => {
    const body = await page.locator("body").innerText();
    if (!/yesterday/i.test(body)) test.skip();
    const today = new Date();
    const dayName = today.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const yesterdayBlock = body.split(/yesterday/i)[1]?.split(/this week|today|earlier/i)[0];
    if (!yesterdayBlock) test.skip();
    if (yesterdayBlock.includes(dayName)) {
      throw new Error(`"Yesterday" contains today's date (${dayName}).`);
    }
  });

  test("right rail shows Trending", async ({ page }) => {
    const t = page.getByText(/^trending$/i).first();
    if ((await t.count()) === 0) test.skip();
    await expect(t).toBeVisible();
  });

  test("right rail shows People to follow", async ({ page }) => {
    const p = page.getByText(/people to follow/i).first();
    if ((await p.count()) === 0) test.skip();
    await expect(p).toBeVisible();
  });

  test("sidebar shows YOUR LIBRARY", async ({ page }) => {
    await expect(page.getByText(/your library/i).first()).toBeVisible();
  });

  test("has <main> landmark", async ({ page }) => {
    expect(await page.locator("main").count()).toBeGreaterThan(0);
  });

  test("has at least one <nav> landmark", async ({ page }) => {
    expect(await page.locator("nav").count()).toBeGreaterThan(0);
  });

  test("all buttons have accessible names", async ({ page }) => {
    const buttons = page.getByRole("button");
    const count = await buttons.count();
    const offenders: string[] = [];
    for (let i = 0; i < count; i++) {
      const b = buttons.nth(i);
      const ariaLabel = await b.getAttribute("aria-label");
      const text = (await b.innerText().catch(() => ""))?.trim();
      if (!ariaLabel && !text) {
        offenders.push(await b.evaluate((el) => el.outerHTML.slice(0, 120)));
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  test("no console/page errors on load", async ({ page, consoleErrors }) => {
    await page.waitForTimeout(1000);
    const real = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("React DevTools")
    );
    expect(real, real.join("\n")).toEqual([]);
  });
});
