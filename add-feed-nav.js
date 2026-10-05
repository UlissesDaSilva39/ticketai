const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

const anchor = `              <a
                href="/friends"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Social
              </a>`;

const withFeed = anchor + `
              {user && (
                <a
                  href="/feed"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Feed
                </a>
              )}`;

if (t.includes(anchor) && !t.includes('href="/feed"')) {
  t = t.replace(anchor, withFeed);
  console.log("Feed link added to nav.");
} else if (t.includes('href="/feed"')) {
  console.log("Feed link already present.");
} else {
  console.log("Anchor not found.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}