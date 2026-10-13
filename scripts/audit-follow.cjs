const fs = require("fs");
const path = require("path");

function listDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).map((e) => (e.isDirectory() ? e.name + "/" : e.name));
}

console.log("=== Follow-related components ===");
listDir("components/artist").filter((f) => /follow/i.test(f)).forEach((f) => console.log("  components/artist/" + f));
listDir("components/venue").filter((f) => /follow/i.test(f)).forEach((f) => console.log("  components/venue/" + f));
listDir("components/social").forEach((f) => console.log("  components/social/" + f));

console.log("");
console.log("=== API routes ===");
const apiDir = "app/api";
if (fs.existsSync(apiDir)) {
  const walk = (d, prefix = "") => {
    fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full, prefix + e.name + "/");
      else if (e.name === "route.ts") console.log("  " + prefix.slice(0, -1));
    });
  };
  walk(apiDir);
}

console.log("");
console.log("=== ArtistFollowButton.tsx ===");
const afb = "components/artist/ArtistFollowButton.tsx";
if (fs.existsSync(afb)) {
  console.log(fs.readFileSync(afb, "utf8"));
} else {
  console.log("  (not found)");
}
