const fs = require("fs");

const files = [
  "app/artist/[slug]/inbox/page.tsx",
  "components/booking/BookingResponseButtons.tsx",
  "components/messages/ReplyOnGridButton.tsx",
];

for (const f of files) {
  console.log("\n========================================");
  console.log("=== " + f + " ===");
  console.log("========================================");
  if (fs.existsSync(f)) {
    console.log(fs.readFileSync(f, "utf8"));
  } else {
    console.log("  ❌ (not found)");
  }
}
