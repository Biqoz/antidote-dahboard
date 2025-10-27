"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { ProfilsSidebar } from "@/components/candidat/profils-sidebar";
import { ProfilsContent } from "@/components/candidat/profils-content";
import { CandidatForm } from "@/components/candidats/candidats-form";
import { Candidat } from "@/types/candidat";
import { useCandidats } from "@/hooks/use-candidats";

export default function CandidatsPage() {
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedCandidat, setSelectedCandidat] = useState<Candidat | null>(
    null
  );
  const [activeSection, setActiveSection] = useState("vue-ensemble");
  
  // États pour les modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [candidatToEdit, setCandidatToEdit] = useState<Candidat | null>(null);
  
  const { updateCandidat } = useCandidats();

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Vivier", href: "/dashboard/vivier" },
    { label: "Candidats" },
  ];

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleProfilSelect = (candidat: Candidat) => {
    setSelectedCandidat(candidat);
    setViewMode("detail");
    setActiveSection("vue-ensemble");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCandidat(null);
  };

  const handleEditCandidat = (candidat: Candidat) => {
    setCandidatToEdit(candidat);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: Partial<Candidat>) => {
    if (candidatToEdit) {
      try {
        await updateCandidat(candidatToEdit.id, data);
        setIsEditModalOpen(false);
        setCandidatToEdit(null);
      } catch (error) {
        console.error("Erreur lors de la modification:", error);
      }
    }
  };

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-1 h-full">
        {/* Sidebar interne - seulement en mode détail */}
        {viewMode === "detail" && (
          <ProfilsSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            candidatsCount={0}
            className="flex-shrink-0"
            onBackToList={handleBackToList}
          />
        )}

        {/* Contenu principal */}
        <ProfilsContent
          viewMode={viewMode}
          activeSection={activeSection}
          selectedProfil={selectedCandidat}
          onProfilSelect={handleProfilSelect}
          onBackToList={handleBackToList}
          onEditCandidat={handleEditCandidat}
        />
      </div>
      
      {/* Modale de modification */}
      {candidatToEdit && (
        <CandidatForm
          isOpen={isEditModalOpen}
          onToggle={() => setIsEditModalOpen(!isEditModalOpen)}
          onSubmit={handleEditSubmit}
          candidat={candidatToEdit}
          mode="edit"
        />
      )}


    </PageLayout>
  );
}
