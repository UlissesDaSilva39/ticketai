import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const fails = [];
  const jsErrors = [];
  const consoleErrors = [];

  page.on("requestfailed", (r) =>
    fails.push("FAILED " + r.url() + " :: " + (r.failure()?.errorText || "?"))
  );
  page.on("response", (r) => {
    if (r.status() >= 400) fails.push("HTTP " + r.status() + " " + r.url());
  });
  page.on("pageerror", (e) => jsErrors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });

  console.log("Navigating to /messages...");
  try {
    await page.goto("http://localhost:3000/messages", { waitUntil: "networkidle", timeout: 60000 });
  } catch (e) {
    console.log("Navigation error:", e.message);
  }
  await page.waitForTimeout(2000);

  // Hydration check
  const info = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const anyReact = (el) => !!Object.keys(el).find((k) => k.startsWith("__react"));
    return {
      url: location.pathname,
      totalButtons: btns.length,
      hydratedButtons: btns.filter(anyReact).length,
      labels: btns.slice(0, 10).map((b) => ({
        text: (b.innerText || "(icon)").trim().split("\n")[0].slice(0, 25),
        hydrated: anyReact(b),
      })),
    };
  });

  console.log("");
  console.log("=== HYDRATION ===");
  console.log("URL:", info.url);
  console.log("Buttons:", info.totalButtons, "| Hydrated:", info.hydratedButtons);
  for (const b of info.labels) console.log("  " + (b.hydrated ? "[OK] " : "[NO] ") + b.text);

  console.log("");
  console.log("=== FAILED NETWORK REQUESTS (" + fails.length + ") ===");
  if (fails.length === 0) console.log("  (none)");
  fails.slice(0, 15).forEach((f) => console.log("  " + f));

  console.log("");
  console.log("=== JS PAGE ERRORS (" + jsErrors.length + ") ===");
  if (jsErrors.length === 0) console.log("  (none)");
  jsErrors.slice(0, 5).forEach((e) => console.log("  " + e.slice(0, 300)));

  console.log("");
  console.log("=== CONSOLE ERRORS (" + consoleErrors.length + ") ===");
  if (consoleErrors.length === 0) console.log("  (none)");
  consoleErrors.slice(0, 5).forEach((e) => console.log("  " + e.slice(0, 300)));

  await browser.close();
})();