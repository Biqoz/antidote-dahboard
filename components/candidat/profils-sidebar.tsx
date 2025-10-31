"use client";

import React from "react";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Award,
  Target,
  Crosshair,
  Heart,
  Send,
  StickyNote,
  Brain,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfilsSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  candidatsCount?: number;
  className?: string;
  onBackToList?: () => void;
}

const navigationItems = [
  {
    id: "vue-ensemble",
    label: "Vue d'ensemble",
    icon: LayoutDashboard,
  },
  {
    id: "cv",
    label: "CV & Expériences",
    icon: FileText,
  },
  {
    id: "formation",
    label: "Formation",
    icon: GraduationCap,
  },
  {
    id: "specialisation",
    label: "Spécialisations",
    icon: Target,
  },
  {
    id: "competences",
    label: "Compétences",
    icon: Award,
  },
  {
    id: "motivation",
    label: "Motivations",
    icon: Heart,
  },
  {
    id: "jobs-cibles",
    label: "Jobs ciblés",
    icon: Crosshair,
  },
  {
    id: "candidatures",
    label: "Candidature",
    icon: Send,
    count: 12,
  },
  {
    id: "notes",
    label: "Notes",
    icon: StickyNote,
  },
  {
    id: "analyse-ia",
    label: "Talents GPT",
    icon: Brain,
    badge: "Bientôt",
  },
  {
    id: "memoire-ia",
    label: "Mémoire IA",
    icon: Database,
    badge: "Bientôt",
  },
];

export function ProfilsSidebar({
  activeSection = "tous",
  onSectionChange,
  candidatsCount = 0,
  className,
}: ProfilsSidebarProps) {
  return (
    <div
      className={cn(
        "w-64 bg-white border-r border-gray-200 h-full flex flex-col fixed",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Profils</h2>
        </div>
        <p className="text-sm text-gray-600">Gestion des candidats</p>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange?.(item.id)}
              className={cn(
                "w-full justify-start h-auto p-3 text-left",
                isActive
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {item.label}
                    </span>

                    {/* Count badge */}
                    {item.count && candidatsCount > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {candidatsCount}
                      </Badge>
                    )}

                    {/* Custom badge */}
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs text-green-600 border-green-200"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Footer stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Total profils</span>
            <span className="font-medium text-gray-900">{candidatsCount}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Actifs</span>
            <span className="font-medium text-green-600">
              {Math.floor(candidatsCount * 0.7)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">En recherche</span>
            <span className="font-medium text-blue-600">
              {Math.floor(candidatsCount * 0.3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
