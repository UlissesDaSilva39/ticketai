const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Find the broken separator between venue name and city — it's any quoted string containing garbage + venues.city
t = t.replace(/(e\.venues\.city \? ")[^"]*(" \+ e\.venues\.city)/, '$1 \\u00b7 $2');

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("Venue separator cleaned to ·");
} else {
  console.log("Pattern not matched. Showing the venue line:");
  const idx = t.indexOf("e.venues.city");
  console.log(JSON.stringify(t.slice(idx - 50, idx + 100)));
}