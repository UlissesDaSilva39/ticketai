const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

const broken = `            <p className="text-center text-sm text-gray-500">
              <p
                className="text-center text-sm uppercase tracking-[0.3em] text-gray-400 mb-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Discover. Connect. Experience.
              </p>
              {"\\u00A9 " +`;

const fixed = `            <p className="text-center text-sm text-gray-500">
              <span
                className="block text-sm uppercase tracking-[0.3em] text-gray-400 mb-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Discover. Connect. Experience.
              </span>
              {"\\u00A9 " +`;

if (t.includes(broken)) {
  t = t.replace(broken, fixed);
  fs.writeFileSync(p, t);
  console.log("Footer tagline converted to <span>.");
} else {
  console.log("Exact pattern not found. Checking looser...");
  // Loose match: the <p> right after <p className="text-center text-sm text-gray-500">
  const re = /(<p className="text-center text-sm text-gray-500">\s*)<p(\s+className="text-center text-sm uppercase tracking-\[0\.3em\][\s\S]*?)<\/p>/;
  const m = t.match(re);
  if (m) {
    const replaced = m[1] + "<span" + m[2] + "</span>";
    t = t.replace(re, replaced);
    fs.writeFileSync(p, t);
    console.log("Footer tagline converted to <span> (loose).");
  } else {
    console.log("Could not find the block. Showing lines 235-250:");
    const lines = t.split("\n");
    for (let i = 234; i < 250; i++) console.log((i+1) + ": " + JSON.stringify(lines[i]));
  }
}