const { chromium } = require("@playwright/test");

const pages = ["/", "/messages", "/home"];
const allHrefs = new Set();
const allPushTargets = new Set();

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const url of pages) {
    try {
      await p.goto("http://localhost:3000" + url, { waitUntil: "networkidle", timeout: 40000 });
    } catch { continue; }
    await p.waitForTimeout(800);
    const hrefs = await p.evaluate(() =>
      [...document.querySelectorAll("a[href]")]
        .map(a => a.getAttribute("href"))
        .filter(h => h && h.startsWith("/"))
    );
    hrefs.forEach(h => allHrefs.add(h));
  }
  await b.close();

  console.log("=== Internal <a href> targets found ===");
  [...allHrefs].sort().forEach(h => console.log("  " + h));
})();