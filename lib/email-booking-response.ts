import { Resend } from "resend";

export interface BookingResponseEmailData {
  toEmail: string;
  toName: string;
  artistName: string;
  status: "accepted" | "declined";
  eventDate: string;
  venue?: string | null;
  bookingUrl: string;
}

export async function sendBookingResponseEmail(data: BookingResponseEmailData) {
  const accepted = data.status === "accepted";
  const subject = accepted
    ? "Booking accepted: " + data.artistName
    : "Booking declined: " + data.artistName;
  const heading = accepted ? "Booking accepted" : "Booking declined";
  const intro = accepted
    ? data.artistName + " has accepted your booking request."
    : data.artistName + " has declined your booking request.";
  const eventStr =
    new Date(data.eventDate).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }) + (data.venue ? " - " + data.venue : "");

  const html =
    '<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">' +
    '<h1 style="font-size:22px;font-weight:700;margin:0 0 16px 0">' + heading + '</h1>' +
    '<p style="font-size:15px;color:#333;line-height:1.5">' + intro + '</p>' +
    '<p style="font-size:14px;color:#666;line-height:1.5">' + eventStr + '</p>' +
    '<a href="' + data.bookingUrl + '" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#000;color:#fff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:500">View on GRID</a>' +
    '<p style="font-size:12px;color:#999;margin-top:32px">GRID - The network for music</p>' +
    '</div>';

  const text = heading + "\n\n" + intro + "\n\n" + eventStr + "\n\nView: " + data.bookingUrl;

  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set - skipping booking response email");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || "GRID <noreply@grid.music>",
      to: data.toEmail,
      subject: subject,
      html: html,
      text: text,
    });
  } catch (e) {
    console.error("sendBookingResponseEmail failed:", e);
    throw e;
  }
}
