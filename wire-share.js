const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (!t.includes("ShareButton from")) {
  const imp = 'import FollowButton from "@/components/FollowButton";';
  if (t.includes(imp)) {
    t = t.replace(imp, imp + '\nimport ShareButton from "@/components/ShareButton";');
    console.log("Import added.");
  } else {
    console.log("FollowButton import not found.");
  }
}

const followPattern = /(<FollowButton[\s\S]*?\/>)/;
const m = t.match(followPattern);

if (m && !t.includes("<ShareButton")) {
  const shareEl = m[1] + '\n\n            <ShareButton url={`${SITE_URL}/event/${e.id}`} title={e.title} />';
  t = t.replace(m[1], shareEl);
  console.log("ShareButton rendered.");
} else if (!m) {
  console.log("FollowButton render anchor not found.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}