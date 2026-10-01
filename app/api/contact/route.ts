import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const { name, email, subject, message } = (body ?? {}) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.log("Contact form (no RESEND key):", {
        name,
        email,
        subject,
        message,
      });
      return NextResponse.json({ ok: true });
    }

    await resend.emails.send({
      from: "TicketAI Contact <onboarding@resend.dev>",
      to: "hello@ticketai.app",
      replyTo: email,
      subject: "[Contact] " + subject,
      text:
        "From: " +
        name +
        " <" +
        email +
        ">\n\n" +
        "Subject: " +
        subject +
        "\n\n" +
        message,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    const msg = err instanceof Error ? err.message : "Failed to send";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}