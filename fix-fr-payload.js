const fs = require("fs");
const p = "app/api/friends/toggle/route.ts";
let t = fs.readFileSync(p, "utf8");
const before = t;

t = t.replace(
  `          fromName: senderProfile?.full_name || senderProfile?.username || "Someone",
          siteUrl,`,
  `          fromName: senderProfile?.full_name || senderProfile?.username || "Someone",
          fromUsername: senderProfile?.username || null,
          siteUrl,`
);

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("fromUsername added to email payload.");
} else {
  console.log("Pattern not found — check file.");
}