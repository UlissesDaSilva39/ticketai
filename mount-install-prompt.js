const fs = require("fs");
const p = "app/layout.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Add import
if (!t.includes("InstallPrompt from")) {
  t = t.replace(
    'import ProfileDropdown from "@/components/ProfileDropdown";',
    'import ProfileDropdown from "@/components/ProfileDropdown";\nimport InstallPrompt from "@/components/InstallPrompt";'
  );
  console.log("InstallPrompt import added.");
}

// Add component just before closing body
if (!t.includes("<InstallPrompt")) {
  t = t.replace(
    "        <footer",
    "        <InstallPrompt />\n        <footer"
  );
  console.log("InstallPrompt mounted in layout.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}