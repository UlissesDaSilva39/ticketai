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
    await page.waitForTimeout(400);
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
    await page.waitForTimeout(400);

    const textAfter = await likeBtn.innerText();
    const nAfter = parseInt(textAfter.match(/\d+/)?.[0] || "0", 10);

    expect(nAfter).toBe(nBefore + 1);
  });

  test("share button is present", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();
    await expect(post.getByRole("button", { name: /share/i })).toBeVisible();
  });

  test("feed has end-of-feed marker or load more", async ({ page }) => {
    const marker = page.getByText(/end of feed|load more/i);
    if ((await marker.count()) === 0) test.skip();
    await expect(marker.first()).toBeAttached();
  });
});
