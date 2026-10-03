const { Resend } = require("resend");
const fs = require("fs");
let raw = fs.readFileSync(".env.local", "utf8");
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const env = {};
for (const line of raw.split(/\r?\n/)) {
  const l = line.trim();
  if (!l || l.startsWith("#")) continue;
  const i = l.indexOf("=");
  if (i < 0) continue;
  env[l.slice(0, i)] = l.slice(i + 1);
}
const resend = new Resend(env.RESEND_API_KEY);

(async () => {
  const { data, error } = await resend.emails.send({
    from: "TicketAI <onboarding@resend.dev>",
    to: "ulissesdasilva39@gmail.com",
    subject: "Charlie wants to be your friend on TicketAI",
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h1 style="font-size: 22px; margin: 0 0 16px 0;">New friend request</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
          <strong>Charlie</strong> wants to be your friend on TicketAI.
        </p>
        <a href="http://localhost:3000/notifications" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 600;">Review request</a>
      </div>
    `,
  });
  if (error) console.log("ERROR:", JSON.stringify(error, null, 2));
  else console.log("Sent! id =", data.id);
})();