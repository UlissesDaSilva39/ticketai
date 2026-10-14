import { test, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const TEST_EMAIL = process.env.TEST_USER_EMAIL || "alex@grid.test";
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "AlexPass123!";

const FIXTURE_PNG = path.join(__dirname, "fixtures", "tiny.png");
const FIXTURE_MP3 = path.join(__dirname, "fixtures", "tiny.mp3");

// Sanity: fixtures must exist
test.beforeAll(() => {
  if (!fs.existsSync(FIXTURE_PNG)) throw new Error("missing " + FIXTURE_PNG);
  if (!fs.existsSync(FIXTURE_MP3)) throw new Error("missing " + FIXTURE_MP3);
});

async function logIn(page: Page) {
  await page.goto(`${BASE}/login`);
  await page.waitForLoadState("networkidle");

  // Try common selectors for email + password
  const emailInput = page
    .locator('input[type="email"], input[name="email"]')
    .first();
  const pwInput = page
    .locator('input[type="password"], input[name="password"]')
    .first();

  await emailInput.waitFor({ state: "visible", timeout: 10_000 });
  await emailInput.fill(TEST_EMAIL);
  await pwInput.fill(TEST_PASSWORD);

  // Click submit
  const submit = page
    .getByRole("button", { name: /log in|sign in|continue/i })
    .first();
  await submit.click();

  // Wait for navigation away from /login
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
    timeout: 20_000,
  });
  await page.waitForLoadState("networkidle");
}

test.describe("Artist edit page — /artist/[slug]/edit", () => {
  test("renders for anonymous visitor (login prompt)", async ({ page }) => {
    await page.goto(`${BASE}/artist/alexmorgan/edit`);
    await page.waitForLoadState("networkidle");

    // Either renders the login prompt OR the edit form — but never 404
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("This page could not be found");

    // Either a Log in link/button or the upload form
    const hasLoginCTA = /log in|sign in/i.test(bodyText);
    const hasEditHeading = /edit/i.test(bodyText);
    expect(hasLoginCTA || hasEditHeading).toBeTruthy();
  });

  test("renders for owner with upload form", async ({ page }) => {
    await logIn(page);
    await page.goto(`${BASE}/artist/alexmorgan/edit`);
    await page.waitForLoadState("networkidle");

    // Should NOT be a 404
    await expect(page.locator("text=This page could not be found")).toHaveCount(0);

    // Should show the edit header
    const heading = page.getByRole("heading", { name: /edit/i }).first();
    await expect(heading).toBeVisible();

    // Should show the "Add a new track" section
    const addTrackHeading = page.getByRole("heading", { name: /add a new track/i }).first();
    await expect(addTrackHeading).toBeVisible();

    // Should show the upload form fields
    await expect(page.getByPlaceholder("Track title")).toBeVisible();
    await expect(page.getByPlaceholder("Artist name")).toBeVisible();

    // Should show the file pick buttons
    await expect(page.getByRole("button", { name: /audio.*choose/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /cover.*choose/i }).first()).toBeVisible();

    // Publish button
    await expect(page.getByRole("button", { name: /publish track/i })).toBeVisible();
  });

  test("uploads a track successfully", async ({ page }) => {
    await logIn(page);
    await page.goto(`${BASE}/artist/alexmorgan/edit`);
    await page.waitForLoadState("networkidle");

    const uniqueTitle = "PW Test Track " + Date.now();

    // Fill the form
    await page.getByPlaceholder("Track title").fill(uniqueTitle);
    await page.getByPlaceholder("Artist name").fill("Alex Morgan");

    // Attach audio file (input is hidden, use setInputFiles directly)
    const fileInputs = await page.locator('input[type="file"]').all();
    let attached = false;
    for (const inp of fileInputs) {
      const accept = (await inp.getAttribute("accept")) || "";
      if (accept.includes("audio")) {
        await inp.setInputFiles(FIXTURE_MP3);
        attached = true;
        break;
      }
    }
    expect(attached).toBe(true);

    // Wait for chip to say "ready"
    await expect(
      page.getByRole("button", { name: /audio.*ready/i }).first()
    ).toBeVisible({ timeout: 15_000 });

    // Optional: attach cover
    for (const inp of fileInputs) {
      const accept = (await inp.getAttribute("accept")) || "";
      if (accept.includes("image")) {
        await inp.setInputFiles(FIXTURE_PNG);
        break;
      }
    }

    // Publish
    const publishBtn = page.getByRole("button", { name: /publish track/i });
    await publishBtn.click();

    // Wait for the new track to appear in the list OR the form to reset
    // Either the title shows up in the DOM, or the input clears
    await page.waitForTimeout(3000);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain(uniqueTitle);
  });
});

test.describe("Artist public profile — /artists/[username]", () => {
  test("renders with track count and Play all button", async ({ page }) => {
    await page.goto(`${BASE}/artists/alexmorgan`);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("text=This page could not be found")).toHaveCount(0);

    // Header
    await expect(page.getByRole("heading", { name: /alex morgan/i }).first()).toBeVisible();

    // Play all button
    await expect(page.getByRole("button", { name: /play all/i }).first()).toBeVisible();

    // At least one track row's play chip
    const chips = page.locator('button[aria-label="Play"]');
    await expect(chips.first()).toBeVisible({ timeout: 15_000 });
  });

  test("shows Edit profile button when logged in as owner", async ({ page }) => {
    await logIn(page);
    await page.goto(`${BASE}/artists/alexmorgan`);
    await page.waitForLoadState("networkidle");

    // Owner UI
    const editBtn = page.getByRole("link", { name: /edit profile/i }).first();
    await expect(editBtn).toBeVisible({ timeout: 10_000 });

    // You badge
    const youBadge = page.getByText(/^You$/).first();
    await expect(youBadge).toBeVisible();
  });
});

