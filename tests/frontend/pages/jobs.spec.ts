import { test, expect } from "@playwright/test";

test.describe("Frontend - Jobs Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/jobs"); });

  test("Post a Gig opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Post a Gig" }).click();
    await expect(page.getByText("Post a New Gig")).toBeVisible();
  });

  test("Post Gig submit success", async ({ page }) => {
    await page.getByRole("button", { name: "Post a Gig" }).click();
    await page.getByRole("button", { name: "Post Gig" }).click();
    await expect(page.getByText("Gig Posted!")).toBeVisible();
  });

  test("Quick Pitch opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Quick Pitch" }).first().click();
    await expect(page.getByText(/Applying to/)).toBeVisible();
  });

  test("Quick Pitch sends", async ({ page }) => {
    await page.getByRole("button", { name: "Quick Pitch" }).first().click();
    await page.getByRole("button", { name: "Send Pitch" }).click();
    await expect(page.getByText("Pitch Sent!")).toBeVisible();
  });

  test("Save toggles", async ({ page }) => {
    await page.getByRole("button", { name: "Save" }).first().click();
    await expect(page.getByRole("button", { name: /Saved/ }).first()).toBeVisible();
  });

  test("Filter Vocalist works", async ({ page }) => {
    await page.getByRole("button", { name: "Vocalist" }).click();
    await expect(page.getByText("Mixing & Mastering Engineer")).toBeHidden();
  });

  test("Filter Engineer works", async ({ page }) => {
    await page.getByRole("button", { name: "Engineer" }).click();
    await expect(page.getByText("Session Vocalist needed")).toBeHidden();
  });

  test("Empty filter shows empty state", async ({ page }) => {
    await page.getByRole("button", { name: "A&R" }).click();
    await expect(page.getByText("No gigs match your filter")).toBeVisible();
  });

  test("COLLAB badge visible", async ({ page }) => {
    await expect(page.getByText("COLLAB").first()).toBeVisible();
  });

  test("BOOKING badge visible", async ({ page }) => {
    await expect(page.getByText("BOOKING").first()).toBeVisible();
  });

  test("£400 price visible", async ({ page }) => {
    await expect(page.getByText(/£400/)).toBeVisible();
  });

  test("3 gigs visible", async ({ page }) => {
    await expect(page.getByText("Session Vocalist needed")).toBeVisible();
    await expect(page.getByText("Mixing & Mastering Engineer")).toBeVisible();
    await expect(page.getByText("Drummer needed")).toBeVisible();
  });
});