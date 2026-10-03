const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Find the section from the first `{isPromoter && (` to the closing of `{isAdmin && (...)}`
const startMarker = `{isPromoter && (`;
const startIdx = t.indexOf(startMarker);
if (startIdx === -1) {
  console.log("Start marker not found.");
  process.exit(1);
}

// Find the end of the admin block
const adminMarker = `{isAdmin && (`;
const adminIdx = t.indexOf(adminMarker, startIdx);
if (adminIdx === -1) {
  console.log("Admin marker not found.");
  process.exit(1);
}

// Find the closing of the admin block — first `)}` after the admin `<a>` closing
const adminCloseSearch = t.slice(adminIdx);
const closeMatch = adminCloseSearch.match(/\{isAdmin && \(\s*<a[\s\S]*?<\/a>\s*\)\}/);
if (!closeMatch) {
  console.log("Could not find admin block close.");
  process.exit(1);
}

const endIdx = adminIdx + closeMatch[0].length;

const replacement = `{isPromoter && (
                <a
                  href="/promoter/dashboard"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Promoter Dashboard
                </a>
              )}

              {isPromoter && (
                <a
                  href="/organizer"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Dashboard
                </a>
              )}

              {isVenue && (
                <a
                  href="/venue/dashboard"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Venue Dashboard
                </a>
              )}

              {isAdmin && (
                <a
                  href="/admin"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Admin
                </a>
              )}`;

t = t.slice(0, startIdx) + replacement + t.slice(endIdx);
fs.writeFileSync(p, t);
console.log("Promoter/Venue/Admin nav section rewritten cleanly.");