import { test, expect } from "@playwright/test";

test.describe("10 - Footer", () => {
  const cases = [
    { page: "/", link: "Terms of Service" },
    { page: "/", link: "Privacy Policy" },
    { page: "/", link: "Refund Policy" },
    { page: "/", link: "Contact" },
    { page: "/search", link: "Terms of Service" },
    { page: "/artists", link: "Terms of Service" },
  ];

  for (const { page: p, link } of cases) {
    test(`footer on ${p} has ${link}`, async ({ page }) => {
      await page.goto(p);
      await expect(page.getByRole("link", { name: link }).first()).toBeVisible();
    });
  }

  test("tagline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Discover\. Connect\. Experience\./i).first()).toBeVisible();
  });

  test("copyright", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/2026 TicketAI/).first()).toBeVisible();
  });
});
