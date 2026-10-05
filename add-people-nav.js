const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

const anchor = `              <a
                href="/venues"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Venues
              </a>`;

const withPeople = `              <a
                href="/people"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                People
              </a>

${anchor}`;

if (t.includes(anchor) && !t.includes('href="/people"')) {
  t = t.replace(anchor, withPeople);
  console.log("People link added to nav.");
} else if (t.includes('href="/people"')) {
  console.log("People already present.");
} else {
  console.log("Venues anchor not found.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}