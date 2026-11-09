"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, MessageSquare, AtSign, Settings, Check } from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All notifications", icon: Bell },
    { id: "posts", label: "My posts", icon: MessageSquare },
    { id: "mentions", label: "Mentions", icon: AtSign },
    { id: "settings", label: "Notification settings", icon: Settings },
  ];

  // Mock notifications for UI demonstration
  const mockNotifications = [
    { id: 1, type: "post", title: "Sarah Jenkins and 14 others played your latest track", time: "2h ago", unread: true },
    { id: 2, type: "mention", title: "David Chen hyped your track: 'This is exactly the vibe I needed'", time: "1d ago", unread: true },
    { id: 3, type: "system", title: "Beatport News: New royalty payout model announced for 2027", time: "5h ago", unread: false },
    { id: 4, type: "system", title: "GRID Events: 'London Producer Meetup' is happening Nov 14", time: "2d ago", unread: false },
  ];

  const filtered = activeTab === "all" ? mockNotifications : mockNotifications.filter(n => n.type === activeTab.slice(0, -1));

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-4xl px-6 py-16 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <h1 className="text-2xl font-black tracking-tight mb-6">Manage notifications</h1>
          
          <ul className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === t.id ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {t.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "settings" ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
              <div className="space-y-6">
                {[
                  { title: "In-app notifications", desc: "Receive alerts inside GRID" },
                  { title: "Email notifications", desc: "Get email updates for important events" },
                  { title: "Push notifications", desc: "Receive push alerts on your device" }
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{setting.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{setting.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{tabs.find(t => t.id === activeTab)?.label}</h2>
                <button className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1">
                  <Check className="w-3 h-3" /> Mark all as read
                </button>
              </div>
              
              {filtered.length === 0 ? (
                <div className="text-center py-12 border rounded-2xl bg-gray-50 text-gray-500 text-sm">
                  No notifications in this category yet.
                </div>
              ) : (
                filtered.map((n) => (
                  <div key={n.id} className={`p-5 rounded-2xl border transition-colors ${n.unread ? "bg-black/[0.02] border-black/10" : "bg-white border-gray-200"}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${n.unread ? "bg-black" : "bg-transparent"}`} />
                      <div className="flex-1">
                        <p className={`text-sm ${n.unread ? "font-semibold text-black" : "text-gray-600"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}