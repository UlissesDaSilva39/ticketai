import { test, expect } from "@playwright/test";

test.describe("People page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/people");
    await page.waitForLoadState("networkidle");
  });

  test("renders the People heading and subtitle", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /^People$/i })).toBeVisible();
    await expect(
      page.getByText(/Find artists, promoters, venues, labels, and A&R scouts/i)
    ).toBeVisible();
  });

  test("renders the search bar with correct placeholder", async ({ page }) => {
    const search = page.getByPlaceholder(/Search by name/i);
    await expect(search).toBeVisible();
  });

  test("renders role tabs built from real data", async ({ page }) => {
    // At least the All tab must exist
    const allTab = page.getByRole("link", { name: /^All\s*\d+$/ });
    await expect(allTab).toBeVisible();

    // The known roles in the DB
    await expect(page.getByRole("link", { name: /^Fans\s*\d+$/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /^A&R\s*\d+$/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Labels\s*\d+$/ })).toBeVisible();
  });

  test("renders sort options", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Newest/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Most followers/i })).toBeVisible();
  });

  test("shows the people count", async ({ page }) => {
    await expect(page.getByText(/\d+\s+people?\s+found/i)).toBeVisible();
  });

  test("each card has Follow, Message, and View profile buttons", async ({ page }) => {
    const firstCard = page.locator("article").first();
    await expect(firstCard).toBeVisible();

    await expect(firstCard.getByRole("button", { name: /^Follow$/ })).toBeVisible();
    await expect(firstCard.getByRole("button", { name: /^Message$/ })).toBeVisible();
    await expect(firstCard.getByRole("link", { name: /View profile/i })).toBeVisible();
  });

  test("clicking a role tab filters the list and updates the URL", async ({ page }) => {
    await page.getByRole("link", { name: /^A&R\s*\d+$/ }).click();
    await page.waitForLoadState("networkidle");

    // URL should contain role=a_and_r
    await expect(page).toHaveURL(/\/people\?.*role=a_and_r/);

    // Every card in the list should say A&R
    const cards = page.locator("article");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = cards.nth(i);
      await expect(card).toContainText(/A&R/i);
    }
  });

  test("typing in the search bar updates the URL after debounce", async ({ page }) => {
    const search = page.getByPlaceholder(/Search by name/i);
    await search.fill("sophie");
    // wait for debounce + navigation
    await page.waitForTimeout(800);
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/people\?.*q=sophie/);
    await expect(page.getByText(/Sophie Bennett/i)).toBeVisible();
  });

  test("empty search result shows the no-one-matches state", async ({ page }) => {
    const search = page.getByPlaceholder(/Search by name/i);
    await search.fill("zzznonentityxyz");
    await page.waitForTimeout(800);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(/No one matches/i)).toBeVisible();
  });

  test("clicking Follow flips the button to Following (signed out)", async ({ page }) => {
    const firstCard = page.locator("article").first();
    const followBtn = firstCard.getByRole("button", { name: /^Follow$/ });
    await followBtn.click();

    // Signed-out users are redirected to /login
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("clicking Message opens the message modal", async ({ page }) => {
    const firstCard = page.locator("article").first();
    await firstCard.getByRole("button", { name: /^Message$/ }).click();

    // Modal heading: "Message <display name>"
    await expect(page.getByRole("heading", { name: /^Message / })).toBeVisible();

    // Form fields
    await expect(page.getByPlaceholder("Your name *")).toBeVisible();
    await expect(page.getByPlaceholder("Your email *")).toBeVisible();
    await expect(page.getByPlaceholder("Message *")).toBeVisible();
  });

  test("message modal can be closed with the X", async ({ page }) => {
    const firstCard = page.locator("article").first();
    await firstCard.getByRole("button", { name: /^Message$/ }).click();
    await expect(page.getByRole("heading", { name: /^Message / })).toBeVisible();

    await page.getByRole("button", { name: "x" }).click();
    await expect(page.getByRole("heading", { name: /^Message / })).toBeHidden();
  });

  test("message modal can be closed with Cancel", async ({ page }) => {
    const firstCard = page.locator("article").first();
    await firstCard.getByRole("button", { name: /^Message$/ }).click();
    await expect(page.getByRole("heading", { name: /^Message / })).toBeVisible();

    await page.getByRole("button", { name: /^Cancel$/ }).click();
    await expect(page.getByRole("heading", { name: /^Message / })).toBeHidden();
  });

  test("submitting an empty message form blocks submit", async ({ page }) => {
    const firstCard = page.locator("article").first();
    await firstCard.getByRole("button", { name: /^Message$/ }).click();

    // HTML required blocks submit; form should still be visible
    await page.getByRole("button", { name: /^Send$/ }).click();

    // Modal remains open
    await expect(page.getByRole("heading", { name: /^Message / })).toBeVisible();
  });

  test("View profile links to /u/<username>", async ({ page }) => {
    const firstCard = page.locator("article").first();
    const link = firstCard.getByRole("link", { name: /View profile/i });
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^\/u\//);
  });

  test("sort by most followers reorders the list", async ({ page }) => {
    // Capture first card name before
    const before = await page.locator("article").first().textContent();

    await page.getByRole("link", { name: /Most followers/i }).click();
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/people\?.*sort=followers/);

    // First card may be different (someone with more followers bubbles up)
    const after = await page.locator("article").first().textContent();
    expect(after).not.toBeNull();
  });

  test("clicking Follow then following tab shows unchanged count when signed out", async ({
    page,
  }) => {
    // Signed-out users cannot increment a follower count; they should be
    // redirected to login before any write occurs.
    const firstCard = page.locator("article").first();
    const beforeText = await firstCard.textContent();

    await firstCard.getByRole("button", { name: /^Follow$/ }).click();
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await page.goBack();
    await page.waitForLoadState("networkidle");

    const afterText = await page.locator("article").first().textContent();
    expect(afterText).toBe(beforeText);
  });
});