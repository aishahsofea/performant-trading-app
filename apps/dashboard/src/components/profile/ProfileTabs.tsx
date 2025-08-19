"use client";

import { useState } from "react";
import { ProfileForm } from "./ProfileForm";
import { TradingPreferencesForm } from "./TradingPreferencesForm";

type TabType = "profile" | "preferences";

export const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: "👤" },
    { id: "preferences" as TabType, label: "Trading Preferences", icon: "⚙️" },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "profile" && <ProfileForm />}
        {activeTab === "preferences" && <TradingPreferencesForm />}
      </div>
    </div>
  );
};
