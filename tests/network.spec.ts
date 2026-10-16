import { test, expect, Page } from "@playwright/test";

/* ============================================================
 *  Network page - Follow buttons
 *  Regression guard for the mobile nav overlap bug.
 * ============================================================ */

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

async function gotoNetwork(page: Page) {
  await page.goto(`${BASE}/network`, { waitUntil: "domcontentloaded", timeout: 30000 });
  if (page.url().includes("/login")) {
    test.skip(true, "Auth required");
  }
}

// ------------------------------------------------------------
// 1. Page renders with the expected structure
// ------------------------------------------------------------
test.describe("Network - page structure", () => {
  test("1.1 loads with the Network heading", async ({ page }) => {
    await gotoNetwork(page);
    await expect(page.getByRole("heading", { name: /^Network$/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test("1.2 subtitle is visible", async ({ page }) => {
    await gotoNetwork(page);
    await expect(page.getByText(/connect with the people building music/i)).toBeVisible();
  });

  test("1.3 search bar is present", async ({ page }) => {
    await gotoNetwork(page);
    await expect(page.getByPlaceholder(/search artists, djs, producers/i)).toBeVisible();
  });

  test("1.4 role filter pills render", async ({ page }) => {
    await gotoNetwork(page);
    await expect(page.getByRole("link", { name: /^Everyone$/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Artists$/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /^A&R$/ })).toBeVisible();
  });

  test("1.5 at least one PersonCard is rendered", async ({ page }) => {
    await gotoNetwork(page);
    const viewProfileLinks = page.getByRole("link", { name: /view profile/i });
    expect(await viewProfileLinks.count()).toBeGreaterThan(0);
  });
});

// ------------------------------------------------------------
// 2. Follow button - visible + clickable
// ------------------------------------------------------------
test.describe("Network - Follow button", () => {
  test("2.1 Follow button is visible on the first card", async ({ page }) => {
    await gotoNetwork(page);
    const followBtn = page.getByRole("button", { name: /^\+?\s*(follow|following)/i }).first();
    await expect(followBtn).toBeVisible({ timeout: 15000 });
  });

  test("2.2 Follow button is enabled", async ({ page }) => {
    await gotoNetwork(page);
    const followBtn = page.getByRole("button", { name: /^\+?\s*follow$/i }).first();
    if ((await followBtn.count()) === 0) {
      const following = page.getByRole("button", { name: /following/i }).first();
      await expect(following).toBeEnabled();
      return;
    }
    await expect(followBtn).toBeEnabled();
  });

  test("2.3 Follow button is the topmost element at its own position", async ({ page }) => {
    await gotoNetwork(page);
    const followBtn = page.getByRole("button", { name: /^\+?\s*(follow|following)/i }).first();
    await expect(followBtn).toBeVisible({ timeout: 15000 });

    const box = await followBtn.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const isTopmost = await page.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        if (!el) return false;
        let n: Element | null = el;
        while (n) {
          if (n.tagName === "BUTTON") return true;
          n = n.parentElement;
        }
        return false;
      },
      { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    );

    expect(isTopmost, "Follow button is covered by another element").toBe(true);
  });

  test("2.4 Clicking Follow does NOT navigate away from /network", async ({ page }) => {
    await gotoNetwork(page);
    const followBtn = page.getByRole("button", { name: /^\+?\s*(follow|following)/i }).first();
    await expect(followBtn).toBeVisible({ timeout: 15000 });

    await followBtn.click();
    await page.waitForTimeout(1500);

    expect(page.url()).toContain("/network");
    expect(page.url()).not.toContain("/inbox");
    expect(page.url()).not.toContain("/messages");
  });

  test("2.5 Clicking Follow toggles the button label", async ({ page }) => {
    await gotoNetwork(page);
    const followBtn = page.getByRole("button", { name: /^\+?\s*follow$/i }).first();
    if ((await followBtn.count()) === 0) {
      test.skip(true, "No un-followed users visible");
      return;
    }

    const before = (await followBtn.innerText()).trim();
    await followBtn.click();
    await page.waitForTimeout(1500);
    const after = (await followBtn.innerText()).trim();

    expect(after).not.toBe(before);
  });
});

// ------------------------------------------------------------
// 3. Mobile nav overlap guard (narrow viewport)
// ------------------------------------------------------------
test.describe("Network - narrow viewport (mobile nav overlap guard)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("3.1 mobile nav is rendered at narrow width", async ({ page }) => {
    await gotoNetwork(page);
    const inboxLink = page.getByRole("link", { name: /^Inbox$/ });
    await expect(inboxLink).toBeVisible();
  });

  test("3.2 the last Follow button is not underneath the mobile nav", async ({ page }) => {
    await gotoNetwork(page);

    const followBtns = page.getByRole("button", { name: /^\+?\s*(follow|following)/i });
    const count = await followBtns.count();
    if (count === 0) {
      test.skip(true, "No Follow buttons on page");
      return;
    }
    const lastBtn = followBtns.nth(count - 1);

    await lastBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const box = await lastBtn.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const viewportHeight = page.viewportSize()?.height ?? 844;
    const navTop = viewportHeight - 56;

    const btnBottom = box.y + box.height;
    expect(
      btnBottom,
      `Follow button bottom (${btnBottom}) overlaps mobile nav top (${navTop})`
    ).toBeLessThanOrEqual(navTop);
  });

  test("3.3 clicking the last Follow button on mobile doesn't navigate to /inbox", async ({ page }) => {
    await gotoNetwork(page);

    const followBtns = page.getByRole("button", { name: /^\+?\s*(follow|following)/i });
    const count = await followBtns.count();
    if (count === 0) {
      test.skip(true, "No Follow buttons on page");
      return;
    }

    const lastBtn = followBtns.nth(count - 1);
    await lastBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await lastBtn.click();
    await page.waitForTimeout(1500);

    expect(page.url()).toContain("/network");
    expect(page.url()).not.toContain("/inbox");
  });
});

// ------------------------------------------------------------
// 4. Mobile nav link destinations
// ------------------------------------------------------------
test.describe("Mobile nav - link destinations", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("4.1 Inbox link in mobile nav points to /inbox", async ({ page }) => {
    await gotoNetwork(page);
    const inboxLink = page.getByRole("link", { name: /^Inbox$/ });
    const href = await inboxLink.getAttribute("href");
    expect(href).toBe("/inbox");
  });

  test("4.2 clicking mobile Inbox goes to /inbox", async ({ page }) => {
    await gotoNetwork(page);
    const inboxLink = page.getByRole("link", { name: /^Inbox$/ });
    await inboxLink.click();
    await page.waitForURL(/\/inbox/, { timeout: 8000 });
    expect(page.url()).toContain("/inbox");
  });
});

// ------------------------------------------------------------
// 5. Full-page sanity - no console errors
// ------------------------------------------------------------
test.describe("Network - console hygiene", () => {
  test("5.1 no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));

    await gotoNetwork(page);
    await page.waitForTimeout(1500);

    const real = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("React DevTools") &&
        !e.includes("manifest.webmanifest") &&
        !e.includes("hydration") &&
        !e.includes("katalonextensionid")
    );
    expect(real).toEqual([]);
  });
});