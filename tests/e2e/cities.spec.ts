import { test, expect } from "@playwright/test";

const CITIES = [
  "london", "manchester", "birmingham", "bristol", "brighton", "leeds", "glasgow",
  "paris", "berlin", "amsterdam", "barcelona", "dublin",
  "new-york", "los-angeles", "chicago", "miami", "san-francisco",
  "toronto", "montreal", "calgary", "vancouver",
  "sydney", "melbourne", "brisbane", "perth",
];

test.describe("city landing pages", () => {
  for (const city of CITIES) {
    test(`/${city} renders and shows city name`, async ({ page }) => {
      const res = await page.goto("/" + city, { waitUntil: "domcontentloaded", timeout: 15000 });
      expect(res?.status()).toBeLessThan(400);

      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toBeVisible();

      const body = await page.locator("body").innerText();
      expect(body.toLowerCase()).toContain(city.replace(/-/g, " ").split(" ")[0]);
    });
  }
});
