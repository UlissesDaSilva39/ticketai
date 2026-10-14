"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Row = {
  id: string;
  title: string;
  kind: string | null;
  audio_url: string | null;
  cover_url: string | null;
  duration_seconds: number | null;
  play_count: number | null;
};

export default function TrackList({ tracks }: { tracks: Row[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    setError(null);
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error: delErr } = await supabase.from("tracks").delete().eq("id", id);
      if (delErr) throw delErr;
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  if (tracks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-500">
        You have not published any tracks yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
      {tracks.map((t) => (
        <div key={t.id} className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 shrink-0 flex items-center justify-center text-white overflow-hidden">
            {t.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.cover_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold opacity-60">
                {t.title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{t.title}</p>
            <p className="text-xs text-gray-500 truncate">
              {t.kind || "song"}
              {t.duration_seconds ? " - " + t.duration_seconds + "s" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(t.id)}
            disabled={busyId === t.id}
            className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {busyId === t.id ? "Removing..." : "Remove"}
          </button>
        </div>
      ))}
      {error ? <p className="p-3 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
