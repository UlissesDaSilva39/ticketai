"use client";
import { useState } from "react";

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const CrossIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);

export default function AdminCuratorsPage() {
  const [requests, setRequests] = useState([
    { id: 1, name: "Indie Nation", type: "Playlist Curator", followers: "45.2K", email: "contact@indienation.com", status: "Pending" },
    { id: 2, name: "House Heads", type: "Playlist Curator", followers: "120K", email: "submissions@househeads.co.uk", status: "Pending" },
    { id: 3, name: "Fake Spotify Editorial", type: "Playlist Curator", followers: "2K", email: "scammer@fake.com", status: "Flagged" },
  ]);

  const handleAction = (id: number, newStatus: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen py-12 px-4">
      <div className="max-w-[1000px] mx-auto space-y-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
              <ShieldIcon className="w-6 h-6 text-emerald-600" /> Curator Verification
            </h1>
            <p className="text-sm text-gray-500 mt-1">Admin portal to verify playlist curators before they receive credits.</p>
          </div>
          <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200">Admin Only</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {requests.map((r) => (
              <div key={r.id} className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-gray-500">{r.name[0]}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{r.name}</h3>
                    <p className="text-xs text-gray-500">{r.type} · {r.followers} Followers</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {r.status === "Pending" ? (
                    <>
                      <button onClick={() => handleAction(r.id, "Approved")} className="flex items-center gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors"><CheckIcon className="w-4 h-4" /> Approve</button>
                      <button onClick={() => handleAction(r.id, "Rejected")} className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors"><CrossIcon className="w-4 h-4" /> Reject</button>
                    </>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}