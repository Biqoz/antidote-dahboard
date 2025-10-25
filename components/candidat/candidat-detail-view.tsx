import React from "react";
import { Candidat } from "@/types/candidat";
import { CandidatDetailHeader } from "./detail/candidat-detail-header";
import { CandidatDetailTabs } from "./detail/candidat-detail-tabs";
import { CandidatTabContent } from "./detail/candidat-tab-content";
import { useCandidatTabs } from "@/hooks/use-candidat-tabs";

interface CandidatDetailViewProps {
  candidat: Candidat;
  onBack: () => void;
  onEdit?: (candidat: Candidat) => void;
}

export function CandidatDetailView({
  candidat,
  onBack,
  onEdit,
}: CandidatDetailViewProps) {
  const { activeTab, handleTabChange } = useCandidatTabs();

  return (
    <div className="space-y-6">
      <CandidatDetailHeader
        candidat={candidat}
        onBack={onBack}
        onEdit={onEdit}
      />
      
      <CandidatDetailTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <CandidatTabContent
        candidat={candidat}
        activeTab={activeTab}
      />
    </div>
  );
}
