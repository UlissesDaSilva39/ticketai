const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (t.includes("Discover. Connect. Experience.")) {
  console.log("Tagline already present.");
  process.exit(0);
}

// Find the copyright paragraph and insert the tagline above it
const copyrightAnchor = `              {"\\u00A9 " +`;

const tagline = `              <p
                className="text-center text-sm uppercase tracking-[0.3em] text-gray-400 mb-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Discover. Connect. Experience.
              </p>
              {"\\u00A9 " +`;

if (t.includes(copyrightAnchor)) {
  t = t.replace(copyrightAnchor, tagline);
  fs.writeFileSync(p, t);
  console.log("Footer tagline added.");
} else {
  console.log("Copyright anchor not found. Checking looser...");
  const loose = t.match(/\{"\\\\u00A9 " \+/);
  if (loose) {
    t = t.replace(loose[0], `              <p className="text-center text-sm uppercase tracking-[0.3em] text-gray-400 mb-4" style={{ fontFamily: "var(--font-antonio)" }}>Discover. Connect. Experience.</p>\n              ` + loose[0]);
    fs.writeFileSync(p, t);
    console.log("Footer tagline added (loose match).");
  } else {
    const idx = t.indexOf("All rights reserved");
    console.log(JSON.stringify(t.slice(idx - 200, idx + 100)));
  }
}