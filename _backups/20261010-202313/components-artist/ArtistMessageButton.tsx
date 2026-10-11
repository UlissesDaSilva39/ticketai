"use client";

import { useEffect, useState } from "react";

import { MessageCircle } from 'lucide-react';
type Props = {
  artistSlug: string;
  artistName: string;
};

export default function ArtistMessageButton({ artistSlug, artistName }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/artists/" + artistSlug + "/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Send failed");
      }
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Get in touch
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Want to book, collaborate, or just say hi? Send a direct message.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition"
        >
          <MessageCircle className="h-4 w-4" />  Message the artist
        </button>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Message {artistName}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-black text-xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Your name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="Your email *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
              />
              <textarea
                required
                rows={5}
                placeholder="Message *"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none resize-y"
              />

              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
              {success && (
                <p className="text-sm text-green-900 bg-green-50 border border-green-200 p-3 rounded-lg">
                  Message sent.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
