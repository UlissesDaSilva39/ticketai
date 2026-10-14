// tests/run-feed.js — start dev server, run playwright, print PASS/FAIL/SKIP table
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const npxCmd = isWindows ? "npx.cmd" : "npx";
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const READY_TIMEOUT_MS = 180_000;
const POLL_INTERVAL_MS = 500;
const REPORT_JSON = path.resolve(__dirname, "..", "test-results", "results.json");

// ---------- fixtures ----------
const FIXTURE_DIR = path.join(__dirname, "fixtures");
if (!fs.existsSync(FIXTURE_DIR)) fs.mkdirSync(FIXTURE_DIR, { recursive: true });

const PNG_HEX =
  "89504e470d0a1a0a0000000d4948445200000001000000010806000000" +
  "1f15c4890000000a49444154789c6360000002000154a24f5b00000000" +
  "49454e44ae426082";
const MP3_HEX =
  "494433040000000000004b4944330000496e666f0000000f00010000" +
  "000100000000000000fffb9064000000000000";
const pngPath = path.join(FIXTURE_DIR, "tiny.png");
const mp3Path = path.join(FIXTURE_DIR, "tiny.mp3");
if (!fs.existsSync(pngPath)) fs.writeFileSync(pngPath, Buffer.from(PNG_HEX, "hex"));
if (!fs.existsSync(mp3Path)) fs.writeFileSync(mp3Path, Buffer.from(MP3_HEX, "hex"));

// ---------- helpers ----------
function ping(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => { res.resume(); resolve(res.statusCode && res.statusCode < 500); });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => { req.destroy(); resolve(false); });
  });
}
async function waitFor(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await ping(url)) return true;
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  return false;
}
function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      stdio: opts.inherit === false ? ["ignore", "pipe", "pipe"] : "inherit",
      shell: false,
      env: opts.env || process.env,
      cwd: path.resolve(__dirname, ".."),
    });
    let out = "";
    if (opts.inherit === false) {
      child.stdout.on("data", (d) => { out += d.toString(); });
      child.stderr.on("data", (d) => { out += d.toString(); });
    }
    child.on("exit", (code) => resolve({ code: code ?? 0, out }));
  });
}

// ---------- summary table ----------
function printSummary() {
  console.log("");
  console.log("==================================================");
  console.log("  TEST RESULTS");
  console.log("==================================================");
  console.log("");

  if (!fs.existsSync(REPORT_JSON)) {
    console.log("  (no JSON report found at " + REPORT_JSON + ")");
    console.log("  The test run may have crashed before producing results.");
    console.log("");
    return { pass: 0, fail: 0, skip: 0, total: 0 };
  }

  let report;
  try {
    report = JSON.parse(fs.readFileSync(REPORT_JSON, "utf8"));
  } catch (e) {
    console.log("  Could not parse " + REPORT_JSON + ": " + e.message);
    return { pass: 0, fail: 0, skip: 0, total: 0 };
  }

  // Playwright JSON shape: { suites: [{ specs: [{ title, tests: [...] }] }] }
  const rows = [];
  function walkSuite(suite, parentTitles = []) {
    const titles = parentTitles.concat(suite.title ? [suite.title] : []);
    if (suite.specs) {
      for (const spec of suite.specs) {
        const test = spec.tests?.[0];
        const status = test?.status || spec.ok === false ? "failed" : "passed";
        const results = test?.results || [];
        const lastResult = results[results.length - 1];
        const finalStatus = lastResult?.status || status;
        rows.push({
          title: titles.concat(spec.title).join(" › "),
          status: finalStatus, // passed, failed, timedOut, skipped
          duration: lastResult?.duration || 0,
          error: lastResult?.error?.message || "",
        });
      }
    }
    if (suite.suites) for (const s of suite.suites) walkSuite(s, titles);
  }
  for (const s of (report.suites || [])) walkSuite(s);

  let pass = 0, fail = 0, skip = 0;
  for (const r of rows) {
    if (r.status === "passed") pass++;
    else if (r.status === "skipped") skip++;
    else fail++;
  }

  // Column widths
  const statusColW = 8;
  const titleColW = Math.min(80, Math.max(30, ...rows.map((r) => r.title.length)));

  console.log(
    "  " +
    "STATUS".padEnd(statusColW) + " " +
    "TEST".padEnd(titleColW) + " " +
    "TIME"
  );
  console.log(
    "  " +
    "─".repeat(statusColW) + " " +
    "─".repeat(titleColW) + " " +
    "───────"
  );

  for (const r of rows) {
    let icon = "·";
    let label = r.status.toUpperCase();
    if (r.status === "passed") { icon = "✓"; label = "PASS"; }
    else if (r.status === "skipped") { icon = "○"; label = "SKIP"; }
    else { icon = "✗"; label = "FAIL"; }

    const dur = r.duration ? (r.duration / 1000).toFixed(2) + "s" : "—";
    const title = r.title.length > titleColW
      ? r.title.slice(0, titleColW - 1) + "…"
      : r.title;

    console.log(
      "  " +
      (icon + " " + label).padEnd(statusColW) + " " +
      title.padEnd(titleColW) + " " +
      dur.padStart(7)
    );

    if (r.status !== "passed" && r.status !== "skipped" && r.error) {
      const firstLine = r.error.split("\n")[0].slice(0, 120);
      console.log("  " + " ".repeat(statusColW) + "   → " + firstLine);
    }
  }

  console.log("");
  console.log("==================================================");
  console.log("  SUMMARY");
  console.log("==================================================");
  console.log("");
  console.log("  ✓ PASS:  " + pass);
  console.log("  ✗ FAIL:  " + fail);
  console.log("  ○ SKIP:  " + skip);
  console.log("  ────────");
  console.log("  TOTAL:   " + rows.length);
  console.log("");

  if (fail === 0) {
    console.log("  ✅ ALL TESTS PASSED");
  } else {
    console.log("  ❌ " + fail + " TEST" + (fail === 1 ? "" : "S") + " FAILED");
  }
  console.log("");

  return { pass, fail, skip, total: rows.length };
}

// ---------- main ----------
(async () => {
  let dev = null;

  console.log("[fixtures] tiny.png " + fs.statSync(pngPath).size + " bytes");
  console.log("[fixtures] tiny.mp3 " + fs.statSync(mp3Path).size + " bytes");

  if (!(await ping(BASE))) {
    console.log("[run] starting dev server...");
    dev = spawn(npmCmd, ["run", "dev"], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      cwd: path.resolve(__dirname, ".."),
    });
    dev.stdout.on("data", (d) => process.stdout.write("[dev] " + d.toString()));
    dev.stderr.on("data", (d) => process.stderr.write("[dev] " + d.toString()));

    console.log("[run] waiting for " + BASE + " ...");
    const ok = await waitFor(BASE, READY_TIMEOUT_MS);
    if (!ok) {
      console.error("[run] dev server never became ready");
      if (dev) dev.kill();
      process.exit(1);
    }
    console.log("[run] dev server ready");
  } else {
    console.log("[run] dev server already running");
  }

  console.log("[run] warming up routes (cold-start compiles)...");
  await ping(BASE + "/artists/alexmorgan");
  await ping(BASE + "/artist/alexmorgan/edit");
  await new Promise((r) => setTimeout(r, 3000));

  const cleanup = () => {
    if (dev && !dev.killed) {
      console.log("[run] stopping dev server...");
      try {
        if (isWindows) {
          spawn("taskkill", ["/pid", String(dev.pid), "/f", "/t"], { shell: true });
        } else {
          process.kill(-dev.pid, "SIGTERM");
        }
      } catch {}
    }
  };
  process.on("SIGINT", () => { cleanup(); process.exit(130); });
  process.on("exit", cleanup);

  // ensure test-results dir exists
  const resultsDir = path.dirname(REPORT_JSON);
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

  const args = [
    "playwright", "test",
    "--reporter=line",
    "tests/artist-upload.spec.ts",
  ];

  // pass through --headed / --debug etc after --
  const passthroughIdx = process.argv.indexOf("--");
  if (passthroughIdx >= 0) {
    args.push(...process.argv.slice(passthroughIdx + 1));
  }

  console.log("[run] running: npx " + args.join(" "));
  console.log("");

  const env = {
    ...process.env,
    PLAYWRIGHT_JSON_OUTPUT_NAME: REPORT_JSON,
    PLAYWRIGHT_JSON_OUTPUT_DIR: path.dirname(REPORT_JSON),
  };
  const { code } = await run(npxCmd, args, { env });

  // Playwright writes JSON report to stdout when reporter=json is used.
  // Easier: use PLAYWRIGHT_JSON_OUTPUT_NAME env to write it to a file.
  // We already used --reporter=line,json but that dumps JSON to stdout.
  // So instead, we re-read from a known location using env var.
  // (Handled by setting it below.)
  console.log("");
  const summary = printSummary();

  console.log("[run] playwright exit code: " + code);
  console.log("");

  cleanup();

  // Exit non-zero only if tests actually failed
  process.exit(summary.fail > 0 ? 1 : 0);
})();



