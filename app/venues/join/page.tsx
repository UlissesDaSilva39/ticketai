"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function VenueJoinPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [venueType, setVenueType] = useState("pub");
  const [city, setCity] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [postcode, setPostcode] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(Boolean(data.user));
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !city.trim()) {
      setError("Venue name and city are required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/venues/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          venue_type: venueType,
          city: city.trim(),
          address_line1: addressLine1.trim() || null,
          postcode: postcode.trim() || null,
          capacity: capacity ? Number(capacity) : null,
          description: description.trim() || null,
          hero_image: heroImage.trim() || null,
          status: "published",
          contact_email: contactEmail.trim() || null,
          contact_phone: contactPhone.trim() || null,
          website: website.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create venue");
      router.push("/venue/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create venue");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!signedIn) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-lg mt-20 text-center">
          <h1
            className="text-5xl font-bold uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Sign in first
          </h1>
          <p className="mt-4 text-gray-600">
            You need an account before you can list a venue.
          </p>
          <Link
            href="/login?next=/venues/join"
            className="mt-8 inline-block rounded-full bg-black text-white px-8 py-4 font-medium hover:bg-gray-800"
          >
            Sign in or create account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/for-venues"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to venue info
        </Link>

        <div className="mt-6 mb-8">
          <h1
            className="text-5xl font-bold uppercase leading-none"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            List your venue
          </h1>
          <p className="mt-4 text-gray-600">
            Free to list. Get discovered by promoters. Takes 5 minutes.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Basics</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Venue name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. The Old Blue Last"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Venue type
                  </label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 bg-white outline-none focus:border-black"
                  >
                    <option value="pub">Pub</option>
                    <option value="club">Club</option>
                    <option value="theatre">Theatre</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="studio">Studio</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Location</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address line 1
                </label>
                <input
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="123 Old Street"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="London"
                    required
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Postcode
                  </label>
                  <input
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="EC1V 9BW"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              Description &amp; photos
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell promoters what makes this venue special."
                  rows={4}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hero image URL
                </label>
                <input
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Paste a link to a photo. You can add more later.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              Contact for promoters
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Promoters will use this to book your venue. Shown on your public
              venue page.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="bookings@yourvenue.com"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+44 20 7946 0000"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourvenue.com"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/"
              className="rounded-lg border px-5 py-3 text-center text-sm font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Creating..." : "List my venue"}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Free forever. No contract. No monthly fee.
          </p>
        </form>
      </div>
    </main>
  );
}