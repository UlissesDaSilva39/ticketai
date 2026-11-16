"use client";
import Link from "next/link";
import { getTracksByArtist } from "@/lib/data/licensedTracks";

interface Props {
  artistId: string;
}

export default function LicenceStatus({ artistId }: Props) {
  const tracks = getTracksByArtist(artistId);
  if (tracks.length === 0) return null;

  const licensed = tracks.filter((t) => t.status === "licensed").length;
  const previewOnly = tracks.filter((t) => t.status === "preview-only").length;
  const pending = tracks.filter((t) => t.status === "pending").length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Licensing status</h3>
        <Link href="/licensing" className="text-[10px] font-bold text-emerald-600 hover:underline">
          Learn more →
        </Link>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-zinc-400">Licensed for UK streaming</span>
          <span className="font-bold text-emerald-600">{licensed} of {tracks.length} tracks</span>
        </div>
        {previewOnly > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-zinc-400">30-second preview only</span>
            <span className="font-bold text-amber-600">{previewOnly} track{previewOnly === 1 ? "" : "s"}</span>
          </div>
        )}
        {pending > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-zinc-400">Awaiting master-owner confirmation</span>
            <span className="font-bold text-gray-500">{pending} track{pending === 1 ? "" : "s"}</span>
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
        <Link href="/licensing" className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 hover:text-emerald-600">
          Request licensing for your catalogue →
        </Link>
      </div>
    </div>
  );
}