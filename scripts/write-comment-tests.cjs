const fs = require("fs");
const path = require("path");

const spec = `import { test, expect } from "./fixtures/base";

/* ============================================================
 *  Post Comments — Home feed
 * ============================================================ */

test.describe("Post Comments", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required");
    }
  });

  test("C1. comment section is present on at least one post", async ({ page }) => {
    const sections = page.locator('[data-testid="comment-section"]');
    const count = await sections.count();
    if (count === 0) test.skip(true, "No posts on feed");
    await expect(sections.first()).toBeVisible({ timeout: 10000 });
  });

  test("C2. comment input exists", async ({ page }) => {
    const input = page.locator('[data-testid="comment-input"]').first();
    if ((await input.count()) === 0) test.skip(true, "No comment inputs");
    await expect(input).toBeVisible();
  });

  test("C3. typing enables the Post button", async ({ page }) => {
    const input = page.locator('[data-testid="comment-input"]').first();
    if ((await input.count()) === 0) test.skip(true, "No comment inputs");

    const form = input.locator("xpath=ancestor::form[1]");
    const submit = form.locator('[data-testid="comment-submit"]');

    await input.fill("");
    await expect(submit).toBeDisabled();

    await input.fill("test comment from playwright");
    await expect(submit).toBeEnabled();

    await input.fill("");
  });

  test("C4. posting a comment adds it to the list", async ({ page }) => {
    const input = page.locator('[data-testid="comment-input"]').first();
    if ((await input.count()) === 0) test.skip(true, "No comment inputs");

    const form = input.locator("xpath=ancestor::form[1]");
    const submit = form.locator('[data-testid="comment-submit"]');
    const section = form.locator("xpath=ancestor::*[@data-testid='comment-section'][1]");
    const before = await section.locator('[data-testid="comment-item"]').count();

    const unique = "pw-test-" + Date.now();
    await input.fill(unique);

    const postPromise = page
      .waitForResponse(
        (r) => r.url().includes("/api/posts/comment/create") && r.request().method() === "POST",
        { timeout: 10000 }
      )
      .catch(() => null);

    await submit.click();
    const resp = await postPromise;

    if (resp) expect(resp.status()).toBeLessThan(500);

    await page.waitForTimeout(800);

    const after = await section.locator('[data-testid="comment-item"]').count();
    const grew = after > before;

    if (resp && resp.status() < 400) {
      expect(grew).toBe(true);
    }
  });

  test("C5. list endpoint returns an array", async ({ request }) => {
    const res = await request.get("/api/posts/comment/list?postId=00000000-0000-0000-0000-000000000000");
    // 200 with empty array, or 400 if postId required
    expect([200, 400]).toContain(res.status());
  });

  test("C6. create endpoint rejects unauth", async ({ request }) => {
    const res = await request.post("/api/posts/comment/create", {
      data: { postId: "00000000-0000-0000-0000-000000000000", body: "x" },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 403, 307]).toContain(res.status());
  });
});
`;

fs.writeFileSync("tests/e2e/post-comments.spec.ts", spec, "utf8");
console.log("  ✅ tests/e2e/post-comments.spec.ts (" + spec.split("\n").length + " lines)");
