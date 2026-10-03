const fs = require("fs");
const p = "app/event/[id]/attendees/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Replace any "Back to event" line that has a corrupted arrow prefix
t = t.replace(/^\s*[^\s"<>]+\s*Back to event/gm, "        ← Back to event");

// Also fix common corrupted-arrow sequences inline
const corrupted = ["\u00e2\u0086\u0090", "\u00e2\u0086", "\u00c3\u00a2\u00e2\u0082\u00ac"];
for (const c of corrupted) {
  t = t.split(c).join("\u2190");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("Arrow cleaned.");
} else {
  console.log("Arrow already clean.");
}