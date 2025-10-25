import React from "react";
import { TabType } from "@/hooks/use-candidat-tabs";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Brain,
  Award,
  Heart,
  StickyNote,
  Building2,
} from "lucide-react";

interface CandidatDetailTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "cv", label: "CV", icon: FileText },
  { id: "jobs", label: "Jobs", icon: Building2 },
  { id: "experience", label: "Expérience", icon: Briefcase },
  { id: "formation", label: "Formation", icon: GraduationCap },
  { id: "competences", label: "Compétences", icon: Brain },
  { id: "specialisation", label: "Spécialisation", icon: Award },
  { id: "analyse", label: "Analyse IA", icon: Brain },
  { id: "reconnaissance", label: "Reconnaissance", icon: Award },
  { id: "motivation", label: "Motivation", icon: Heart },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "candidatures", label: "Candidatures", icon: Building2 },
] as const;

export function CandidatDetailTabs({
  activeTab,
  onTabChange,
}: CandidatDetailTabsProps) {
  return (
    <div className="border-b">
      <nav className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-5 gap-2 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg border font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}