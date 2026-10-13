import { test, expect } from "./fixtures/base";

test.describe("/home comment form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required");
    }
  });

  test("clicking comment button opens form", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();

    const commentBtn = post.getByRole("button", { name: /write a comment/i });
    await commentBtn.click();
    await page.waitForTimeout(200);

    const textarea = post.getByPlaceholder(/write a comment/i);
    await expect(textarea).toBeVisible();
  });

  test("comment form has a Post button", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();

    const commentBtn = post.getByRole("button", { name: /write a comment/i });
    await commentBtn.click();

    const submit = post.getByRole("button", { name: /post comment/i });
    await expect(submit).toBeVisible();
    await expect(submit).toBeDisabled();
  });

  test("Post button enables when textarea has content", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();

    const commentBtn = post.getByRole("button", { name: /write a comment/i });
    await commentBtn.click();

    const textarea = post.getByPlaceholder(/write a comment/i);
    await textarea.fill("Playwright test comment");

    const submit = post.getByRole("button", { name: /post comment/i });
    await expect(submit).toBeEnabled();
  });

  test("comment counter increments after submit", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();

    const commentBtn = post.getByRole("button", { name: /write a comment/i });
    const before = await commentBtn.innerText();
    const nBefore = parseInt(before.match(/\d+/)?.[0] || "0", 10);

    await commentBtn.click();
    const textarea = post.getByPlaceholder(/write a comment/i);
    await textarea.fill("Playwright automated comment " + Date.now());

    const submit = post.getByRole("button", { name: /post comment/i });
    await submit.click();
    await page.waitForTimeout(1500);

    const after = await commentBtn.innerText();
    const nAfter = parseInt(after.match(/\d+/)?.[0] || "0", 10);

    expect(nAfter).toBe(nBefore + 1);
  });
});
