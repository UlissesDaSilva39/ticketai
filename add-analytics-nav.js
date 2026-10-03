const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (t.includes('href="/organizer/analytics"')) {
  console.log("Analytics link already present.");
  process.exit(0);
}

// Find the Promoter Dashboard link and add Analytics after it
const anchor = `{isPromoter && (
                <a
                  href="/promoter/dashboard"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Promoter Dashboard
                </a>
              )}`;

const updated = `{isPromoter && (
                <a
                  href="/promoter/dashboard"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Promoter Dashboard
                </a>
              )}

              {isPromoter && (
                <a
                  href="/organizer/analytics"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  Analytics
                </a>
              )}`;

if (t.includes(anchor)) {
  t = t.replace(anchor, updated);
  fs.writeFileSync(p, t);
  console.log("Analytics link added to nav.");
} else {
  console.log("Promoter Dashboard anchor not found.");
  const idx = t.indexOf("Promoter Dashboard");
  console.log(JSON.stringify(t.slice(idx - 100, idx + 200)));
}