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

console.log("RESEND_API_KEY present:", !!env.RESEND_API_KEY);
console.log("RESEND_API_KEY prefix:", env.RESEND_API_KEY ? env.RESEND_API_KEY.slice(0, 6) + "..." : "(missing)");

const resend = new Resend(env.RESEND_API_KEY);

(async () => {
  const { data, error } = await resend.emails.send({
    from: "TicketAI <onboarding@resend.dev>",
    to: "ulissesdasilva39@gmail.com",
    subject: "Test from TicketAI",
    html: "<p>If you're reading this, Resend is configured correctly.</p>",
  });
  if (error) {
    console.log("ERROR:", JSON.stringify(error, null, 2));
  } else {
    console.log("SUCCESS: email id", data.id);
  }
})();