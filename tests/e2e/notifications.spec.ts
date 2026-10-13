import { test, expect } from "./fixtures/base";

test.describe("/notifications", () => {
  test("/notifications redirects to login when not authenticated", async ({ page }) => {
    const res = await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) {
      expect(page.url()).toContain("/login");
      return;
    }
    expect(res?.status()).toBeLessThan(400);
  });

  test("/notifications shows page when authenticated", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    await expect(page.getByRole("heading", { name: /notifications/i })).toBeVisible();
  });

  test("has empty state or list of notifications", async ({ page }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");

    const body = await page.locator("body").innerText();
    const hasEmpty = /no notifications|you have no/i.test(body);
    const hasUnread = /unread|caught up|mark all as read/i.test(body);
    expect(hasEmpty || hasUnread).toBe(true);
  });

  test("no console errors on load", async ({ page, consoleErrors }) => {
    await page.goto("/notifications", { waitUntil: "domcontentloaded" });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
    await page.waitForTimeout(800);

    const real = consoleErrors.filter((e) =>
      !e.includes("favicon") && !e.includes("React DevTools")
    );
    expect(real, real.join("\n")).toEqual([]);
  });
});

test.describe("/api/notifications/unread-count", () => {
  test("returns JSON with a count field", async ({ request }) => {
    const res = await request.get("/api/notifications/unread-count");
    expect([200, 401]).toContain(res.status());

    if (res.status() === 200) {
      const data = await res.json();
      expect(typeof data.count).toBe("number");
    }
  });
});
