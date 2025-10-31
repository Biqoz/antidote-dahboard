import React from "react";
import { Candidat } from "@/types/candidat";
import { CandidatDetailHeader } from "./detail/candidat-detail-header";
import { CandidatTabContent } from "./detail/candidat-tab-content";
import { useCandidatTabs, TabType } from "@/hooks/use-candidat-tabs";

interface CandidatDetailViewProps {
  candidat: Candidat;
  onBack: () => void;
  initialTab?: string;
}

export function CandidatDetailView({
  candidat,
  onBack,
  initialTab,
}: CandidatDetailViewProps) {
  const { activeTab } = useCandidatTabs(initialTab as TabType);

  return (
    <div className="space-y-6">
      <CandidatDetailHeader candidat={candidat} onBack={onBack} />

      <CandidatTabContent candidat={candidat} activeTab={activeTab} />
    </div>
  );
}
