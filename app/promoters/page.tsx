import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PromotersPage() {
  const supabase = await createServerSupabase();

  const { data: promoters } = await supabase
    .from("promoters")
    .select("*")
    .order("created_at", { ascending: false });

  const list = promoters || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1
        className="text-6xl md:text-7xl font-bold mb-3 uppercase tracking-tight"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        PROMOTERS
      </h1>
      <p className="text-gray-500 mb-10 max-w-2xl">
        Creators who bring audiences to events. Get paid for every ticket sold through your unique code.
      </p>

      <div className="mb-10">
        <Link
          href="/promoter/dashboard"
          className="inline-block px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800"
        >
          Promoter Dashboard
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-lg text-gray-500">
            No promoters yet. Be the first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-xl mb-1">{p.display_name}</h3>
              {p.city && (
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                  {p.city}
                </p>
              )}
              {p.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{p.bio}</p>
              )}
              <div className="flex flex-wrap gap-2 text-xs">
                {p.instagram && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    IG @{p.instagram}
                  </span>
                )}
                {p.tiktok && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    TikTok @{p.tiktok}
                  </span>
                )}
                {p.youtube && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    YT {p.youtube}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

