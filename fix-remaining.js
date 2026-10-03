const fs = require("fs");

// --- Fix 1: remove the FriendsGoing import + usage ---
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Remove the import line
t = t.replace(/^import FriendsGoing from "@\/components\/FriendsGoing";\n/m, "");

// Remove any <FriendsGoing ... /> usage (if present)
t = t.replace(/<FriendsGoing[\s\S]*?\/>/g, "");

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("FriendsGoing references removed.");
} else {
  console.log("No FriendsGoing references found.");
}

// --- Fix 2: add lineup to the Event type ---
const typesFile = "lib/types.ts";
if (fs.existsSync(typesFile)) {
  let tt = fs.readFileSync(typesFile, "utf8");
  const tbefore = tt;

  if (!tt.includes("LineupArtist")) {
    tt = tt.replace(
      /export type Event = \{/,
      'export type LineupArtist = {\n  name: string;\n  time?: string;\n  photo?: string;\n  bio?: string;\n};\n\nexport type Event = {'
    );
  }
  if (!/lineup\?:/.test(tt)) {
    tt = tt.replace(/  ticket_types\?:/, "  lineup?: LineupArtist[];\n  ticket_types?:");
  }

  if (tt !== tbefore) {
    fs.writeFileSync(typesFile, tt);
    console.log("Event type extended with lineup.");
  } else {
    console.log("Type file unchanged.");
  }
}

// --- Fix 3: replace the escape literal with the actual middle dot ---
let t2 = fs.readFileSync(p, "utf8");
if (t2.includes('\\u00b7')) {
  t2 = t2.split('" \\u00b7 "').join('" \u00b7 "');
  fs.writeFileSync(p, t2);
  console.log("Venue separator fixed to real middle dot.");
} else {
  console.log("No \\u00b7 literal to replace.");
}