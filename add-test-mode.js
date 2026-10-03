const fs = require("fs");
const p = "app/api/cron/event-reminders/route.ts";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (t.includes("test mode") || t.includes("searchParams.get(\"test\")")) {
  console.log("Test mode already present.");
  process.exit(0);
}

const anchor = `  const admin = createAdminClient();`;

const testBlock = `  // Test mode: ?test=email@example.com sends a single reminder to that address
  const testEmail = req.nextUrl.searchParams.get("test");
  if (testEmail) {
    await sendEventReminderEmail({
      toEmail: testEmail,
      toName: "Test",
      eventTitle: "Folk & Whisky Festival",
      eventDate: "Thursday, 8 October 2026",
      eventUrl: "http://localhost:3000/event/2a1a8455-e783-468b-8ebd-91210f10a871",
      status: "going",
    });
    return NextResponse.json({ ok: true, test: true, sentTo: testEmail });
  }

  const admin = createAdminClient();`;

if (t.includes(anchor)) {
  t = t.replace(anchor, testBlock);
  fs.writeFileSync(p, t);
  console.log("Test mode added.");
} else {
  console.log("Anchor not found. Paste the top of the route file:");
  console.log(t.slice(0, 800));
}