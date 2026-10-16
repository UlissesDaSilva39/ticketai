// fix-navigation.mjs
import fs from "node:fs";

const path = "C:/Users/User/ticketai/config/navigation.ts";
let c = fs.readFileSync(path, "utf8");

const replacements = [
  ["\u00C3\u0192\u00E2\u20AC\u0161\u00C3\u201A\u00C2\u00B7", "\u00B7"],
  ["\u00C3\u0192\u00E2\u20AC\u0161\u00C3\u201A", "\u00B7"],
  ["\u00C3\u201A\u00C2\u00B7", "\u00B7"],
  ["\u00C3\u201A", ""],
  ["\u00C3\u00A2\u00E2\u201A\u00AC\u00E2\u201E\u00A2", "\u2019"],
  ["\u00C3\u00A2\u00E2\u201A\u00AC\u00E2\u20AC\u0153", "\u2014"],
];

for (const [from, to] of replacements) {
  c = c.split(from).join(to);
}

fs.writeFileSync(path, c, "utf8");
console.log("Cleaned navigation.ts");

const lines = c.split("\n");
for (const line of lines) {
  if (line.includes("subtitle")) console.log("  " + line.trim());
}