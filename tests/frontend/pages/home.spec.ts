import { test, expect } from "@playwright/test";

test.describe("Frontend - Home Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/home"); });

  test("profile card visible", async ({ page }) => {
    await expect(page.getByText("Ulisses Silva").first()).toBeVisible();
    await expect(page.getByText("Music Producer").first()).toBeVisible();
  });

  test("Play Latest Track toggles", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Pause Track/ }).first()).toBeVisible();
  });

  test("View EPK routes", async ({ page }) => {
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });

  test("Publish disabled when empty", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Publish" })).toBeDisabled();
  });

  test("Publish enabled with text", async ({ page }) => {
    await page.getByPlaceholder(/Share a track/).fill("Test");
    await expect(page.getByRole("button", { name: "Publish" })).toBeEnabled();
  });

  test("Publish shows success", async ({ page }) => {
    await page.getByPlaceholder(/Share a track/).fill("Test");
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText("Success!")).toBeVisible();
  });

  test("Hype increments", async ({ page }) => {
    await page.getByRole("button", { name: /^Hype$/ }).click();
    await expect(page.getByText("Hype (1)")).toBeVisible();
  });

  test("Hype toggles back", async ({ page }) => {
    await page.getByRole("button", { name: /^Hype$/ }).click();
    await page.getByRole("button", { name: /Hype \(1\)/ }).click();
    await expect(page.getByRole("button", { name: /^Hype$/ })).toBeVisible();
  });

  test("Reply modal opens", async ({ page }) => {
    await page.getByRole("button", { name: "Reply" }).click();
    await expect(page.getByText("Reply to Demo Producer")).toBeVisible();
  });

  test("Reply sends", async ({ page }) => {
    await page.getByRole("button", { name: "Reply" }).click();
    await page.getByPlaceholder(/Write your reply/).fill("Nice!");
    await page.getByRole("button", { name: "Send Reply" }).click();
    await expect(page.getByText("Success!")).toBeVisible();
  });

  test("Follow toggles", async ({ page }) => {
    await page.getByRole("button", { name: "Follow" }).first().click();
    await expect(page.getByRole("button", { name: "Following" }).first()).toBeVisible();
  });

  test("Open Collab routes to jobs", async ({ page }) => {
    await page.getByText("Vocalist needed").first().click();
    await page.waitForURL("/jobs");
  });

  test("no hydration errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter(e => e.includes("Hydration"))).toHaveLength(0);
  });

  test("waveform bars render", async ({ page }) => {
    const bars = page.locator(".bg-emerald-500.rounded-full");
    expect(await bars.count()).toBeGreaterThan(10);
  });

  test("sidebar Marketplace routes", async ({ page }) => {
    await page.getByRole("link", { name: "Marketplace" }).click();
    await page.waitForURL("/marketplace");
  });

  test("sidebar Saved Items routes", async ({ page }) => {
    await page.getByRole("link", { name: "Saved Items" }).click();
    await page.waitForURL("/saved");
  });

  test("sidebar Groups routes", async ({ page }) => {
    await page.getByRole("link", { name: "Groups" }).click();
    await page.waitForURL("/groups");
  });

  test("sidebar Events routes", async ({ page }) => {
    await page.getByRole("link", { name: "Events" }).click();
    await page.waitForURL("/events");
  });

  test("sidebar hidden on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator("aside.lg\\:block")).toBeHidden();
  });

  test("3-column layout", async ({ page }) => {
    const columns = page.locator("div.grid-cols-12 > *");
    expect(await columns.count()).toBeGreaterThanOrEqual(3);
  });

  test("Open Collabs visible", async ({ page }) => {
    await expect(page.getByText("Open Collabs")).toBeVisible();
  });

  test("Artists to Follow visible", async ({ page }) => {
    await expect(page.getByText("Artists to Follow")).toBeVisible();
  });

  test("Demo Producer post visible", async ({ page }) => {
    await expect(page.getByText("Demo Producer")).toBeVisible();
  });

  test("post text visible", async ({ page }) => {
    await expect(page.getByText(/Just dropped a new beat/)).toBeVisible();
  });

  test("audio duration 3:45", async ({ page }) => {
    await expect(page.getByText("3:45")).toBeVisible();
  });
});