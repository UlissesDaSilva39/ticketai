const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

// Add import
if (!t.includes("ShareButtonMini from")) {
  const imp = 'import MiniFollowButton from "@/components/MiniFollowButton";';
  if (t.includes(imp)) {
    t = t.replace(imp, imp + '\nimport ShareButtonMini from "@/components/ShareButtonMini";');
    console.log("ShareButtonMini import added.");
  }
}

// Insert the button next to "Get Tickets" span
const old = `                      <span className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium">Get Tickets</span>`;

const neu = `                      <div className="flex items-center gap-1">
                        <ShareButtonMini
                          url={"https://ticketai.org.uk/event/" + e.id}
                          title={e.title}
                        />
                        <span className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium">Get Tickets</span>
                      </div>`;

if (t.includes(old) && !t.includes("<ShareButtonMini")) {
  t = t.replace(old, neu);
  console.log("ShareButtonMini rendered in cards.");
} else if (t.includes("<ShareButtonMini")) {
  console.log("Already rendered.");
} else {
  console.log("Anchor not found.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}