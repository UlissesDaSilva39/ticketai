import { test, expect } from "./fixtures/base";

test.describe("/home accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
  });

  test("composer textarea has an accessible name", async ({ page }) => {
    const textbox = page.getByRole("textbox").first();
    const ariaLabel = await textbox.getAttribute("aria-label");
    const ariaLabelledBy = await textbox.getAttribute("aria-labelledby");
    const placeholder = await textbox.getAttribute("placeholder");
    const hasRealLabel = Boolean(ariaLabel || ariaLabelledBy);
    expect(
      hasRealLabel,
      `Composer relies only on placeholder ("${placeholder}"). Add aria-label or <label>.`
    ).toBe(true);
  });

  test("avatar/profile link has accessible name", async ({ page }) => {
    const link = page.getByRole("link", { name: /^u$/i })
      .or(page.locator('a[href*="/profile"]')).first();
    if ((await link.count()) === 0) test.skip();
    const name = await link.getAttribute("aria-label");
    const text = (await link.innerText().catch(() => ""))?.trim();
    expect(
      Boolean(name && name.length > 1) || (text && text.length > 1),
      `Avatar link text="${text}" aria-label="${name}" — too short.`
    ).toBe(true);
  });
});
