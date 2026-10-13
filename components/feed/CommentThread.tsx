"use client";

import { useState } from "react";

type Comment = {
  id: string;
  body: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
};

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return sec + "s";
  const min = Math.floor(sec / 60);
  if (min < 60) return min + "m";
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + "h";
  const day = Math.floor(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return day + "d";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function CommentThread({ comments }: { comments: Comment[] }) {
  const [expanded, setExpanded] = useState(false);

  if (comments.length === 0) return null;

  const preview = comments.slice(0, 3);
  const rest = comments.slice(3);
  const visible = expanded ? comments : preview;

  return (
    <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 space-y-2">
      {visible.map((c) => (
        <div key={c.id} className="flex items-start gap-2">
          {c.authorAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.authorAvatar}
              alt={c.authorName}
              className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 shrink-0 mt-0.5" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-700">
              <span className="font-medium">{c.authorName}</span>{" "}
              <span className="text-gray-400">{relTime(c.createdAt)}</span>
            </p>
            <p className="text-xs text-gray-700 mt-0.5 whitespace-pre-wrap">{c.body}</p>
          </div>
        </div>
      ))}

      {!expanded && rest.length > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={"View all " + comments.length + " comments"}
          className="text-xs text-gray-500 hover:text-black font-medium"
        >
          View all {comments.length} comments
        </button>
      ) : null}

      {expanded && rest.length > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          aria-label="Collapse comments"
          className="text-xs text-gray-500 hover:text-black font-medium"
        >
          Hide comments
        </button>
      ) : null}
    </div>
  );
}
