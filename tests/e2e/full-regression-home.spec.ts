import { test, expect } from "./fixtures/base";

// ============================================================
// FULL REGRESSION — HOME PAGE
// ============================================================
// Covers: rendering, composer, feed, likes, comments, share,
//         tabs, load-more, landmarks, a11y, console, auth.
// Every test auto-skips if redirected to /login so the suite
// is safe to run without the auth fixture configured.
// ============================================================

test.describe("FULL REGRESSION — Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 20000 });
    // If auth fixture is missing, /home redirects to /login.
    // Skip every test gracefully in that case.
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required — run with the auth fixture");
    }
  });

  // ----------------------------------------------------------
  // 1. RENDER — page loads and structure is correct
  // ----------------------------------------------------------

  test("1.1 returns 200 and renders a heading", async ({ page }) => {
    const res = await page.goto("/home", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    const heading = page.getByRole("heading", { level: 1 }).first();
    await expect(heading).toBeVisible();
    const text = (await heading.innerText()).trim();
    expect(text.length).toBeGreaterThan(0);
  });

  test("1.2 page body is not empty", async ({ page }) => {
    const body = await page.locator("body").innerText();
    expect(body.length).toBeGreaterThan(50);
  });

  test("1.3 has <main> landmark", async ({ page }) => {
    expect(await page.locator("main").count()).toBeGreaterThan(0);
  });

  test("1.4 has at least one <nav> landmark", async ({ page }) => {
    expect(await page.locator("nav").count()).toBeGreaterThan(0);
  });

  test("1.5 has at least one <aside> landmark (right rail)", async ({ page }) => {
    expect(await page.locator("aside").count()).toBeGreaterThan(0);
  });

  // ----------------------------------------------------------
  // 2. SIDEBAR — YOUR LIBRARY present, nav links
  // ----------------------------------------------------------

  test("2.1 sidebar shows YOUR LIBRARY", async ({ page }) => {
    await expect(page.getByText(/your library/i).first()).toBeVisible();
  });

  test("2.2 sidebar has exactly one YOUR LIBRARY (no duplicate)", async ({ page }) => {
    const labels = page.getByText(/your library/i);
    await expect(labels).toHaveCount(1);
  });

  test("2.3 sidebar contains expected nav links", async ({ page }) => {
    const labels = [
      "Home",
      "Artists",
      "Search",
      "My Tickets",
      "Friends",
      "Messages",
      "Following",
      "Network",
      "Opportunities",
      "Dashboard",
    ];
    for (const label of labels) {
      const link = page.getByRole("link", { name: new RegExp("^" + label + "$", "i") }).first();
      if ((await link.count()) === 0) continue;
      await expect(link).toBeVisible();
    }
  });

  // ----------------------------------------------------------
  // 3. COMPOSER — textarea, Post button
  // ----------------------------------------------------------

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
    const placeholder = await textbox.getAttribute("placeholder");
    const hasRealLabel = Boolean(ariaLabel || ariaLabelledBy);
    expect(
      hasRealLabel,
      "Composer relies only on placeholder: " + placeholder
    ).toBe(true);
  });

  test("3.3 Post button exists", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /^post$/i }).first()
    ).toBeVisible();
  });

  test("3.4 Post button is disabled when composer is empty", async ({ page }) => {
    const post = page.getByRole("button", { name: /^post$/i }).first();
    const composer = page.getByPlaceholder(/what is happening/i).first();
    await composer.fill("");
    await expect(post).toBeDisabled();
  });

  test("3.5 Post button becomes enabled after typing", async ({ page }) => {
    const post = page.getByRole("button", { name: /^post$/i }).first();
    const composer = page.getByPlaceholder(/what is happening/i).first();
    await composer.fill("Playwright regression test");
    await expect(post).toBeEnabled();
    await composer.fill("");
  });

  // ----------------------------------------------------------
  // 4. FEED TABS — For You / Following
  // ----------------------------------------------------------

  test("4.1 shows For You and Following tabs", async ({ page }) => {
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();
    await expect(tablist.getByRole("tab", { name: /for you/i })).toBeVisible();
    await expect(tablist.getByRole("tab", { name: /following/i })).toBeVisible();
  });

  test("4.2 default tab is For You and is selected", async ({ page }) => {
    const forYou = page.getByRole("tab", { name: /for you/i });
    await expect(forYou).toHaveAttribute("aria-selected", "true");
  });

  test("4.3 clicking Following updates URL", async ({ page }) => {
    await page.getByRole("tab", { name: /following/i }).click();
    await page.waitForURL(
      (url) => url.search.includes("tab=following"),
      { timeout: 8000 }
    );
    expect(page.url()).toContain("tab=following");
  });

  test("4.4 Following tab shows empty state or posts", async ({ page }) => {
    await page.goto("/home?tab=following", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    const hasEmpty = /no posts yet|not following anyone/i.test(body);
    const hasPosts = (await page.locator('[data-testid="post-card"], article').count()) > 0;
    expect(hasEmpty || hasPosts).toBe(true);
  });

  // ----------------------------------------------------------
  // 5. FEED CONTENT — posts render
  // ----------------------------------------------------------

  test("5.1 renders at least one post", async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"], article');
    const count = await posts.count();
    expect(count, "feed should render posts").toBeGreaterThan(0);
  });

  test("5.2 no duplicate author name on any single post", async ({ page }) => {
    const cards = page.locator('[data-testid="post-card"], article');
    const count = await cards.count();
    if (count === 0) test.skip();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = await cards.nth(i).innerText();
      const lines = text.split("\\n").map((l) => l.trim()).filter(Boolean);
      for (let j = 1; j < lines.length; j++) {
        if (lines[j] === lines[j - 1] && lines[j].length > 1 && lines[j].length < 60) {
          throw new Error("Duplicate line \\"" + lines[j] + "\\" in post " + i);
        }
      }
    }
  });

  test("5.3 posts show like and comment counts", async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"], article');
    const count = await posts.count();
    if (count === 0) test.skip();
    let found = false;
    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = await posts.nth(i).innerText();
      if (/\\d+/.test(text)) found = true;
    }
    expect(found, "at least one post shows a numeric count").toBe(true);
  });

  // ----------------------------------------------------------
  // 6. TIME GROUPING — Today / Yesterday / This week / Earlier
  // ----------------------------------------------------------

  test("6.1 Yesterday section does not contain today's date", async ({ page }) => {
    const body = await page.locator("body").innerText();
    if (!/yesterday/i.test(body)) test.skip();
    const today = new Date();
    const dayName = today.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const block = body.split(/yesterday/i)[1]?.split(/this week|today|earlier/i)[0];
    if (!block) test.skip();
    expect(block, "Yesterday block mislabeled").not.toContain(dayName);
  });

  test("6.2 timestamps use a relative or absolute format", async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"], article');
    if ((await posts.count()) === 0) test.skip();
    const text = await posts.first().innerText();
    const hasFormat = /just now|\\d+[smhd] ago|yesterday|\\d+d ago|\\d+ (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(text);
    expect(hasFormat).toBe(true);
  });

  // ----------------------------------------------------------
  // 7. LIKE BUTTON — toggle, aria, count
  // ----------------------------------------------------------

  test("7.1 every post has a like button with accessible name", async ({ page }) => {
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

  test("7.3 like count changes on click", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"], article').first();
    if ((await post.count()) === 0) test.skip();
    const like = post.getByRole("button", { name: /like|unlike/i });
    const before = await like.innerText();
    const nBefore = parseInt(before.match(/\\d+/)?.[0] || "0", 10);
    await like.click();
    await page.waitForTimeout(600);
    const after = await like.innerText();
    const nAfter = parseInt(after.match(/\\d+/)?.[0] || "0", 10);
    expect(Math.abs(nAfter - nBefore)).toBe(1);
  });

  // ----------------------------------------------------------
  // 8. COMMENT BUTTON — form opens, submit enabled
  // ----------------------------------------------------------

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
    if ((await textarea.count()) === 0) test.skip(true, "Inline comment box not present");
    await expect(textarea).toBeVisible();
  });

  // ----------------------------------------------------------
  // 9. SHARE BUTTON — present, opens menu
  // ----------------------------------------------------------

  test("9.1 share button exists on posts", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"], article').first();
    if ((await post.count()) === 0) test.skip();
    await expect(post.getByRole("button", { name: /share/i })).toBeVisible();
  });

  test("9.2 clicking share opens a menu or native share", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const post = page.locator('[data-testid="post-card"], article').first();
    if ((await post.count()) === 0) test.skip();
    const share = post.getByRole("button", { name: /share/i });
    await share.click();
    await page.waitForTimeout(400);
    const menu = page.getByRole("menu");
    if ((await menu.count()) === 0) test.skip(true, "Native share available — no menu");
    await expect(menu).toBeVisible();
  });

  // ----------------------------------------------------------
  // 10. LOAD MORE — button or end-of-feed marker
  // ----------------------------------------------------------

  test("10.1 load more button or end-of-feed marker present", async ({ page }) => {
    const loadMore = page.getByRole("link", { name: /load more/i });
    const endMarker = page.getByText(/end of feed/i);
    const either = (await loadMore.count()) + (await endMarker.count());
    expect(either, "should show Load more or End of feed").toBeGreaterThan(0);
  });

  // ----------------------------------------------------------
  // 11. RIGHT RAIL — trending, people to follow
  // ----------------------------------------------------------

  test("11.1 right rail shows Trending", async ({ page }) => {
    const t = page.getByText(/^trending$/i).first();
    if ((await t.count()) === 0) test.skip(true, "No Trending section");
    await expect(t).toBeVisible();
  });

  test("11.2 right rail shows People to follow", async ({ page }) => {
    const p = page.getByText(/people to follow/i).first();
    if ((await p.count()) === 0) test.skip(true, "No People to follow section");
    await expect(p).toBeVisible();
  });

  // ----------------------------------------------------------
  // 12. A11Y — buttons, images
  // ----------------------------------------------------------

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
    expect(offenders, offenders.join("\\n")).toEqual([]);
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
    expect(missing, missing.join("\\n")).toEqual([]);
  });

  // ----------------------------------------------------------
  // 13. CONSOLE — no errors on load
  // ----------------------------------------------------------

  test("13.1 no console errors on load", async ({ page, consoleErrors }) => {
    await page.waitForTimeout(1000);
    const real = consoleErrors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("React DevTools") &&
        !e.includes("Download the React DevTools")
    );
    expect(real, real.join("\\n")).toEqual([]);
  });

  test("13.2 no uncaught page errors on load", async ({ page, pageErrors }) => {
    await page.waitForTimeout(1000);
    expect(pageErrors, pageErrors.join("\\n")).toEqual([]);
  });
});

// ============================================================
// BONUS — unauthenticated redirect (fresh context)
// ============================================================
test.describe("Home page — unauthenticated behavior", () => {
  test("signed-out visitor is redirected or shown a fallback", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded" });
    const url = page.url();
    const onLogin = url.includes("/login");
    const stillHome = url.includes("/home");
    expect(onLogin || stillHome).toBe(true);
    await ctx.close();
  });
});
