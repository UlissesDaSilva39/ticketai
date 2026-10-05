const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

const anchor = `              {user && (
                <a
                  href="/following"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Following
                </a>
              )}`;

const withMessages = anchor + `
              {user && (
                <a
                  href="/messages"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Messages
                </a>
              )}`;

if (t.includes(anchor) && !t.includes('href="/messages"')) {
  t = t.replace(anchor, withMessages);
  console.log("Messages link added to nav.");
} else if (t.includes('href="/messages"')) {
  console.log("Messages already in nav.");
} else {
  console.log("Following anchor not found.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}