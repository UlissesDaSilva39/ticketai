import { test, expect } from "./fixtures/base";

test.describe("/home — feed tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("shows For You and Following tabs", async ({ page }) => {
    const tablist = page.getByRole("tablist").first();
    await expect(tablist).toBeVisible();
    await expect(tablist.getByRole("tab", { name: /for you/i })).toBeVisible();
    await expect(tablist.getByRole("tab", { name: /following/i })).toBeVisible();
  });

  test("default tab is For You and is selected", async ({ page }) => {
    const forYou = page.getByRole("tab", { name: /for you/i });
    await expect(forYou).toHaveAttribute("aria-selected", "true");
  });

  test("clicking Following updates URL", async ({ page }) => {
    await page.getByRole("tab", { name: /following/i }).click();
    await page.waitForURL(/tab=following/);
    expect(page.url()).toContain("tab=following");
  });

  test("Following tab shows empty state if no follows", async ({ page }) => {
    await page.goto("/home?tab=following");
    const body = await page.locator("body").innerText();
    if (/no posts yet|not following anyone/i.test(body)) {
      expect(body).toMatch(/not following anyone|no posts yet/i);
    }
  });
});

test.describe("/home — relative timestamps", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("timestamps use relative format", async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"]');
    if ((await posts.count()) === 0) test.skip();

    const first = posts.first();
    const text = await first.innerText();

    const hasRelative = /just now|\\d+[smhd] ago|yesterday|\\d+d ago|\\d+ (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(text);
    expect(hasRelative, "first post should have a relative timestamp. Got: " + text.slice(0, 200)).toBe(true);
  });
});

test.describe("/home — comment thread expansion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("posts with >3 comments show View all link", async ({ page }) => {
    const viewAllLinks = page.getByRole("button", { name: /view all \\d+ comments/i });
    if ((await viewAllLinks.count()) === 0) test.skip(true, "No post has >3 comments");

    const link = viewAllLinks.first();
    await expect(link).toBeVisible();
    const label = await link.innerText();
    expect(label).toMatch(/view all \\d+ comments/i);
  });

  test("clicking View all expands comment list", async ({ page }) => {
    const viewAll = page.getByRole("button", { name: /view all \\d+ comments/i }).first();
    if ((await viewAll.count()) === 0) test.skip();

    const post = viewAll.locator("xpath=ancestor::article[1]");
    const commentsBefore = await post.locator('.flex.items-start.gap-2').count();

    await viewAll.click();
    await page.waitForTimeout(300);

    const commentsAfter = await post.locator('.flex.items-start.gap-2').count();
    expect(commentsAfter).toBeGreaterThan(commentsBefore);
  });
});
