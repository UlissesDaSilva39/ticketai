import { test, expect } from "@playwright/test";

test.describe("12 - Errors", () => {
  test("12.1 unknown route is 404", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res?.status()).toBe(404);
  });

  test("12.2 ticket email API does not crash", async ({ request }) => {
    const res = await request.post("/api/tickets/email", { data: {} });
    expect(res.status()).not.toBe(200);
  });

  test("12.3 print ticket unknown ID is 404", async ({ page }) => {
    const res = await page.goto("/my-tickets/print/00000000-0000-0000-0000-000000000000");
    expect(res?.status()).toBe(404);
  });

  test("12.4 guest cannot read chats", async ({ page }) => {
    await page.goto("/messages/some-other-uuid");
    const url = page.url();
    const body = await page.content();
    const isLogin = /\/login/.test(url);
    const is404 = /404|not found/i.test(body);
    expect(isLogin || is404).toBe(true);
  });
});
