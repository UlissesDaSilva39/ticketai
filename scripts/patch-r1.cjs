const fs = require("fs");
const p = "tests/e2e/full-regression.spec.ts";
let s = fs.readFileSync(p, "utf8");

// Insert waitForURL right after the goto inside the R1 loop
const needle = `await page.goto("http://localhost:3000" + route, { waitUntil: "domcontentloaded", timeout: 30000 });
      const url = page.url();`;

const replacement = `await page.goto("http://localhost:3000" + route, { waitUntil: "domcontentloaded", timeout: 30000 });
      try { await page.waitForURL(/\\/login/, { timeout: 10000 }); } catch {}
      const url = page.url();`;

if (!s.includes(needle)) {
  console.log("  R1 patch: needle not found, skipping (may already be patched)");
} else {
  s = s.replace(needle, replacement);
  fs.writeFileSync(p, s, "utf8");
  console.log("  R1 patch: applied");
}

// Sanity check for missing newlines (the earlier corruption)
if (s.includes("() => {n  ")) {
  console.log("  ERROR: spec has literal \\n corruption, restoring again");
  fs.copyFileSync(p + ".bak", p);
  process.exit(2);
}
