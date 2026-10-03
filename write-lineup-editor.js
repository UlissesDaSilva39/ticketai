const fs = require("fs");
const content = `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Artist = {
  name: string;
  time?: string;
  photo?: string;
  bio?: string;
};

export default function LineupEditor({
  eventId,
  initialLineup,
}: {
  eventId: string;
  initialLineup: Artist[];
}) {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>(initialLineup);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const update = (i: number, field: keyof Artist, value: string) => {
    setArtists((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const add = () => {
    setArtists((prev) => [...prev, { name: "", time: "", photo: "", bio: "" }]);
  };

  const remove = (i: number) => {
    setArtists((prev) => prev.filter((_, idx) => idx !== i));
  };

  const move = (i: number, dir: -1 | 1) => {
    setArtists((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const cleaned = artists
        .map((a) => ({
          name: a.name.trim(),
          time: a.time?.trim() || undefined,
          photo: a.photo?.trim() || undefined,
          bio: a.bio?.trim() || undefined,
        }))
        .filter((a) => a.name.length > 0);

      const res = await fetch("/api/events/" + eventId + "/lineup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineup: cleaned }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg("Error: " + (data.error || "Failed"));
        return;
      }
      setArtists(cleaned);
      setMsg("Saved.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {artists.length === 0 && (
        <p className="text-gray-500 text-sm">No artists yet. Add one below.</p>
      )}

      {artists.map((a, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Artist {i + 1}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === artists.length - 1}
                className="px-2 py-1 text-xs border border-gray-300 rounded disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="px-2 py-1 text-xs border border-red-300 text-red-600 rounded"
              >
                Remove
              </button>
            </div>
          </div>

          <input
            value={a.name}
            onChange={(e) => update(i, "name", e.target.value)}
            placeholder="Artist name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={a.time || ""}
              onChange={(e) => update(i, "time", e.target.value)}
              placeholder="Set time (e.g. 20:30)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              value={a.photo || ""}
              onChange={(e) => update(i, "photo", e.target.value)}
              placeholder="Photo URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <textarea
            value={a.bio || ""}
            onChange={(e) => update(i, "bio", e.target.value)}
            placeholder="Short bio"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          {a.photo && (
            <img
              src={a.photo}
              alt={a.name}
              className="w-24 h-24 object-cover rounded-lg bg-gray-100"
            />
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={add}
          className="px-5 py-2.5 border-2 border-black rounded-full text-sm font-medium hover:bg-gray-50"
        >
          + Add artist
        </button>
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {busy ? "Saving..." : "Save lineup"}
        </button>
        {msg && (
          <span className={"self-center text-sm " + (msg.startsWith("Error") ? "text-red-600" : "text-green-600")}>
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync("components/LineupEditor.tsx", content);
console.log("LineupEditor.tsx written:", content.length, "chars");