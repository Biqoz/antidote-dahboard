import { useState } from "react";

export type TabType =
  | "cv"
  | "jobs"
  | "experience"
  | "formation"
  | "competences"
  | "specialisation"
  | "analyse"
  | "reconnaissance"
  | "motivation"
  | "notes"
  | "candidatures";

export function useCandidatTabs(initialTab: TabType = "cv") {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    handleTabChange,
  };
}