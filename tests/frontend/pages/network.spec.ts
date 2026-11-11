import { test, expect } from "@playwright/test";

test.describe("Frontend - Network Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/network"); });

  test("Discover GRID heading", async ({ page }) => {
    await expect(page.getByText("Discover GRID")).toBeVisible();
  });

  test("all tabs visible", async ({ page }) => {
    for (const t of ["Discover", "People", "Groups", "Gigs"]) {
      await expect(page.getByRole("button", { name: t, exact: true })).toBeVisible();
    }
  });

  test("Discover tab active", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Discover", exact: true })).toHaveClass(/bg-emerald-600/);
  });

  test("Click People tab", async ({ page }) => {
    await page.getByRole("button", { name: "People", exact: true }).click();
    await expect(page.getByRole("button", { name: "People", exact: true })).toHaveClass(/bg-emerald-600/);
  });

  test("Connect toggles to Connected", async ({ page }) => {
    await page.getByRole("button", { name: "Connect" }).first().click();
    await expect(page.getByRole("button", { name: "Connected" }).first()).toBeVisible();
  });

  test("Connected toggles back", async ({ page }) => {
    await page.getByRole("button", { name: "Connect" }).first().click();
    await page.getByRole("button", { name: "Connected" }).first().click();
    await expect(page.getByRole("button", { name: "Connect" }).first()).toBeVisible();
  });

  test("View button routes to jobs", async ({ page }) => {
    await page.getByRole("button", { name: "View" }).first().click();
    await page.waitForURL("/jobs");
  });

  test("Play Latest Track toggles", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Pause Track/ }).first()).toBeVisible();
  });

  test("4 suggested creators", async ({ page }) => {
    for (const name of ["Sarah Jenkins", "David Chen", "The Midnight Collective", "Alex Rivera"]) {
      await expect(page.getByText(name).first()).toBeVisible();
    }
  });

  test("Trending Collabs visible", async ({ page }) => {
    await expect(page.getByText("Trending Collabs")).toBeVisible();
  });

  test("Suggested Creators visible", async ({ page }) => {
    await expect(page.getByText("Suggested Creators")).toBeVisible();
  });

  test("4 new matches badge", async ({ page }) => {
    await expect(page.getByText("4 new matches")).toBeVisible();
  });
});