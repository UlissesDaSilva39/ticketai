import { test as base, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const AUTH_FILE = path.join(__dirname, "..", ".auth", "user.json");

export const test = base.extend<{
  authedPage: Page;
  consoleErrors: string[];
  pageErrors: string[];
}>({
  authedPage: async ({ browser }, use) => {
    const ctx = await browser.newContext({
      storageState: fs.existsSync(AUTH_FILE) ? AUTH_FILE : undefined,
    });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await use(errors);
  },
  pageErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await use(errors);
  },
});

export { expect };
