import { test, expect } from "./fixtures/base";

test.describe("/home interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required");
    }
  });

  test("every post has like button", async ({ page }) => {
    const posts = page.locator('[data-testid="post-card"]');
    const count = await posts.count();
    if (count === 0) test.skip();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const likeBtn = posts.nth(i).getByRole("button", { name: /like|unlike/i });
      await expect(likeBtn).toBeVisible();
    }
  });

  test("clicking like toggles aria-pressed", async ({ page }) => {
    const firstLike = page.locator('[data-testid="post-card"]')
      .first()
      .getByRole("button", { name: /like|unlike/i });

    if ((await firstLike.count()) === 0) test.skip();

    const before = await firstLike.getAttribute("aria-pressed");
    await firstLike.click();
    await page.waitForTimeout(600);
    const after = await firstLike.getAttribute("aria-pressed");

    expect(before).not.toBe(after);
  });

  test("like count updates on click", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();

    const likeBtn = post.getByRole("button", { name: /like|unlike/i });
    const textBefore = await likeBtn.innerText();
    const nBefore = parseInt(textBefore.match(/\d+/)?.[0] || "0", 10);

    await likeBtn.click();
    await page.waitForTimeout(600);

    const textAfter = await likeBtn.innerText();
    const nAfter = parseInt(textAfter.match(/\d+/)?.[0] || "0", 10);

    const delta = Math.abs(nAfter - nBefore);
    expect(delta, "like count should change by 1").toBe(1);
  });

  test("share button is present", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();
    await expect(post.getByRole("button", { name: /share/i })).toBeVisible();
  });

  test("load more button or end-of-feed marker present", async ({ page }) => {
    const loadMore = page.getByRole("link", { name: /load more/i });
    const endMarker = page.getByText(/end of feed/i);
    const either = (await loadMore.count()) + (await endMarker.count());
    expect(either, "should show Load more or End of feed").toBeGreaterThan(0);
  });

  test("clicking Load more increases post count", async ({ page }) => {
    const loadMore = page.getByRole("link", { name: /load more/i }).first();
    if ((await loadMore.count()) === 0) test.skip(true, "No Load more button (already at end)");

    const postsBefore = await page.locator('[data-testid="post-card"]').count();
    await loadMore.click();
    await page.waitForURL(/offset=/);
    await page.waitForTimeout(800);
    const postsAfter = await page.locator('[data-testid="post-card"]').count();

    expect(postsAfter, "URL offset should give more posts").toBeGreaterThan(postsBefore);
  });
});
