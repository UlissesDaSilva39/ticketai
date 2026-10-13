import { test as base, expect } from "@playwright/test";

type Fixtures = {
  consoleErrors: string[];
  pageErrors: string[];
};

export const test = base.extend<Fixtures>({
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
