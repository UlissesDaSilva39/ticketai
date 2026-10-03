const fs = require("fs");
const p = "app/event/[id]/attendees/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

const oldBlock = `            const initials = (p.full_name || "?")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();`;

const newBlock = `            const displayName = (p.full_name && p.full_name.trim()) || p.username || "Someone";
            const initials = displayName.trim().split(/\\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";`;

if (t.includes(oldBlock)) {
  t = t.replace(oldBlock, newBlock);
  fs.writeFileSync(p, t);
  console.log("Initials fixed.");
} else {
  console.log("Anchor miss. Showing the actual block:");
  const idx = t.indexOf("const initials");
  console.log(JSON.stringify(t.slice(idx, idx + 250)));
}