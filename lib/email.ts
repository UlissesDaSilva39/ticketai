import { Resend } from "resend";
import { generateTicketPdf } from "./pdf";

const resend = new Resend(process.env.RESEND_API_KEY);

type TicketEmailData = {
  toEmail: string;
  toName: string | null;
  eventTitle: string;
  eventDate: string;
  orderId: string;
  tickets: Array<{
    id: string;
    ticket_type: string;
    price: number;
    qr_code: string;
  }>;
  totalAmount: number;
  attachPdf?: boolean;
};

export async function sendTicketEmail(data: TicketEmailData) {
  console.log("Sending TicketAI email to:", data.toEmail);
  console.log("Resend API key configured:", !!process.env.RESEND_API_KEY);

  const ticketsHtml = data.tickets
    .map(
      (t) =>
        '<tr><td style="padding: 16px; border-bottom: 1px solid #eeeeee;">' +
        '<p style="margin: 0; font-weight: 600; font-size: 16px;">' +
        t.ticket_type +
        "</p>" +
        '<p style="margin: 4px 0 8px 0; font-size: 13px; color: #666;">£' +
        Number(t.price).toFixed(2) +
        "</p>" +
        '<img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=' +
        encodeURIComponent(t.qr_code) +
        '" alt="QR" width="140" height="140" style="display: block; background: #f5f5f5; padding: 8px; border-radius: 8px;" />' +
        '<p style="margin: 12px 0 0 0; font-family: monospace; font-size: 11px; color: #999;">' +
        t.qr_code +
        "</p>" +
        "</td></tr>"
    )
    .join("");

  const html =
    '<!DOCTYPE html><html><body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; background: #f5f5f5;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background: #f5f5f5; padding: 40px 20px;"><tr><td align="center">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 12px; overflow: hidden;">' +
    '<tr><td style="background: #00FF87; padding: 40px 32px; text-align: center;">' +
    '<h1 style="margin: 0; font-size: 42px; font-weight: 700; letter-spacing: -1px; color: #000;">YOU ARE IN!</h1>' +
    '<p style="margin: 8px 0 0 0; font-size: 16px; color: #000;">Your tickets are confirmed</p>' +
    "</td></tr>" +
    '<tr><td style="padding: 32px;"><h2 style="margin: 0 0 4px 0; font-size: 24px;">' +
    data.eventTitle +
    '</h2><p style="margin: 0; color: #666; font-size: 14px;">' +
    data.eventDate +
    "</p></td></tr>" +
    '<tr><td style="padding: 0 32px;"><h3 style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999;">Your Tickets</h3></td></tr>' +
    '<tr><td style="padding: 0 32px;"><table width="100%" cellpadding="0" cellspacing="0">' +
    ticketsHtml +
    "</table></td></tr>" +
    '<tr><td style="padding: 32px;"><table width="100%" style="background: #f5f5f5; border-radius: 8px; padding: 20px;">' +
    '<tr><td style="font-size: 14px; color: #666;">Total paid</td>' +
    '<td style="text-align: right; font-size: 20px; font-weight: 700;">£' +
    data.totalAmount.toFixed(2) +
    "</td></tr>" +
    "</table></td></tr>" +
    '<tr><td style="padding: 0 32px 32px 32px;">' +
    '<a href="https://ticketai.org.uk/my-tickets/print" style="display: inline-block; background: #000; color: #fff; padding: 16px 32px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 15px; margin-right: 12px;">Print Tickets</a>' +
    '<a href="https://ticketai.org.uk/my-tickets" style="display: inline-block; background: #fff; color: #000; padding: 16px 32px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 15px; border: 2px solid #000;">View My Tickets</a>' +
    "</td></tr>" +
    '<tr><td style="background: #f9f9f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #999;">' +
    '<p style="margin: 0;">TicketAI · AI-powered ticketing</p>' +
    '<p style="margin: 8px 0 0 0;">Order ' +
    data.orderId.slice(0, 8).toUpperCase() +
    "</p></td></tr>" +
    "</table></td></tr></table></body></html>";

  const attachments: Array<{ filename: string; content: Buffer }> = [];

  if (data.attachPdf !== false) {
    try {
      const pdf = await generateTicketPdf({
        eventTitle: data.eventTitle,
        eventDate: data.eventDate,
        eventTime: "",
        orderId: data.orderId,
        holderEmail: data.toEmail,
        tickets: data.tickets,
      });

      attachments.push({
        filename: "ticket-" + data.orderId.slice(0, 8) + ".pdf",
        content: pdf,
      });

      console.log("Ticket PDF generated successfully");
    } catch (pdfErr) {
      console.error("PDF generation failed:", pdfErr);
    }
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: "TicketAI <onboarding@resend.dev>",
      to: data.toEmail,
      subject: "Your tickets for " + data.eventTitle,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error("=================================");
      console.error("RESEND EMAIL ERROR");
      console.error("=================================");
      console.error(JSON.stringify(error, null, 2));
      throw new Error("Resend email failed: " + error.message);
    }

    console.log("TicketAI email sent successfully:", result);
    return result;
  } catch (err) {
    console.error("=================================");
    console.error("RESEND SEND EXCEPTION");
    console.error("=================================");
    console.error(err);
    throw err;
  }
}

type ResaleEmailData = {
  toEmail: string;
  eventTitle: string;
  eventDate: string;
  ticketType: string;
  price: number;
  claimUrl: string;
  expiresAt: string;
};

export async function sendResaleNotification(data: ResaleEmailData) {
  const expiresFormatted = new Date(data.expiresAt).toLocaleString("en-GB");

  const html =
    '<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#f5f5f5;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;"><tr><td align="center">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:12px;overflow:hidden;">' +
    '<tr><td style="background:#00FF87;padding:40px 32px;text-align:center;">' +
    '<h1 style="margin:0;font-size:42px;font-weight:700;letter-spacing:-1px;color:#000;">A TICKET IS WAITING</h1>' +
    '<p style="margin:8px 0 0 0;font-size:16px;color:#000;">Face value resale</p>' +
    '</td></tr>' +
    '<tr><td style="padding:32px;">' +
    '<h2 style="margin:0 0 4px 0;font-size:24px;">' +
    data.eventTitle +
    '</h2><p style="margin:0;color:#666;font-size:14px;">' +
    data.eventDate +
    '</p></td></tr>' +
    '<tr><td style="padding:0 32px 32px 32px;">' +
    '<p style="font-size:15px;line-height:1.6;">You are next on the waitlist. A ticket for <strong>' +
    data.eventTitle +
    '</strong> has just been returned by its original owner.</p>' +
    '<p style="font-size:15px;line-height:1.6;">Ticket type: <strong>' +
    data.ticketType +
    '</strong><br>Price: <strong>£' +
    data.price.toFixed(2) +
    '</strong> (original face value)</p>' +
    '<p style="font-size:14px;color:#999;">This link expires on ' +
    expiresFormatted +
    '. First come, first served.</p>' +
    '<a href="' +
    data.claimUrl +
    '" style="display:inline-block;margin-top:16px;background:#000;color:#fff;padding:16px 32px;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;">Claim Ticket</a>' +
    '</td></tr>' +
    '<tr><td style="background:#f9f9f9;padding:24px 32px;text-align:center;font-size:12px;color:#999;">' +
    '<p style="margin:0;">TicketAI · Face value resale</p>' +
    '</td></tr>' +
    '</table></td></tr></table></body></html>';

  try {
    const { error } = await resend.emails.send({
      from: "TicketAI <onboarding@resend.dev>",
      to: data.toEmail,
      subject: "A ticket just became available - " + data.eventTitle,
      html,
    });

    if (error) {
      console.error("RESEND RESALE EMAIL ERROR:");
      console.error(JSON.stringify(error, null, 2));
      throw new Error("Resend resale email failed: " + error.message);
    }

    console.log("Resend resale email sent successfully");
  } catch (err) {
    console.error("Resend resale send exception:", err);
    throw err;
  }
}


type FriendRequestEmailData = {
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
    ? `${data.siteUrl}/u/${data.fromUsername}`
    : `${data.siteUrl}/notifications`;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
      <h1 style="font-size: 22px; margin: 0 0 16px 0;">New friend request</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
        <strong>${data.fromName}</strong> wants to be your friend on TicketAI.
      </p>
      <a href="${data.siteUrl}/notifications" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 600;">Review request</a>
      <p style="font-size: 13px; color: #888; margin: 24px 0 0 0;">
        You can also view their profile at <a href="${profileUrl}" style="color: #555;">${profileUrl}</a>.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "TicketAI <onboarding@resend.dev>",
      to: data.toEmail,
      subject: `${data.fromName} wants to be your friend on TicketAI`,
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
    ? `${data.siteUrl}/u/${data.accepterUsername}`
    : data.siteUrl;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111;">
      <h1 style="font-size: 22px; margin: 0 0 16px 0;">You have a new friend</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
        <strong>${data.accepterName}</strong> accepted your friend request on TicketAI.
      </p>
      <a href="${profileUrl}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 600;">View their profile</a>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "TicketAI <onboarding@resend.dev>",
      to: data.toEmail,
      subject: `${data.accepterName} is now your friend on TicketAI`,
      html,
    });
    console.log("Friend accepted email sent to", data.toEmail);
  } catch (e) {
    console.error("Friend accepted email failed:", e);
  }
}
