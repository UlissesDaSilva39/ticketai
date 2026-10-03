const fs = require("fs");
const p = "lib/email.ts";
let t = fs.readFileSync(p, "utf8");

const startMarker = "type EventReminderEmailData = {";
const endMarker = "export async function sendEventReminderEmail";
const startIdx = t.indexOf(startMarker);

if (startIdx === -1) {
  console.log("Reminder function not found. Skipping.");
  process.exit(0);
}

// Cut off everything from the reminder type/function to the end
const before = t.slice(0, startIdx);

const replacement = `type EventReminderEmailData = {
  toEmail: string;
  toName: string | null;
  eventTitle: string;
  eventDate: string;
  eventUrl: string;
  status: "going" | "interested";
};

export async function sendEventReminderEmail(data: EventReminderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Resend not configured; skipping event reminder.");
    return;
  }

  const intro = data.status === "going"
    ? "You're going. See you there."
    : "You were interested \\u2014 still coming?";

  const html = \`
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
      <h1 style="font-size: 22px; margin: 0 0 16px 0;">Tomorrow: \${data.eventTitle}</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 0 0 8px 0;">
        \${intro}
      </p>
      <p style="font-size: 14px; color: #666; margin: 0 0 24px 0;">\${data.eventDate}</p>
      <a href="\${data.eventUrl}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 600;">View event</a>
    </div>
  \`;

  try {
    await resend.emails.send({
      from: "TicketAI <onboarding@resend.dev>",
      to: data.toEmail,
      subject: \`Tomorrow: \${data.eventTitle}\`,
      html,
    });
    console.log("Reminder sent to", data.toEmail);
  } catch (e) {
    console.error("Reminder email failed:", e);
  }
}
`;

fs.writeFileSync(p, before + replacement);
console.log("Reminder function rewritten cleanly.");