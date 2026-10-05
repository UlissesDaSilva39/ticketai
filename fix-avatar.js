const fs = require("fs");
const p = "components/ProfileDropdown.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Add email prop
t = t.replace(
  'type Props = {\n  username: string | null;\n  role: string | null;\n  pendingRequestCount: number;\n};',
  'type Props = {\n  username: string | null;\n  email: string | null;\n  role: string | null;\n  pendingRequestCount: number;\n};'
);

t = t.replace(
  'export default function ProfileDropdown({\n  username,\n  role,\n  pendingRequestCount,\n}: Props) {',
  'export default function ProfileDropdown({\n  username,\n  email,\n  role,\n  pendingRequestCount,\n}: Props) {'
);

// Avatar fallback: username first letter, then email prefix, then "U"
t = t.replace(
  '{(username || "?").charAt(0).toUpperCase()}',
  '{(username || email?.split("@")[0] || "U").charAt(0).toUpperCase()}'
);

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("ProfileDropdown updated: avatar falls back to email prefix.");
} else {
  console.log("No changes — checking current state:");
  console.log(t.slice(t.indexOf("type Props"), t.indexOf("type Props") + 300));
}