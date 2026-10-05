const fs = require("fs");
const p = "app/u/[username]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

/* ============================================================
   1. Add MessageButton import
   ============================================================ */
if (!t.includes("MessageButton from")) {
  t = t.replace(
    'import FriendButton from "@/components/FriendButton";',
    'import FriendButton from "@/components/FriendButton";\nimport MessageButton from "@/components/MessageButton";'
  );
  console.log("1. MessageButton import added.");
}

/* ============================================================
   2. Wrap FriendButton in a flex row that also has MessageButton
   ============================================================ */
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
  console.log("2. MessageButton mounted next to FriendButton.");
} else {
  console.log("2. Anchor miss — checking existing block.");
  const i = t.indexOf("<FriendButton");
  console.log(JSON.stringify(t.slice(i - 50, i + 300)));
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}