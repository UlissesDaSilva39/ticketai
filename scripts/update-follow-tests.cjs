const fs = require("fs");
const path = require("path");

const file = "tests/e2e/follow-system.spec.ts";
let src = fs.readFileSync(file, "utf8");

// Replace the placeholder venue block with real tests
const oldBlock = /test\.describe\("Follow System — Venue \(placeholder\)"[\s\S]*?\n\}\);\n?/;
const newBlock = `test.describe("Follow System — Venue", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_VENUE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    if (page.url().includes("/login")) {
      test.skip(true, "Auth required — run with the auth fixture");
    }
  });

  test("V1. venue profile loads without redirect", async ({ page }) => {
    expect(page.url()).toContain("/venue/");
  });

  test("V2. venue Follow button exists", async ({ page }) => {
    const button = page
      .getByRole("button", { name: /follow|following/i })
      .first();
    await expect(button).toBeVisible({ timeout: 15000 });
    await expect(button).toBeEnabled();
  });

  test("V3. venue Follow button shows a count", async ({ page }) => {
    const button = page
      .getByRole("button", { name: /follow|following/i })
      .first();
    await expect(button).toBeVisible({ timeout: 15000 });
    const text = await button.innerText();
    expect(/\\d+/.test(text)).toBe(true);
  });

  test("V4. clicking venue Follow toggles state", async ({ page }) => {
    const button = page
      .getByRole("button", { name: /follow|following/i })
      .first();
    await expect(button).toBeVisible({ timeout: 15000 });

    const before = (await button.innerText()).toLowerCase();
    const wasFollowing = before.includes("following");

    await button.click();
    await page.waitForTimeout(800);
    const after = (await button.innerText()).toLowerCase();
    const isFollowing = after.includes("following");

    expect(isFollowing).toBe(!wasFollowing);

    // revert
    await button.click();
    await page.waitForTimeout(500);
  });
});
`;

if (!oldBlock.test(src)) {
  console.error("❌ Could not find placeholder block — file unchanged");
  process.exit(1);
}

src = src.replace(oldBlock, newBlock);
fs.writeFileSync(file, src, "utf8");
console.log("✅ tests/e2e/follow-system.spec.ts updated");
console.log("   Lines now: " + src.split("\\n").length);
