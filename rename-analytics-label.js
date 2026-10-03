const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// 1. Rename Analytics → Dashboard
t = t.replace(
  `<a
                  href="/organizer"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Analytics
                </a>`,
  `<a
                  href="/organizer"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Dashboard
                </a>`
);

if (t !== before) {
  console.log("Analytics label changed to Dashboard.");
  fs.writeFileSync(p, t);
} else {
  console.log("Label pattern not matched — check the file.");
}