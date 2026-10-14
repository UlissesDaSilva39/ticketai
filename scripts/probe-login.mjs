import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  page.on("console", (m) => console.log("[console." + m.type() + "]", m.text()));
  page.on("pageerror", (e) => console.log("[pageerror]", e.message));
  page.on("requestfailed", (r) => console.log("[requestfailed]", r.url(), r.failure()?.errorText));
  page.on("response", (r) => { if (r.status() >= 400) console.log("[HTTP " + r.status() + "]", r.url()); });

  try {
    console.log("[probe] goto /login with waitUntil=commit, 60s");
    await page.goto("http://localhost:3000/login", { waitUntil: "commit", timeout: 60000 });
    console.log("[probe] committed. URL:", page.url());

    console.log("[probe] waiting for DOMContentLoaded...");
    await page.waitForLoadState("domcontentloaded", { timeout: 30000 });
    console.log("[probe] DOMContentLoaded reached");

    console.log("[probe] waiting for any <input>...");
    await page.waitForSelector("input", { timeout: 30000 });
    console.log("[probe] input found");

    const inputs = await page.locator("input").evaluateAll((els) =>
      els.map((e) => ({ type: e.type, name: e.name, id: e.id, placeholder: e.placeholder }))
    );
    console.log("[probe] inputs on page:", JSON.stringify(inputs, null, 2));

    const buttons = await page.locator("button").evaluateAll((els) =>
      els.map((e) => ({ text: e.innerText.trim(), type: e.type }))
    );
    console.log("[probe] buttons on page:", JSON.stringify(buttons, null, 2));

    await page.screenshot({ path: "login-probe.png", fullPage: true });
    console.log("[probe] saved login-probe.png");
  } catch (e) {
    console.log("[probe] FAILED:", e.message);
    try { await page.screenshot({ path: "login-probe-fail.png", fullPage: true }); } catch {}
  } finally {
    await browser.close();
  }
})();
