const fs = require("fs");
const p = "app/organizer/events/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (t.includes("Manage lineup")) {
  console.log("Link already present.");
  process.exit(0);
}

// Detect how the event ID is accessed
let idVar = "id";  // default
if (t.includes("const eventId = ") && !t.includes("const id = ")) idVar = "eventId";
if (t.includes("const { id } = await params")) idVar = "id";

console.log("Using ID variable:", idVar);

// Find the first JSX opening div after "return ("
const returnIdx = t.indexOf("return (");
if (returnIdx === -1) {
  console.log("No return( found.");
  process.exit(1);
}

// Find the first <div after the return
const afterReturn = t.slice(returnIdx);
const divMatch = afterReturn.match(/return \(\s*<div[^>]*>/);
if (!divMatch) {
  console.log("No opening div after return.");
  process.exit(1);
}

const absoluteIdx = returnIdx + divMatch.index + divMatch[0].length;

const buttons = `

      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href={"/organizer/events/" + ${idVar} + "/lineup"}
          className="px-5 py-2.5 border-2 border-black rounded-full text-sm font-medium hover:bg-gray-50"
        >
          Manage lineup
        </Link>
        <Link
          href={"/organizer/events/" + ${idVar} + "/analytics"}
          className="px-5 py-2.5 border-2 border-black rounded-full text-sm font-medium hover:bg-gray-50"
        >
          Analytics
        </Link>
      </div>`;

t = t.slice(0, absoluteIdx) + buttons + t.slice(absoluteIdx);

// Add Link import if missing
if (!t.includes('from "next/link"')) {
  t = 'import Link from "next/link";\n' + t;
  console.log("Link import added.");
}

fs.writeFileSync(p, t);
console.log("Buttons inserted after the opening div of the page.");