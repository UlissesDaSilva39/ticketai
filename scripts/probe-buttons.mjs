import { chromium } from "@playwright/test";
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

  await page.goto("http://localhost:3000/messages", { waitUntil: "networkidle", timeout: 40000 });

  const info = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const anyReact = (el) => !!Object.keys(el).find((k) => k.startsWith("__react"));
    return {
      total: btns.length,
      hydrated: btns.filter(anyReact).length,
      notHydrated: btns.filter((b) => !anyReact(b)).length,
      labels: btns.slice(0, 10).map((b) => ({ text: b.innerText.trim().slice(0, 25) || "(icon)", hydrated: anyReact(b) })),
    };
  });

  console.log("Total buttons:", info.total);
  console.log("Hydrated:", info.hydrated);
  console.log("Not hydrated:", info.notHydrated);
  console.log("---");
  for (const b of info.labels) console.log((b.hydrated ? "[OK] " : "[NO] ") + b.text);
  console.log("---");
  if (errors.length === 0) console.log("No console errors");
  else { console.log("Errors:"); errors.slice(0, 5).forEach((e) => console.log("  " + e.slice(0, 200))); }

  await browser.close();
})();
