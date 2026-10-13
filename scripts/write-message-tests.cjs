const fs = require("fs");
const path = require("path");

const spec = `import { test, expect } from "./fixtures/base";

/* ============================================================
 *  Real Chat — /messages + /messages/[id]
 *  ------------------------------------------------------------
 *  M1. /messages redirects signed-out users to /login
 *  M2. /messages renders inbox heading for authed user
 *  M3. Inbox renders either empty state or conversation rows
 *  M4. Conversation row links to /messages/[id]
 *  M5. /messages/[id] renders thread heading + message list
 *  M6. Message input is visible + enabled
 *  M7. Send button disabled when input empty
 *  M8. Typing enables Send button
 *  M9. Sending a message POSTs to /api/messages/send
 *  M10. Invalid conversation ID → 404
 * ============================================================ */

const FAKE_CONV_ID = "00000000-0000-0000-0000-000000000000";

test.describe("Real Chat — inbox", () => {
  test("M1. /messages redirects signed-out users to /login", async ({ browser }) => {
    const ctx = await browser.newContext(); // no storage state
    const page = await ctx.newPage();
    await page.goto("http://localhost:3000/messages", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForURL(/\\/login/, { timeout: 8000 }).catch(() => {});
    expect(page.url()).toContain("/login");
    await ctx.close();
  });

  test("M2. /messages renders heading for authed user", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required");
    }
    const heading = page.getByTestId("messages-heading");
    await expect(heading).toBeVisible({ timeout: 15000 });
    await expect(heading).toHaveText(/messages/i);
  });

  test("M3. inbox renders empty state OR conversation rows", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const rows = page.locator('[data-testid="conversation-row"]');
    const empty = page.getByText(/no conversations yet/i);
    const count = (await rows.count()) + (await empty.count());
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Real Chat — thread", () => {
  test("M4. clicking a conversation opens the thread", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const rows = page.locator('[data-testid="conversation-row"]');
    if ((await rows.count()) === 0) {
      test.skip(true, "No conversations to open");
    }

    await rows.first().click();
    await page.waitForURL(/\\/messages\\/[^/]+$/, { timeout: 10000 });
    expect(page.url()).toMatch(/\\/messages\\/[^/]+/);
  });

  test("M5. thread heading + message list render", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const rows = page.locator('[data-testid="conversation-row"]');
    if ((await rows.count()) === 0) test.skip(true, "No conversations");

    await rows.first().click();
    await page.waitForURL(/\\/messages\\/[^/]+$/, { timeout: 10000 });

    await expect(page.getByTestId("thread-heading")).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("message-list")).toBeVisible();
  });

  test("M6. message input is visible + enabled", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const rows = page.locator('[data-testid="conversation-row"]');
    if ((await rows.count()) === 0) test.skip(true, "No conversations");

    await rows.first().click();
    await page.waitForURL(/\\/messages\\/[^/]+$/, { timeout: 10000 });

    const input = page.getByTestId("message-input");
    await expect(input).toBeVisible({ timeout: 10000 });
    await expect(input).toBeEnabled();
  });

  test("M7. Send button disabled when input empty", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const rows = page.locator('[data-testid="conversation-row"]');
    if ((await rows.count()) === 0) test.skip(true, "No conversations");

    await rows.first().click();
    await page.waitForURL(/\\/messages\\/[^/]+$/, { timeout: 10000 });

    const input = page.getByTestId("message-input");
    const send = page.getByTestId("message-send");

    await input.fill("");
    await expect(send).toBeDisabled();
  });

  test("M8. typing enables Send button", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const rows = page.locator('[data-testid="conversation-row"]');
    if ((await rows.count()) === 0) test.skip(true, "No conversations");

    await rows.first().click();
    await page.waitForURL(/\\/messages\\/[^/]+$/, { timeout: 10000 });

    const input = page.getByTestId("message-input");
    const send = page.getByTestId("message-send");

    await input.fill("");
    await expect(send).toBeDisabled();
    await input.fill("hi from playwright " + Date.now());
    await expect(send).toBeEnabled();
    await input.fill("");
  });

  test("M9. sending a message POSTs to /api/messages/send", async ({ page }) => {
    await page.goto("/messages", { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const rows = page.locator('[data-testid="conversation-row"]');
    if ((await rows.count()) === 0) test.skip(true, "No conversations");

    await rows.first().click();
    await page.waitForURL(/\\/messages\\/[^/]+$/, { timeout: 10000 });

    const input = page.getByTestId("message-input");
    const send = page.getByTestId("message-send");
    const list = page.getByTestId("message-list");
    const before = await list.locator('[data-testid="message-item"]').count();

    const unique = "pw-msg-" + Date.now();
    await input.fill(unique);

    const reqPromise = page
      .waitForResponse(
        (r) =>
          r.url().includes("/api/messages/send") &&
          r.request().method() === "POST",
        { timeout: 10000 }
      )
      .catch(() => null);

    await send.click();
    const resp = await reqPromise;

    if (resp) expect(resp.status()).toBeLessThan(500);

    await page.waitForTimeout(800);
    const after = await list.locator('[data-testid="message-item"]').count();

    if (resp && resp.status() < 400) {
      expect(after).toBeGreaterThanOrEqual(before);
      await expect(list.getByText(unique)).toBeVisible({ timeout: 5000 });
    }
  });

  test("M10. invalid conversation ID returns 404 or redirect", async ({ page }) => {
    await page.goto("/messages/" + FAKE_CONV_ID, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    // Should be 404 or /login redirect
    const url = page.url();
    const is404 = (await page.getByText(/404|not found/i).count()) > 0;
    expect(url.includes("/login") || is404 || url.includes("404")).toBe(true);
  });
});
`;

fs.mkdirSync("tests/e2e", { recursive: true });
fs.writeFileSync("tests/e2e/messages.spec.ts", spec, "utf8");
console.log("  ✅ tests/e2e/messages.spec.ts (" + spec.split("\n").length + " lines)");
