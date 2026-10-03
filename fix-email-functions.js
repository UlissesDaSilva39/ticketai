const fs = require("fs");
const p = "lib/email.ts";
let t = fs.readFileSync(p, "utf8");

// Find where the friend request email function starts
const startMarker = "export async function sendFriendRequestEmail";
const idx = t.indexOf(startMarker);
if (idx < 0) {
  console.log("sendFriendRequestEmail not found.");
  process.exit(1);
}

// Keep everything before it
const before = t.slice(0, idx);

// Remove the FriendRequestEmailData type if it exists right before
const typeMarker = "type FriendRequestEmailData = {";
const typeIdx = before.lastIndexOf(typeMarker);
const cleanBefore = typeIdx >= 0 ? before.slice(0, typeIdx) : before;

// Write new replacement
const replacement = `type FriendRequestEmailData = {
  toEmail: string;
  toName: string | null;
  fromName: string;
  fromUsername: string | null;
  siteUrl: string;
};

export async function sendFriendRequestEmail(data: FriendRequestEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Resend not configured; skipping friend request email.");
    return;
  }
  const profileUrl = data.fromUsername
    ? \`\${data.siteUrl}/u/\${data.fromUsername}\`
    : \`\${data.siteUrl}/notifications\`;

  const html = \`
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
      <h1 style="font-size: 22px; margin: 0 0 16px 0;">New friend request</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
        <strong>\${data.fromName}</strong> wants to be your friend on TicketAI.
      </p>
      <a href="\${data.siteUrl}/notifications" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 600;">Review request</a>
      <p style="font-size: 13px; color: #888; margin: 24px 0 0 0;">
        You can also view their profile at <a href="\${profileUrl}" style="color: #555;">\${profileUrl}</a>.
      </p>
    </div>
  \`;

  try {
    await resend.emails.send({
      from: "TicketAI <onboarding@resend.dev>",
      to: data.toEmail,
      subject: \`\${data.fromName} wants to be your friend on TicketAI\`,
      html,
    });
    console.log("Friend request email sent to", data.toEmail);
  } catch (e) {
    console.error("Friend request email failed:", e);
  }
}

type FriendAcceptedEmailData = {
  toEmail: string;
  toName: string | null;
  accepterName: string;
  accepterUsername: string | null;
  siteUrl: string;
};

export async function sendFriendAcceptedEmail(data: FriendAcceptedEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Resend not configured; skipping friend accepted email.");
    return;
  }
  const profileUrl = data.accepterUsername
    ? \`\${data.siteUrl}/u/\${data.accepterUsername}\`
    : data.siteUrl;

  const html = \`
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
      <h1 style="font-size: 22px; margin: 0 0 16px 0;">You have a new friend</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
        <strong>\${data.accepterName}</strong> accepted your friend request on TicketAI.
      </p>
      <a href="\${profileUrl}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 600;">View their profile</a>
    </div>
  \`;

  try {
    await resend.emails.send({
      from: "TicketAI <onboarding@resend.dev>",
      to: data.toEmail,
      subject: \`\${data.accepterName} is now your friend on TicketAI\`,
      html,
    });
    console.log("Friend accepted email sent to", data.toEmail);
  } catch (e) {
    console.error("Friend accepted email failed:", e);
  }
}
`;

fs.writeFileSync(p, cleanBefore + replacement);
console.log("Friend email functions rewritten using template literals.");
console.log("New file size:", (cleanBefore + replacement).length, "chars");