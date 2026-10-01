"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 mt-8">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            Contact
          </p>
          <h1
            className="text-6xl md:text-7xl font-bold uppercase leading-none"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Get in touch
          </h1>
          <p className="mt-5 text-lg text-gray-700 max-w-2xl">
            Questions, partnerships, or feedback — we would love to hear from
            you.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <a
            href="mailto:hello@ticketai.app"
            className="rounded-xl border bg-white p-5 hover:border-black transition"
          >
            <p className="text-sm uppercase tracking-widest text-gray-500">
              General
            </p>
            <p className="mt-2 font-medium">hello@ticketai.app</p>
          </a>
          <a
            href="mailto:promoters@ticketai.app"
            className="rounded-xl border bg-white p-5 hover:border-black transition"
          >
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Promoters
            </p>
            <p className="mt-2 font-medium">promoters@ticketai.app</p>
          </a>
          <a
            href="mailto:venues@ticketai.app"
            className="rounded-xl border bg-white p-5 hover:border-black transition"
          >
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Venues
            </p>
            <p className="mt-2 font-medium">venues@ticketai.app</p>
          </a>
        </div>

        {sent ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-10 text-center">
            <h2
              className="text-4xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Message sent
            </h2>
            <p className="mt-3 text-gray-700">
              Thanks, {name}. We will reply within 24 hours on weekdays.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border bg-white p-6 md:p-8 space-y-5"
          >
            <h2 className="text-lg font-semibold">Send us a message</h2>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 bg-white outline-none focus:border-black"
              >
                <option value="General">General</option>
                <option value="Promoters">Promoters</option>
                <option value="Venues">Venues</option>
                <option value="Press">Press</option>
                <option value="Bug report">Bug report</option>
                <option value="Feature request">Feature request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="How can we help?"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send message"}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              We reply within 24 hours on weekdays.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
