"use client";

import { useState, ChangeEvent, FormEvent, DragEvent } from "react";

type FormState = {
  artistName: string;
  handle: string;
  email: string;
  phone: string;
  genre: string;
  artistType: string;
  city: string;
  country: string;
  postcode: string;
  bio: string;
  website: string;
  spotify: string;
  instagram: string;
  terms: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

const GENRES = ["House","Techno","Jazz","Folk","Rock","Hip-Hop","Pop","Classical","Other"];
const ARTIST_TYPES = ["Solo artist","Band","DJ","Producer","Collective"];
const SECONDARY = ["House","Techno","Jazz","Folk","Electronic","Ambient","Indie"];

const INITIAL: FormState = {
  artistName: "", handle: "", email: "", phone: "",
  genre: "", artistType: "",
  city: "", country: "", postcode: "",
  bio: "", website: "", spotify: "", instagram: "",
  terms: false,
};

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRx = /^https?:\/\/.+/i;
const handleRx = /^[a-zA-Z0-9._-]{3,}$/;

const inputBase =
  "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 outline-none transition focus:border-black focus:bg-white";
const inputError =
  "border-red-400 bg-red-50 focus:border-red-500";
const labelBase = "block text-sm font-medium text-gray-900 mb-1.5";

export default function ArtistRegisterForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [secondary, setSecondary] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [avatar, setAvatar] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    update(id as keyof FormState, value as any);
  };

  const toggleSecondary = (val: string) =>
    setSecondary((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const readFile = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.artistName.trim()) e.artistName = "Artist name is required";
    if (!form.handle.trim()) e.handle = "Handle is required";
    else if (!handleRx.test(form.handle.trim()))
      e.handle = "Min 3 chars (letters, numbers, . _ -)";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRx.test(form.email.trim())) e.email = "Enter a valid email";
    if (!form.genre) e.genre = "Select a primary genre";
    if (!form.artistType) e.artistType = "Select an artist type";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!form.bio.trim()) e.bio = "Please add a short bio";
    if (form.website && !urlRx.test(form.website.trim()))
      e.website = "Must start with http(s)://";
    if (form.spotify && !urlRx.test(form.spotify.trim()))
      e.spotify = "Must start with http(s)://";
    if (!form.terms) e.terms = "You must accept the terms to continue";
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document
        .querySelector("[data-invalid='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/artists/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, secondaryGenres: secondary, avatar }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Registration failed");
      }

      const json = await res.json();
      if (json?.redirectTo) {
        window.location.href = json.redirectTo;
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        document
          .getElementById("successBanner")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(INITIAL);
    setSecondary([]);
    setErrors({});
    setAvatar(null);
    setSubmitted(false);
  };

  const fieldProps = (key: keyof FormState) => ({
    className: `${inputBase} ${errors[key] ? inputError : ""}`,
    "data-invalid": errors[key] ? "true" : "false",
  });

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
      <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Create your artist profile</h2>
        <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
          Step 1 of 1
        </span>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-8">
        {/* BASIC INFO */}
        <fieldset className="border-0">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Basic information
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="artistName" className={labelBase}>Artist / Band name *</label>
              <input
                id="artistName"
                type="text"
                placeholder="e.g. Neon Hours"
                value={form.artistName}
                onChange={onInput}
                {...fieldProps("artistName")}
              />
              {errors.artistName && (
                <small className="block text-xs text-red-500 mt-1">{errors.artistName}</small>
              )}
            </div>

            <div>
              <label htmlFor="handle" className={labelBase}>Handle / Username *</label>
              <div
                className={`flex items-stretch bg-gray-50 border rounded-xl overflow-hidden transition ${
                  errors.handle ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-black focus-within:bg-white"
                }`}
                data-invalid={errors.handle ? "true" : "false"}
              >
                <span className="grid place-items-center px-3 text-sm text-gray-500 bg-gray-100 border-r border-gray-200">
                  @
                </span>
                <input
                  id="handle"
                  type="text"
                  placeholder="neonhours"
                  value={form.handle}
                  onChange={onInput}
                  className="flex-1 px-3 py-3 bg-transparent text-sm outline-none"
                />
              </div>
              {errors.handle && (
                <small className="block text-xs text-red-500 mt-1">{errors.handle}</small>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className={labelBase}>Contact email *</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={onInput}
                {...fieldProps("email")}
              />
              {errors.email && (
                <small className="block text-xs text-red-500 mt-1">{errors.email}</small>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={labelBase}>Phone number</label>
              <input
                id="phone"
                type="tel"
                placeholder="+44 7000 000000"
                value={form.phone}
                onChange={onInput}
                {...fieldProps("phone")}
              />
            </div>
          </div>
        </fieldset>

        {/* GENRE */}
        <fieldset className="border-0 pt-6 border-t border-dashed border-gray-200">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Genre &amp; style
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="genre" className={labelBase}>Primary genre *</label>
              <select
                id="genre"
                value={form.genre}
                onChange={onInput}
                {...fieldProps("genre")}
              >
                <option value="">Select a genre</option>
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              {errors.genre && (
                <small className="block text-xs text-red-500 mt-1">{errors.genre}</small>
              )}
            </div>

            <div>
              <label htmlFor="artistType" className={labelBase}>Artist type *</label>
              <select
                id="artistType"
                value={form.artistType}
                onChange={onInput}
                {...fieldProps("artistType")}
              >
                <option value="">Select a type</option>
                {ARTIST_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {errors.artistType && (
                <small className="block text-xs text-red-500 mt-1">{errors.artistType}</small>
              )}
            </div>
          </div>

          <div>
            <label className={labelBase}>Secondary genres</label>
            <div className="flex flex-wrap gap-2">
              {SECONDARY.map((g) => {
                const active = secondary.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleSecondary(g)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      active
                        ? "bg-black text-white border-black"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </fieldset>

        {/* LOCATION */}
        <fieldset className="border-0 pt-6 border-t border-dashed border-gray-200">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Location
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className={labelBase}>City *</label>
              <input
                id="city"
                type="text"
                placeholder="London"
                value={form.city}
                onChange={onInput}
                {...fieldProps("city")}
              />
              {errors.city && (
                <small className="block text-xs text-red-500 mt-1">{errors.city}</small>
              )}
            </div>

            <div>
              <label htmlFor="country" className={labelBase}>Country *</label>
              <input
                id="country"
                type="text"
                placeholder="United Kingdom"
                value={form.country}
                onChange={onInput}
                {...fieldProps("country")}
              />
              {errors.country && (
                <small className="block text-xs text-red-500 mt-1">{errors.country}</small>
              )}
            </div>

            <div>
              <label htmlFor="postcode" className={labelBase}>Postcode</label>
              <input
                id="postcode"
                type="text"
                placeholder="EC1A 1BB"
                value={form.postcode}
                onChange={onInput}
                {...fieldProps("postcode")}
              />
            </div>
          </div>
        </fieldset>

        {/* PROFILE */}
        <fieldset className="border-0 pt-6 border-t border-dashed border-gray-200">
          <legend className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Profile details
          </legend>

          <div className="mb-4">
            <label htmlFor="bio" className={labelBase}>Short bio *</label>
            <textarea
              id="bio"
              rows={4}
              maxLength={400}
              placeholder="Tell promoters and fans about your sound, story, and shows..."
              value={form.bio}
              onChange={onInput}
              className={`${inputBase} resize-y min-h-[100px] ${errors.bio ? inputError : ""}`}
              data-invalid={errors.bio ? "true" : "false"}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {form.bio.length} / 400
            </div>
            {errors.bio && (
              <small className="block text-xs text-red-500 mt-1">{errors.bio}</small>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="website" className={labelBase}>Website</label>
              <input
                id="website"
                type="url"
                placeholder="https://yoursite.com"
                value={form.website}
                onChange={onInput}
                {...fieldProps("website")}
              />
              {errors.website && (
                <small className="block text-xs text-red-500 mt-1">{errors.website}</small>
              )}
            </div>

            <div>
              <label htmlFor="spotify" className={labelBase}>Spotify / Streaming link</label>
              <input
                id="spotify"
                type="url"
                placeholder="https://open.spotify.com/artist/..."
                value={form.spotify}
                onChange={onInput}
                {...fieldProps("spotify")}
              />
              {errors.spotify && (
                <small className="block text-xs text-red-500 mt-1">{errors.spotify}</small>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="instagram" className={labelBase}>Instagram</label>
              <div className="flex items-stretch bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-black focus-within:bg-white">
                <span className="grid place-items-center px-3 text-sm text-gray-500 bg-gray-100 border-r border-gray-200">
                  @
                </span>
                <input
                  id="instagram"
                  type="text"
                  placeholder="neonhours"
                  value={form.instagram}
                  onChange={onInput}
                  className="flex-1 px-3 py-3 bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="avatarUpload" className={labelBase}>Profile image</label>
              <div
                onClick={() => document.getElementById("avatarUpload")?.click()}
                onDragOver={(e: DragEvent) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={(e: DragEvent) => {
                  e.preventDefault();
                  setDragging(false);
                }}
                onDrop={(e: DragEvent) => {
                  e.preventDefault();
                  setDragging(false);
                  readFile(e.dataTransfer.files[0]);
                }}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-6 min-h-[110px] grid place-items-center text-center transition ${
                  dragging
                    ? "border-black bg-gray-100"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
              >
                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => readFile(e.target.files?.[0])}
                />
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Preview"
                    className="max-h-32 rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col gap-1.5 text-sm text-gray-500">
                    <span className="text-2xl text-gray-400">+</span>
                    <span>Click to upload or drag an image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </fieldset>

        {/* TERMS */}
        <div className="pt-6 border-t border-dashed border-gray-200">
          <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={(e) => update("terms", e.target.checked)}
              className="mt-0.5 accent-black"
            />
            <span>
              I agree to the <a href="/terms" className="text-black font-medium underline">Terms of Service</a> and{" "}
              <a href="/privacy" className="text-black font-medium underline">Privacy Policy</a>.
            </span>
          </label>
          {errors.terms && (
            <small className="block text-xs text-red-500 mt-2">{errors.terms}</small>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 rounded-full border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register as artist"}
          </button>
        </div>


      </form>
    </section>
  );
}
