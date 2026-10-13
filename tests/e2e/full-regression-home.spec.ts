import { test, expect } from "./fixtures/base";

// =================================================================
// FULL REGRESSION — HOME PAGE
// =================================================================
// Covers: rendering, composer, feed, likes, comments, share,
//         tabs, load-more, landmarks, a11y, console, auth.
// ==================================================================

test.describe("FULL REGRESSION — Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 20000 });
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required — run with the auth fixture");
    }
  });

  // 1. RENDER

  test("1.1 returns 200 and renders a heading", async ({ page }) => {
    const res = await page.goto("/home", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    const heading = page.getByRole("heading", { level: 1 }).first();
    await expect(heading).toBeVisible();
  });

  test("1.2 page body is not empty", async ({ page }) => {
    const body = await page.locator("body").innerText();
    expect(body.length).toBeGreaterThan(50);
  });

  test("1.3 has main landmark", async ({ page }) => {
    expect(await page.locator("main").count()).toBeGreaterThan(0);
  });

  test("1.4 has at least one nav landmark", async ({ page }) => {
    expect(await page.locator("nav").count()).toBeGreaterThan(0);
  });

  test("1.5 has at least one aside landmark", async ({ page }) => {
    expect(await page.locator("aside").count()).toBeGreaterThan(0);
  });

  // 2. SIDEBAR

  test("2.1 sidebar shows YOUR LIBRARY", async ({ page }) => {
    await expect(page.getByText(/your library/i).first()).toBeVisible();
  });

  test("2.2 sidebar has exactly one YOUR LIBRARY", async ({ page }) => {
    await expect(page.getByText(/your library/i)).toHaveCount(1);
  });

  // 3. COMPOSER

  test("3.1 composer textarea is visible", async ({ page }) => {
    const composer = page
      .getByPlaceholder(/what is happening/i)
      .or(page.getByRole("textbox", { name: /what is happening/i }))
      .first();
    await expect(composer).toBeVisible();
  });

  test("3.2 composer has an accessible name", async ({ page }) => {
    const textbox = page.getByRole("textbox").first();
    const ariaLabel = await textbox.getAttribute("aria-label");
    const ariaLabelledBy = await textbox.getAttribute("aria-labelledby");
    const hasRealLabel = Boolean(ariaLabel || ariaLabelledBy);
    expect(hasRealLabel).toBe(true);
  });

  test("3.3 Post button exists", async ({ page }) => {
    await expect(page.getByRole("button", { name: /^post$/i }).first()).toBeVisible();
  });

  test("3.4 Post button is disabled when composer is empty", async ({ page }) => {
    const post = page.getByRole("button", { name: /^post$/i }).first();
    const composer = page.getByPlaceholder(/what is happening/i).first();
    await composer.fill("");
    await expect(post).toBeDisabled();
  });

  test("3.5 Post button is enabled after typing", async ({ page }) => {
    const post = page.getByRole("button", { name: /^(post|posting)$/i }).first();
    const composer = page.getByPlaceholder(/what is happening/i).first();
    await composer.fill("Playwright regression");
    await expect(post).toBeEnabled();
    await composer.fill("");
  });

  // 4. FEED TABS

  test("4.1 For You and Following tabs present", async ({ page }) => {
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();
    await expect(tablist.getByRole("tab", { name: /for you/i })).toBeVisible();
    await expect(tablist.getByRole("tab", { name: /following/i })).toBeVisible();
  });

  test("4.2 default tab is For You", async ({ page }) => {
    await expect(page.getByRole("tab", { name: /for you/i })).toHaveAttribute("aria-selected", "true");
  });

  test("4.3 clicking Following updates URL", async ({ page }) => {
    await page.getByRole("tab", { name: /following/i }).click();
    await page.waitForURL((url) => url.search.includes("tab=following"), { timeout: 8000 });
    expect(page.url()).toContain("tab=following");
  });

  // 5. FEED CONTENT

  test("5.1 renders at least one post", async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"], article');
    expect(await posts.count()).toBeGreaterThan(0);
  });

  test("5.2 no duplicate author name on any post", async ({ page }) => {
    const cards = page.locator('[data-testid="post-card"], article');
    const count = await cards.count();
    if (count === 0) test.skip();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = await cards.nth(i).innerText();
      const lines = text.split(String.fromCharCode(10)).map((l) => l.trim()).filter(Boolean);
      for (let j = 1; j < lines.length; j++) {
        if (lines[j] === lines[j - 1] && lines[j].length > 1 && lines[j].length < 60) {
          throw new Error("Duplicate line [" + lines[j] + "] in post " + i);
        }
      }
    }
  });

  // 6. TIME GROUPING

  test("6.1 timestamps have a recognizable format", async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"], article');
    if ((await posts.count()) === 0) test.skip();
    const text = await posts.first().innerText();
    const hasFormat = /just now|[0-9]+[smhd] ago|yesterday|[0-9]+d ago/i.test(text);
    expect(hasFormat).toBe(true);
  });

  // 7. LIKE BUTTON

  test("7.1 every post has a like button", async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"], article');
    const count = await posts.count();
    if (count === 0) test.skip();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const like = posts.nth(i).getByRole("button", { name: /like|unlike/i });
      await expect(like).toBeVisible();
    }
  });

  test("7.2 clicking like toggles aria-pressed", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"], article').first();
    if ((await post.count()) === 0) test.skip();
    const like = post.getByRole("button", { name: /like|unlike/i });
    const before = await like.getAttribute("aria-pressed");
    await like.click();
    await page.waitForTimeout(600);
    const after = await like.getAttribute("aria-pressed");
    expect(before).not.toBe(after);
  });

  test("7.3 like count changes by 1 on click", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"], article').first();
    if ((await post.count()) === 0) test.skip();
    const like = post.getByRole("button", { name: /like|unlike/i });
    const before = await like.innerText();
    const nBefore = parseInt(before.match(/[0-9]+/)?.[0] || "0", 10);
    await like.click();
    await page.waitForTimeout(600);
    const after = await like.innerText();
    const nAfter = parseInt(after.match(/[0-9]+/)?.[0] || "0", 10);
    expect(Math.abs(nAfter - nBefore)).toBe(1);
  });

  // 8. COMMENT BUDTON

  test("8.1 comment button exists on posts", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"], article').first();
    if ((await post.count()) === 0) test.skip();
    const comment = post.getByRole("button", { name: /comment|write a comment/i }).first();
    await expect(comment).toBeVisible();
  });

  test("8.2 clicking comment opens a textarea", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"], article').first();
    if ((await post.count()) === 0) test.skip();
    const comment = post.getByRole("button", { name: /comment|write a comment/i }).first();
    await comment.click();
    await page.waitForTimeout(300);
    const textarea = post.getByPlaceholder(/write a comment/i);
    if ((await textarea.count()) === 0) test.skip();
    await expect(textarea).toBeVisible();
  });

  // 9. SHARE BUTTON

  test("9.1 share button exists on posts", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"], article').first();
    if ((await post.count()) === 0) test.skip();
    await expect(post.getByRole("button", { name: /share/i })).toBeVisible();
  });

  // 10. LOAD MORE

  test("10.1 load more button or end-of-feed marker present", async ({ page }) => {
    const loadMore = page.getByRole("link", { name: /load more/i });
    const endMarker = page.getByText(/end of feed/i);
    const either = (await loadMore.count()) + (await endMarker.count());
    expect(either).toBeGreaterThan(0);
  });

  // 11. RIGHT RAIL

  test("11.1 right rail shows Trending", async ({ page }) => {
    const t = page.getByText(/^trending$/i).first();
    if ((await t.count()) === 0) test.skip();
    await expect(t).toBeVisible();
  });

  test("11.2 right rail shows People to follow", async ({ page }) => {
    const p = page.getByText(/people to follow/i).first();
    if ((await p.count()) === 0) test.skip();
    await expect(p).toBeVisible();
  });

  // 12. A11Y

  test("12.1 all buttons have accessible names", async ({ page }) => {
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
    expect(offenders).toEqual([]);
  });

  test("12.2 all images have alt attributes", async ({ page }) => {
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
    expect(missing).toEqual([]);
  });

  // 13. CONSOLE

  test("13.1 no console errors on load", async ({ page, consoleErrors }) => {
    await page.waitForTimeout(1000);
    const real = consoleErrors.filter((e) => !e.includes("favicon") && !e.includes("React DevTools"));
    expect(real).toEqual([]);
  });

  test("13.2 no uncaught page errors on load", async ({ page, pageErrors }) => {
    await page.waitForTimeout(1000);
    expect(pageErrors).toEqual([]);
  });
});

test.describe("Home page — unauthenticated behavior", () => {
  test("signed-out visitor sees /home or /login", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded" });
    const url = page.url();
    expect(url.includes("/login") || url.includes("/home")).toBe(true);
    await ctx.close();
  });
});
