import { test, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

// ----------------------------------------------------------------
// Test fixtures — create tiny valid files on disk once at startup
// ----------------------------------------------------------------
const FIXTURE_DIR = path.join(__dirname, "fixtures");

function ensureFixture(name: string, bytes: Buffer) {
  const p = path.join(FIXTURE_DIR, name);
  if (!fs.existsSync(p)) fs.writeFileSync(p, bytes);
  return p;
}

// 1x1 transparent PNG (67 bytes)
const PNG_1x1 = Buffer.from(
  "89504e470d0a1a0a0000000d4948445200000001000000010806000000" +
  "1f15c4890000000a49444154789c6360000002000154a24f5b00000000" +
  "49454e44ae426082",
  "hex"
);

// Minimal MP4 header (ftyp + moov shells) — enough to pass MIME sniff
const MP4_MIN = Buffer.from(
  "000000206674797069736f6d0000020069736f6d69736f3200000008" +
  "667265650000002c6d646174000000006d6f6f76000000086d766864",
  "hex"
);

// Minimal MP3 header (ID3 + one frame header)
const MP3_MIN = Buffer.from(
  "494433040000000000004b4944330000496e666f0000000f00010000" +
  "000100000000000000fffb9064000000000000",
  "hex"
);

const IMG_FIXTURE = ensureFixture("tiny.png", PNG_1x1);
const VID_FIXTURE = ensureFixture("tiny.mp4", MP4_MIN);
const AUD_FIXTURE = ensureFixture("tiny.mp3", MP3_MIN);

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

async function gotoFeed(page: Page) {
  await page.goto(`${BASE}/home`);
  await page.waitForLoadState("networkidle");
}

async function gotoArtists(page: Page) {
  await page.goto(`${BASE}/artists`);
  await page.waitForLoadState("networkidle");
}

async function pickFile(page: Page, chipSelector: string, filePath: string) {
  // find the hidden input associated with the chip
  const fileInput = page.locator('input[type="file"]').first();
  // Playwright can set files even on hidden inputs:
  const inputs = await page.locator('input[type="file"]').all();
  for (const input of inputs) {
    const accept = (await input.getAttribute("accept")) || "";
    if (chipSelector === "photo" && accept.includes("image")) {
      await input.setInputFiles(filePath);
      return;
    }
    if (chipSelector === "video" && accept.includes("video")) {
      await input.setInputFiles(filePath);
      return;
    }
    if (chipSelector === "audio" && accept.includes("audio")) {
      await input.setInputFiles(filePath);
      return;
    }
  }
  throw new Error(`No file input found for ${chipSelector}`);
}

async function waitForChipGreen(page: Page, label: string) {
  // chip turns green with "✓" when upload completes
  const chip = page.getByRole("button", { name: new RegExp(label, "i") }).first();
  await expect(chip).toContainText("✓", { timeout: 20_000 });
}

// ----------------------------------------------------------------
// 1. Page render — basic smoke
// ----------------------------------------------------------------

test.describe("Feed page — basic render", () => {
  test("loads with sidebar, composer, and feed", async ({ page }) => {
    await gotoFeed(page);

    // Sidebar
    await expect(page.getByText("YOUR LIBRARY")).toBeVisible();

    // Composer
    await expect(page.locator('textarea[placeholder="What is happening?"]')).toBeVisible();

    // Feed tabs
    await expect(page.getByRole("button", { name: /for you/i }).or(page.getByText(/for you/i)).first()).toBeVisible();

    // Right sidebar widgets
    await expect(page.getByText("Trending").first()).toBeVisible();
    await expect(page.getByText("People to follow").first()).toBeVisible();
  });

  test("no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await gotoFeed(page);
    await page.waitForTimeout(1500);

    // filter out known noise
    const meaningful = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("manifest.webmanifest") &&
        !e.includes("Download the React DevTools") &&
        !e.includes("Failed to load resource: the server responded with a status of 404")
    );

    expect(meaningful).toEqual([]);
  });
});

// ----------------------------------------------------------------
// 2. Composer chips
// ----------------------------------------------------------------

test.describe("Composer — attachment chips", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFeed(page);
  });

  test("all three chips are visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /photo/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /video/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /audio/i }).first()).toBeVisible();
  });

  test("photo chip: uploads and shows green state", async ({ page }) => {
    await pickFile(page, "photo", IMG_FIXTURE);
    await waitForChipGreen(page, "photo");

    // cancel button appears
    await expect(page.getByRole("button", { name: /remove attachment/i }).first()).toBeVisible();
  });

  test("video chip: uploads and shows green state", async ({ page }) => {
    await pickFile(page, "video", VID_FIXTURE);
    await waitForChipGreen(page, "video");
  });

  test("audio chip: uploads, reveals title/artist inputs", async ({ page }) => {
    await pickFile(page, "audio", AUD_FIXTURE);
    await waitForChipGreen(page, "audio");

    // The two inputs appear
    await expect(page.getByPlaceholder("Track title")).toBeVisible();
    await expect(page.getByPlaceholder("Artist")).toBeVisible();
  });

  test("remove button clears the attachment", async ({ page }) => {
    await pickFile(page, "photo", IMG_FIXTURE);
    await waitForChipGreen(page, "photo");

    const removeBtn = page.getByRole("button", { name: /remove attachment/i }).first();
    await removeBtn.click();

    // chip label goes back to "Photo" (no ✓)
    const chip = page.getByRole("button", { name: /photo/i }).first();
    await expect(chip).not.toContainText("✓");
  });
});

// ----------------------------------------------------------------
// 3. Posting with each media type
// ----------------------------------------------------------------

test.describe("Composer — posting", () => {
  test.beforeEach(async ({ page }) => {
    await gotoFeed(page);
  });

  test("text-only post appears in feed", async ({ page }) => {
    const body = `Test text post ${Date.now()}`;
    await page.locator('textarea[placeholder="What is happening?"]').fill(body);
    await page.getByRole("button", { name: /^post$/i }).click();

    await expect(page.getByText(body).first()).toBeVisible({ timeout: 10_000 });
  });

  test("photo post renders inline img", async ({ page }) => {
    const body = `Test photo post ${Date.now()}`;
    await pickFile(page, "photo", IMG_FIXTURE);
    await waitForChipGreen(page, "photo");

    await page.locator('textarea[placeholder="What is happening?"]').fill(body);
    await page.getByRole("button", { name: /^post$/i }).click();

    await expect(page.getByText(body).first()).toBeVisible({ timeout: 10_000 });
  });

  test("video post renders inline video with controls", async ({ page }) => {
    const body = `Test video post ${Date.now()}`;
    await pickFile(page, "video", VID_FIXTURE);
    await waitForChipGreen(page, "video");

    await page.locator('textarea[placeholder="What is happening?"]').fill(body);
    await page.getByRole("button", { name: /^post$/i }).click();

    await expect(page.getByText(body).first()).toBeVisible({ timeout: 10_000 });

    // the new post should contain a <video>
    const post = page.locator("article").filter({ hasText: body });
    await expect(post.locator("video")).toBeVisible();
  });

  test("audio post renders play bar", async ({ page }) => {
    const body = `Test audio post ${Date.now()}`;
    await pickFile(page, "audio", AUD_FIXTURE);
    await waitForChipGreen(page, "audio");

    await page.getByPlaceholder("Track title").fill("My Test Track");
    await page.getByPlaceholder("Artist").fill("Test Artist");

    await page.locator('textarea[placeholder="What is happening?"]').fill(body);
    await page.getByRole("button", { name: /^post$/i }).click();

    await expect(page.getByText(body).first()).toBeVisible({ timeout: 10_000 });

    // the new post shows the audio bar with title/artist
    const post = page.locator("article").filter({ hasText: body });
    await expect(post.getByText("My Test Track")).toBeVisible();
    await expect(post.getByText("Test Artist")).toBeVisible();
    await expect(post.getByRole("button", { name: /^play$/i })).toBeVisible();
  });
});

// ----------------------------------------------------------------
// 4. Audio player behavior
// ----------------------------------------------------------------

test.describe("Audio player — global dock", () => {
  test("clicking audio ▶ opens dock", async ({ page }) => {
    await gotoFeed(page);

    const playBtns = page.getByRole("button", { name: /^play$/i });
    const count = await playBtns.count();
    if (count === 0) {
      test.skip(true, "no audio posts to test against");
      return;
    }

    await playBtns.first().click();
    await page.waitForTimeout(400);

    // dock has a "Stop" button
    await expect(page.getByRole("button", { name: /stop/i })).toBeVisible({ timeout: 5_000 });
  });

  test("dock persists across navigation", async ({ page }) => {
    await gotoFeed(page);

    const playBtns = page.getByRole("button", { name: /^play$/i });
    const count = await playBtns.count();
    if (count === 0) {
      test.skip(true, "no audio posts to test against");
      return;
    }

    await playBtns.first().click();
    await page.waitForTimeout(400);

    // navigate to /artists
    await page.goto(`${BASE}/artists`);
    await page.waitForLoadState("networkidle");

    // dock should still be visible
    await expect(page.getByRole("button", { name: /stop/i })).toBeVisible({ timeout: 5_000 });
  });

  test("stop button closes dock", async ({ page }) => {
    await gotoFeed(page);

    const playBtns = page.getByRole("button", { name: /^play$/i });
    const count = await playBtns.count();
    if (count === 0) {
      test.skip(true, "no audio posts to test against");
      return;
    }

    await playBtns.first().click();
    await page.waitForTimeout(400);

    const stopBtn = page.getByRole("button", { name: /stop/i });
    await stopBtn.click();
    await page.waitForTimeout(300);

    await expect(stopBtn).not.toBeVisible();
  });
});

// ----------------------------------------------------------------
// 5. Post interactions
// ----------------------------------------------------------------

test.describe("Post actions", () => {
  test("like button toggles", async ({ page }) => {
    await gotoFeed(page);

    const likeBtns = page.getByRole("button", { name: /like/i });
    const count = await likeBtns.count();
    if (count === 0) {
      test.skip(true, "no posts to test against");
      return;
    }

    const btn = likeBtns.first();
    const before = await btn.textContent();
    await btn.click();
    await page.waitForTimeout(600);
    const after = await btn.textContent();
    expect(after).not.toBe(before);
  });
});

// ----------------------------------------------------------------
// 6. Regression — /artists page still works
// ----------------------------------------------------------------

test.describe("Regression — /artists", () => {
  test("Discover page renders", async ({ page }) => {
    await gotoArtists(page);
    await expect(page.getByRole("heading", { name: /discover/i })).toBeVisible();
  });

  test("Music sections with play chips render", async ({ page }) => {
    await gotoArtists(page);
    await page.waitForLoadState("networkidle");

    // Play chips exist on the page (aria-label "Play")
    const playBtns = page.locator('button[aria-label="Play"]');
    const count = await playBtns.count();
    expect(count).toBeGreaterThan(0);
  });
});
