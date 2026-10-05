const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

const feedBlock = `              {user && (
                <a
                  href="/feed"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Feed
                </a>
              )}`;

const withFollowing = feedBlock + `
              {user && (
                <a
                  href="/following"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Following
                </a>
              )}`;

if (t.includes(feedBlock) && !t.includes('href="/following"')) {
  t = t.replace(feedBlock, withFollowing);
  console.log("Following link added to nav.");
} else if (t.includes('href="/following"')) {
  console.log("Following already present in nav.");
} else {
  console.log("Feed block anchor not found.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}