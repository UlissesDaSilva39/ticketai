import { Page } from "@playwright/test";

export class GridHelpers {
  constructor(private page: Page) {}
  async gotoHome() { await this.page.goto("/home"); }
  async gotoNetwork() { await this.page.goto("/network"); }
  async gotoJobs() { await this.page.goto("/jobs"); }
  async gotoPayments() { await this.page.goto("/payments"); }
  async gotoSplits() { await this.page.goto("/splits"); }
  async gotoMessaging() { await this.page.goto("/messaging"); }
  async gotoNotifications() { await this.page.goto("/notifications"); }
  async toggleTheme() { await this.page.getByRole("button", { name: /Theme/i }).click(); }
  async search(query: string) {
    await this.page.getByPlaceholder("Search").fill(query);
    await this.page.getByPlaceholder("Search").press("Enter");
  }
}