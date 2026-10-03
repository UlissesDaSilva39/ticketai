"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  user_id: string;
  created_at: string;
  profiles: { full_name: string | null; username: string | null } | null;
};

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center" style={{ fontSize: size, lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "text-yellow-500" : "text-gray-300"}>
          {"\u2605"}
        </span>
      ))}
    </span>
  );
}

export default function ReviewsSection({
  eventId,
  initialReviews,
  currentUserId,
  canReview,
}: {
  eventId: string;
  initialReviews: Review[];
  currentUserId: string | null;
  canReview: boolean;
}) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mine = reviews.find((r) => r.user_id === currentUserId);
  const avg = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit");
        return;
      }
      setComment("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const removeMine = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/reviews/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-12">
      <h2
        className="text-3xl font-bold mb-4 uppercase"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Reviews
      </h2>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <Stars value={Math.round(avg)} size={22} />
          <span className="font-bold text-lg">{avg.toFixed(1)}</span>
          <span className="text-gray-500 text-sm">
            ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </span>
        </div>
      )}

      {canReview && (
        <form onSubmit={submit} className="mb-8 p-5 border border-gray-200 rounded-2xl">
          <p className="font-semibold mb-3">{mine ? "Update your review" : "Leave a review"}</p>
          <div className="mb-3">
            <Stars value={rating} size={26} />
            <div className="flex gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={"px-2 py-1 text-xs rounded border " + (rating === n ? "bg-black text-white border-black" : "border-gray-300 hover:bg-gray-50")}
                >
                  {n}{"\u2605"}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={mine?.comment || "What did you think?"}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
          />
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50"
            >
              {busy ? "Saving..." : mine ? "Update" : "Post"}
            </button>
            {mine && (
              <button
                type="button"
                onClick={removeMine}
                disabled={busy}
                className="px-5 py-2 border-2 border-black text-sm font-medium rounded-full hover:bg-gray-50"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first.</p>
      ) : (
        <ul className="space-y-5">
          {reviews.map((r) => {
            const name = r.profiles?.full_name || r.profiles?.username || "Someone";
            const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            const date = new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
            return (
              <li key={r.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{name}</span>
                    <Stars value={r.rating} />
                    <span className="text-xs text-gray-400">{date}</span>
                  </div>
                  {r.comment && <p className="text-gray-700 text-sm">{r.comment}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
