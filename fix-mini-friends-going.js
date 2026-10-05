const fs = require("fs");
const p = "components/MiniFriendsGoing.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

const oldBlock = `      <a
        href={"/event/" + eventId + "/attendees"}
        className="text-xs text-gray-600 hover:text-black"
      >
        {text} · See all {totalCount}
      </a>`;

const newBlock = `      <span className="text-xs text-gray-600">
        {text} · {totalCount} going
      </span>`;

if (t.includes(oldBlock)) {
  t = t.replace(oldBlock, newBlock);
  fs.writeFileSync(p, t);
  console.log("MiniFriendsGoing: <a> replaced with <span>.");
} else {
  console.log("Anchor not found — checking variant.");
  // Fallback
  const re = /<a[\s\S]*?href=\{["']\/event\/["']\s*\+\s*eventId[\s\S]*?<\/a>/;
  if (re.test(t)) {
    t = t.replace(re, newBlock);
    fs.writeFileSync(p, t);
    console.log("MiniFriendsGoing: <a> replaced with <span> (loose).");
  } else {
    console.log("Could not find the block. Showing what's there:");
    const i = t.indexOf("eventId");
    console.log(JSON.stringify(t.slice(i - 100, i + 500)));
  }
}