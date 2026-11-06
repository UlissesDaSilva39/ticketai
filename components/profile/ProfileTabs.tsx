'use client';

import { useState } from 'react';

export default function ProfileTabs({ tabs }: { tabs: { key: string, label: string, content: React.ReactNode }[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key);

  return (
    <div>
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-gray-900 dark:text-white border-b-2 border-emerald-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.find((t) => t.key === activeTab)?.content}
      </div>
    </div>
  );
}