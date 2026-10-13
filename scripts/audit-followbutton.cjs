const fs = require("fs");
const path = require("path");

console.log("=== components/FollowButton.tsx ===");
const f = "components/FollowButton.tsx";
if (fs.existsSync(f)) {
  console.log(fs.readFileSync(f, "utf8"));
} else {
  console.log("  (not found)");
}

console.log("");
console.log("=== Any API route containing 'venue_follows' ===");
const apiDir = "app/api";
function walk(dir, prefix = "") {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, prefix + e.name + "/");
    else if (e.name === "route.ts") {
      const src = fs.readFileSync(full, "utf8");
      if (/venue_follows|target_type|follows/i.test(src)) {
        console.log("  " + prefix.slice(0, -1));
      }
    }
  });
}
walk(apiDir);

console.log("");
console.log("=== Any component importing FollowButton ===");
function walk2(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk2(full);
    else if (e.name.endsWith(".tsx")) {
      const src = fs.readFileSync(full, "utf8");
      if (/FollowButton/.test(src)) console.log("  " + full);
    }
  });
}
walk2("app");
walk2("components");
