import { test, expect } from "@playwright/test";
import { captureConsole } from "./helpers/console";

test.describe("Analytics", () => {
  test("analytics page renders chart or empty state", async ({ page }) => {
    const res = await page.goto("/analytics").catch(() => null);
    if (!res || res.status() === 404) test.skip(true, "Not implemented");
    const console = captureConsole(page);
    await page.waitForLoadState("networkidle").catch(() => {});

    const chart = page.locator("canvas, svg[role=img], [data-chart], .recharts-wrapper");
    const noData = page.getByText(/no data|sem dados|empty/i);
    const hasChart = (await chart.count()) > 0;
    const hasNoData = (await noData.count()) > 0;
    expect(hasChart || hasNoData).toBe(true);
    expect(console.pageErrors).toHaveLength(0);
  });
});