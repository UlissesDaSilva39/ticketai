const fs = require("fs");
const p = "app/event/[id]/attendees/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

t = t.replace(
  /\{!isSelf && user && \(\s*\n\s*friendId=\{p\.id\}/,
  `{!isSelf && user && (
                  <FriendButton
                    friendId={p.id}`
);

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("FriendButton tag restored.");
} else {
  console.log("FriendButton already present or anchor missed.");
}