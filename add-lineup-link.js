const fs = require("fs");
const p = "app/organizer/events/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (t.includes("/lineup") && t.includes("Manage lineup")) {
  console.log("Link already present.");
  process.exit(0);
}

// Look for a natural insertion point — the first heading, or a "Back to" link
const candidates = [
  /(<h1[^>]*>[\s\S]*?<\/h1>)/,                        // after first h1
  /(<Link[\s\S]*?Back to[\s\S]*?<\/Link>)/,           // after back link
  /(<div className="max-w-[^"]*mx-auto[^"]*">)/,      // after main container opens
];

let inserted = false;
for (const rx of candidates) {
  const m = t.match(rx);
  if (m) {
    const insert = m[1] + `

      <Link
        href={"/organizer/events/" + params.id + "/lineup"}
        className="inline-block mt-4 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800"
      >
        Manage lineup
      </Link>
`;
    t = t.replace(m[1], insert);
    inserted = true;
    console.log("Manage lineup link inserted after", rx.toString().slice(0, 40));
    break;
  }
}

if (!inserted) {
  console.log("No anchor found. Paste the file contents.");
  process.exit(1);
}

if (!t.includes("import Link")) {
  t = 'import Link from "next/link";\n' + t;
  console.log("Link import added.");
}

fs.writeFileSync(p, t);
console.log("File saved.");