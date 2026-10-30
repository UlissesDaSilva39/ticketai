"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Entry = {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  city: string | null;
  status: string;
  created_at: string;
};

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("waitlist")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("waitlist").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    await load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Waitlist</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Approve or reject people requesting access.</p>

      {loading ? <p className="text-gray-500 dark:text-gray-400">Loading...</p> :
       entries.length === 0 ? <p className="text-gray-500 dark:text-gray-400">No entries yet.</p> :
       <div className="space-y-2">
         {entries.map((e) => (
           <div key={e.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 flex justify-between items-center">
             <div>
               <p className="font-semibold">{e.full_name || e.email}</p>
               <p className="text-xs text-gray-500 dark:text-gray-400">{e.email} Â· {e.role} Â· {e.city}</p>
               <p className="text-xs text-gray-400">Status: {e.status} Â· {new Date(e.created_at).toLocaleDateString()}</p>
             </div>
             <div className="flex gap-2">
               <button onClick={() => setStatus(e.id, "approved")} className="px-3 py-1 bg-green-600 text-white rounded text-xs">Approve</button>
               <button onClick={() => setStatus(e.id, "rejected")} className="px-3 py-1 bg-red-600 text-white rounded text-xs">Reject</button>
             </div>
           </div>
         ))}
       </div>
      }
    </div>
  );
}
