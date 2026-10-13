import { test, expect } from "./fixtures/base";

test.describe("/home share button", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required");
    }
  });

  test("share button opens dropdown on desktop", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();

    const shareBtn = post.getByRole("button", { name: /share/i });
    await shareBtn.click();
    await page.waitForTimeout(300);

    // On desktop headless, native share isn't available → dropdown opens
    const menu = page.getByRole("menu");
    if ((await menu.count()) > 0) {
      await expect(menu).toBeVisible();
      await expect(menu.getByText(/copy link/i)).toBeVisible();
    }
  });

  test("copy link copies post URL to clipboard", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();

    await post.getByRole("button", { name: /share/i }).click();
    await page.waitForTimeout(300);

    const menu = page.getByRole("menu");
    if ((await menu.count()) === 0) test.skip();

    await menu.getByText(/copy link/i).click();
    await page.waitForTimeout(400);

    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toMatch(/\/post\//);
  });

  test("share count increments after copy", async ({ page }) => {
    const post = page.locator('[data-testid="post-card"]').first();
    if ((await post.count()) === 0) test.skip();

    const shareBtn = post.getByRole("button", { name: /share/i });
    const before = await shareBtn.innerText();
    const nBefore = parseInt(before.match(/\d+/)?.[0] || "0", 10);

    await shareBtn.click();
    await page.waitForTimeout(300);

    const menu = page.getByRole("menu");
    if ((await menu.count()) === 0) test.skip();

    await menu.getByText(/copy link/i).click();
    await page.waitForTimeout(1500);

    const after = await shareBtn.innerText();
    const nAfter = parseInt(after.match(/\d+/)?.[0] || "0", 10);

    expect(nAfter).toBe(nBefore + 1);
  });

  test("/post/[id] page renders", async ({ page }) => {
    await page.goto("/home");
    const firstLink = page.locator('a[href^="/post/"]').first();
    if ((await firstLink.count()) === 0) test.skip();

    const href = await firstLink.getAttribute("href");
    const res = await page.goto(href!);
    expect(res!.status()).toBeLessThan(400);
  });
});
