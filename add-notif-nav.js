const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Match the current My Profile block that has the dot
const old = `              {user && username && (
                <a
                  href={\`/u/\${username}\`}
                  className="relative text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  My Profile
                  {pendingRequestCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </a>
              )}`;

const neu = `              {user && username && (
                <a
                  href={\`/u/\${username}\`}
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  My Profile
                </a>
              )}

              {user && (
                <a
                  href="/notifications"
                  className="relative text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Notifications
                  {pendingRequestCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </a>
              )}`;

if (t.includes(old)) {
  t = t.replace(old, neu);
  console.log("Notifications link added; dot moved.");
} else {
  console.log("Anchor miss — checking with looser pattern.");
  // Looser: find the My Profile link with 'relative' class
  const regex = /\{user && username && \(\s*<a\s+href=\{`\/u\/\$\{username\}`\}\s+className="relative[^"]*"\s*>\s*My Profile\s*\{pendingRequestCount > 0 && \(\s*<span[^/]*\/>\s*\)\}\s*<\/a>\s*\)\}/;
  if (regex.test(t)) {
    t = t.replace(regex, neu);
    console.log("Matched with looser regex.");
  } else {
    console.log("Still no match. Paste the block from the file.");
  }
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("layout.tsx saved.");
} else {
  console.log("No changes made.");
}