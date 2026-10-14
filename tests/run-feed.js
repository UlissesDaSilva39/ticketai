#!/usr/bin/env node
// tests/run-feed.js
// Starts dev server, waits for it, runs Playwright tests, cleans up.

const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";
const npx = isWindows ? "npx.cmd" : "npx";
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const READY_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 500;

function ping(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
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
      stdio: "inherit",
      shell: true,
      cwd: path.resolve(__dirname, ".."),
      ...opts,
    });
    child.on("exit", (code) => resolve(code ?? 0));
  });
}

(async () => {
  const SKIP = process.env.PLAYWRIGHT_SKIP_DEVSERVER === "1";
  let dev = null;

  if (!SKIP && !(await ping(BASE))) {
    console.log("[run-feed] starting dev server...");
    dev = spawn(npm, ["run", "dev"], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      cwd: path.resolve(__dirname, ".."),
    });
    dev.stdout.on("data", (d) => process.stdout.write("[dev] " + d.toString()));
    dev.stderr.on("data", (d) => process.stderr.write("[dev] " + d.toString()));

    console.log(`[run-feed] waiting for ${BASE}...`);
    const ok = await waitFor(BASE, READY_TIMEOUT_MS);
    if (!ok) {
      console.error("[run-feed] dev server never became ready");
      if (dev) dev.kill();
      process.exit(1);
    }
    console.log("[run-feed] dev server is ready.");
  } else {
    console.log("[run-feed] dev server already running.");
  }

  const cleanup = () => {
    if (dev && !dev.killed) {
      console.log("[run-feed] stopping dev server...");
      try {
        if (isWindows) {
          spawn("taskkill", ["/pid", String(dev.pid), "/f", "/t"], { shell: true });
        } else {
          process.kill(-dev.pid, "SIGTERM");
        }
      } catch { /* ignore */ }
    }
  };
  process.on("SIGINT", () => { cleanup(); process.exit(130); });
  process.on("exit", cleanup);

  const args = ["playwright", "test", "tests/feed.spec.ts"];
  if (process.argv.includes("--headed")) args.push("--headed");
  if (process.argv.includes("--debug")) args.push("--debug");
  if (process.argv.includes("--ui")) args.push("--ui");
  if (process.argv.includes("--reporter")) {
    const i = process.argv.indexOf("--reporter");
    if (i >= 0 && process.argv[i + 1]) args.push("--reporter", process.argv[i + 1]);
  }

  console.log("[run-feed] running: npx " + args.join(" "));
  const code = await run(npx, args);
  console.log(`[run-feed] tests finished with exit code ${code}`);
  cleanup();
  process.exit(code);
})();
