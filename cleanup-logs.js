const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

t = t.replace(
  '  if (reviewsError) console.error("[reviews] fetch error:", reviewsError);\n  console.log("[reviews] fetched", reviewsData?.length ?? 0, "rows for event", id);\n',
  ''
);

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("Debug logs removed.");
} else {
  console.log("No change needed.");
}