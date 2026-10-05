const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

/* ============================================================
   1. Add ProfileDropdown import
   ============================================================ */
if (!t.includes("ProfileDropdown from")) {
  const imp = 'import SignOutButton from "@/components/SignOutButton";';
  t = t.replace(imp, imp + '\nimport ProfileDropdown from "@/components/ProfileDropdown";');
  console.log("1. ProfileDropdown import added.");
} else {
  console.log("1. Import already present.");
}

/* ============================================================
   2. Replace the nav block inside <header>
   ============================================================ */
const navStart = `            <nav className="flex items-center gap-6">`;
const navEnd = `            </nav>`;

const startIdx = t.indexOf(navStart);
if (startIdx === -1) {
  console.log("2. MISS — nav start not found.");
  process.exit(1);
}

const endIdx = t.indexOf(navEnd, startIdx);
if (endIdx === -1) {
  console.log("2. MISS — nav end not found.");
  process.exit(1);
}

const newNav = `            <nav className="flex items-center gap-6">
              <a
                href="/"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Discover
              </a>
              <a
                href="/search"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Search
              </a>
              <a
                href="/friends"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Social
              </a>
              <a
                href="/venues"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Venues
              </a>
              <a
                href="/promoters"
                className="text-sm font-medium hover:opacity-70 hidden sm:inline"
              >
                Promoters
              </a>

              {!user && (
                <>
                  <a
                    href="/for-promoters"
                    className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                  >
                    Become a promoter
                  </a>
                  <a
                    href="/for-venues"
                    className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                  >
                    List your venue
                  </a>
                </>
              )}

              {user && (
                <a
                  href="/my-tickets"
                  className="text-sm font-medium hover:opacity-70 hidden sm:inline"
                >
                  My Tickets
                </a>
              )}

              {user ? (
                <ProfileDropdown
                  username={username}
                  role={role}
                  pendingRequestCount={pendingRequestCount}
                />
              ) : (
                <a
                  href="/login"
                  className="px-5 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800"
                >
                  Sign In
                </a>
              )}
            </nav>`;

t = t.slice(0, startIdx) + newNav + t.slice(endIdx + navEnd.length);
console.log("2. Nav replaced.");
console.log("   Old nav was", endIdx - startIdx, "chars, new is", newNav.length, "chars.");

/* ============================================================
   3. Save
   ============================================================ */
if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}