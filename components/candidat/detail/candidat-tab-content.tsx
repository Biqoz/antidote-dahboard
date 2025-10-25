import React from "react";
import { Candidat } from "@/types/candidat";
import { TabType } from "@/hooks/use-candidat-tabs";
import {
  CvTab,
  JobsTab,
  ExperienceTab,
  FormationTab,
  CompetencesTab,
  AnalyseTab,
  DefaultTab,
} from "./tabs";

interface CandidatTabContentProps {
  candidat: Candidat;
  activeTab: TabType;
}

export function CandidatTabContent({
  candidat,
  activeTab,
}: CandidatTabContentProps) {
  switch (activeTab) {
    case "cv":
      return <CvTab candidat={candidat} />;
    case "jobs":
      return <JobsTab candidat={candidat} />;
    case "experience":
      return <ExperienceTab candidat={candidat} />;
    case "formation":
      return <FormationTab candidat={candidat} />;
    case "competences":
      return <CompetencesTab candidat={candidat} />;
    case "analyse":
      return <AnalyseTab candidat={candidat} />;
    case "specialisation":
      return <DefaultTab title="Spécialisation" />;
    case "reconnaissance":
      return <DefaultTab title="Reconnaissance" />;
    case "motivation":
      return <DefaultTab title="Motivation" />;
    case "notes":
      return <DefaultTab title="Notes" />;
    case "candidatures":
      return <DefaultTab title="Candidatures" />;
    default:
      return <DefaultTab title="Contenu à venir" />;
  }
}
