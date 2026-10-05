const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

t = t.replace(
  '<ProfileDropdown\n                  username={username}\n                  role={role}\n                  pendingRequestCount={pendingRequestCount}\n                />',
  '<ProfileDropdown\n                  username={username}\n                  email={user?.email ?? null}\n                  role={role}\n                  pendingRequestCount={pendingRequestCount}\n                />'
);

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("Layout: email passed to ProfileDropdown.");
} else {
  console.log("Pattern not found — checking:");
  const i = t.indexOf("<ProfileDropdown");
  console.log(JSON.stringify(t.slice(i, i + 250)));
}