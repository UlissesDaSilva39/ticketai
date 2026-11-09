"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  const tabs = [
    { id: "notifications", label: "Manage notifications" },
    { id: "about", label: "About" },
    { id: "accessibility", label: "Accessibility" },
    { id: "help", label: "Help Center" },
    { id: "privacy", label: "Privacy & Terms" },
    { id: "ad", label: "Ad Choices" },
    { id: "advertising", label: "Advertising" },
    { id: "business", label: "Business Services" },
    { id: "app", label: "Get the GRID app" },
  ];

  const [activeTab, setActiveTab] = useState(tabParam || "notifications");

  // Update tab if URL changes
  useEffect(() => {
    if (tabParam && tabs.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-4xl px-6 py-16 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <ul className="space-y-1">
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => {
                    setActiveTab(t.id);
                    router.push(`/settings?tab=${t.id}`, { scroll: false });
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === t.id ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-black tracking-tight mb-6">
            {tabs.find(t => t.id === activeTab)?.label || "Settings"}
          </h1>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 min-h-[300px]">
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-6">Choose what updates you want to receive on GRID.</p>
                {["All notifications", "My posts", "Mentions"].map(item => (
                  <label key={item} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-black" />
                    <span className="text-sm font-medium">{item}</span>
                  </label>
                ))}
              </div>
            )}
            {activeTab !== "notifications" && (
              <div className="text-gray-500 text-sm leading-relaxed">
                <p className="mb-4">Welcome to the {tabs.find(t => t.id === activeTab)?.label} section.</p>
                <p>We are currently updating this area. Check back soon for more details about our {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} policies and features.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}