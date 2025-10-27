import { useState, useEffect } from "react";

export type TabType =
  | "vue-ensemble"
  | "cv"
  | "experience"
  | "formation"
  | "competences"
  | "specialisation"
  | "jobs-cibles"
  | "reconnaissances"
  | "motivation"
  | "candidatures"
  | "notes"
  | "analyse-ia"
  | "memoire-ia";

export function useCandidatTabs(initialTab: TabType = "vue-ensemble") {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // Mettre à jour activeTab quand initialTab change (navigation sidebar)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    handleTabChange,
  };
}