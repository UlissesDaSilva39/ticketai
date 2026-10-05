const fs = require("fs");
const p = "app/u/[username]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Normalize to LF for matching, then write back with LF
t = t.replace(/\r\n/g, "\n");

const oldBlock = `          {!isOwnProfile && user && (
            <FriendButton
              friendId={profile.id}
              initialStatus={
                friendship === "pending" && friendshipIsIncoming
                  ? null
                  : friendship
              }
            />
          )}`;

const newBlock = `          {!isOwnProfile && user && (
            <div className="flex flex-wrap gap-3">
              <FriendButton
                friendId={profile.id}
                initialStatus={
                  friendship === "pending" && friendshipIsIncoming
                    ? null
                    : friendship
                }
              />
              <MessageButton otherUserId={profile.id} />
            </div>
          )}`;

if (t.includes(oldBlock)) {
  t = t.replace(oldBlock, newBlock);
  fs.writeFileSync(p, t);
  console.log("MessageButton mounted next to FriendButton.");
} else {
  console.log("Anchor still missed — showing exact block:");
  const i = t.indexOf("<FriendButton");
  console.log(JSON.stringify(t.slice(i - 60, i + 400)));
}