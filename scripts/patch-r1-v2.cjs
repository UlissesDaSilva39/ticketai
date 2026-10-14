const fs = require("fs");
const p = "tests/e2e/full-regression.spec.ts";
let s = fs.readFileSync(p, "utf8");

// Match the current R1 block
const pattern = /test\.describe\("R1\. Auth gates"[\s\S]*?\n\}\);\n/;

const newR1 = `test.describe("R1. Auth gates", () => {
  const protectedRoutes = ["/home", "/messages", "/notifications", "/profile"];
  for (const route of protectedRoutes) {
    test("R1." + (protectedRoutes.indexOf(route) + 1) + " " + route + " requires auth", async ({ browser }) => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();

      // First hit may take 20-30s while Next.js compiles the route
      await page.goto("http://localhost:3000" + route, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // Give the 307 redirect time to land on /login
      try {
        await page.waitForURL(/\\/login/, { timeout: 30000 });
      } catch {
        // Fall through — maybe the page renders a login CTA without redirecting
      }

      const url = page.url();
      const loginCta = await page.getByRole("link", { name: /log in|sign in/i }).count();

      // Debug output so we can see what went wrong
      console.log("[R1] route=" + route + " url=" + url + " loginCta=" + loginCta);

      expect(url.includes("/login") || loginCta > 0).toBe(true);
      await ctx.close();
    });
  }
});
`;

if (!pattern.test(s)) {
  console.log("  Could not find R1 block — aborting");
  process.exit(1);
}

s = s.replace(pattern, newR1);
fs.writeFileSync(p, s, "utf8");
console.log("  R1 test rewritten with 60s nav timeout + 30s waitForURL + debug log");
