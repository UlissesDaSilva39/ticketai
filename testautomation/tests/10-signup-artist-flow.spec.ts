import { test, expect } from "@playwright/test";

test.describe("Signup flow — artist option", () => {
  test("artist radio appears and is selectable", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /create one/i }).click();
    const artistRadio = page.getByRole("radio", { name: /register as an artist/i });
    await expect(artistRadio).toBeVisible();
    await artistRadio.check();
    await expect(artistRadio).toBeChecked();
  });
});
