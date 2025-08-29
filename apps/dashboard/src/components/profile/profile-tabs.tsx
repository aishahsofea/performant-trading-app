"use client";

import { useState } from "react";
import { Tabs } from "@repo/ui/components";
import { ProfileForm } from "./profile-form";
import { TradingPreferencesForm } from "./trading-preferences-form";
import { PortfolioSettingsForm } from "./portfolio-settings-form";

type TabType = "profile" | "preferences" | "portfolio";

export const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: "👤" },
    { id: "preferences" as TabType, label: "Trading Preferences", icon: "⚙️" },
    { id: "portfolio" as TabType, label: "Portfolio Settings", icon: "📊" },
  ];

  return (
    <Tabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as TabType)}
    >
      {activeTab === "profile" && <ProfileForm />}
      {activeTab === "preferences" && <TradingPreferencesForm />}
      {activeTab === "portfolio" && <PortfolioSettingsForm />}
    </Tabs>
  );
};
