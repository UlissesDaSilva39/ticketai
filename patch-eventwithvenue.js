const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");

if (t.includes("EventWithVenue = Event & { lineup?:")) {
  console.log("Already patched.");
  process.exit(0);
}

const old = `type EventWithVenue = Event & {
  venues: { name: string; slug: string; city: string } | null;
};`;

const patched = `type EventWithVenue = Event & {
  venues: { name: string; slug: string; city: string } | null;
  lineup?: Array<{ name: string; time?: string; photo?: string; bio?: string }>;
};`;

if (t.includes(old)) {
  t = t.replace(old, patched);
  fs.writeFileSync(p, t);
  console.log("EventWithVenue patched with lineup.");
} else {
  console.log("Anchor miss — showing the block:");
  const i = t.indexOf("EventWithVenue");
  console.log(JSON.stringify(t.slice(i - 50, i + 250)));
}