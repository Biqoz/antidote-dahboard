import React, { useState } from "react";
import { useCandidats } from "@/hooks/use-candidats";
import { Candidat } from "@/types/candidat";
import { CandidatDetailView } from "./candidat-detail-view";
import { CandidatList } from "./candidat-list";
import { CandidatSearch } from "./candidat-search";
import { TabType } from "@/hooks/use-candidat-tabs";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { CandidatForm } from "@/components/candidats/candidats-form";

interface ProfilsContentProps {
  viewMode: "list" | "detail";
  activeSection?: string;
  selectedProfil?: Candidat | null;
  onProfilSelect?: (profil: Candidat) => void;
  onBackToList?: () => void;
  onEditCandidat?: (candidat: Candidat) => void;
  onCreateSubmit?: (
    candidatData: Omit<Candidat, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  showSidebar?: boolean;
}

export function ProfilsContent({
  viewMode,
  activeSection = "vue-ensemble",
  selectedProfil,
  onProfilSelect,
  onBackToList,
  onCreateSubmit,
  showSidebar = false,
}: ProfilsContentProps) {
  const { candidats, loading } = useCandidats();
  const [filteredCandidats, setFilteredCandidats] = useState<Candidat[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Utiliser les candidats filtrés si la recherche est active, sinon tous les candidats
  const displayedCandidats = isSearchActive ? filteredCandidats : candidats;

  const renderContent = () => {
    // Mode liste : affichage avec le composant CandidatList
    if (viewMode === "list") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Vivier de talents
              </h1>
              <p className="text-gray-600 text-sm">
                {displayedCandidats.length} candidat
                {displayedCandidats.length > 1 ? "s" : ""}
                {isSearchActive
                  ? " trouvé" + (displayedCandidats.length > 1 ? "s" : "")
                  : " dans le vivier"}
                {isSearchActive &&
                  candidats.length !== displayedCandidats.length && (
                    <span> sur {candidats.length} au total</span>
                  )}
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un candidat
            </Button>
          </div>

          {/* Formulaire de création inline */}
          {showCreateForm && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Ajouter un nouveau candidat
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CandidatForm
                isOpen={true}
                onToggle={() => setShowCreateForm(false)}
                onSubmit={async (candidatData) => {
                  await onCreateSubmit?.(candidatData);
                  setShowCreateForm(false);
                }}
                mode="create"
              />
            </div>
          )}

          <CandidatSearch
            candidats={candidats}
            onFilteredCandidats={setFilteredCandidats}
            onSearchStateChange={setIsSearchActive}
          />

          <CandidatList
            candidats={displayedCandidats}
            loading={loading}
            onCandidatSelect={onProfilSelect}
          />
        </div>
      );
    }

    // Mode détail : utilisation du composant CandidatDetailView
    if (!selectedProfil) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun profil sélectionné
            </h2>
            <p className="text-gray-600 mb-4">
              Sélectionnez un candidat pour voir ses détails
            </p>
            <button
              onClick={onBackToList}
              className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      );
    }

    return (
      <CandidatDetailView
        candidat={selectedProfil}
        onBack={onBackToList || (() => {})}
        initialTab={activeSection as TabType}
      />
    );
  };

  return (
    <div className={`flex-1 ${viewMode === "list" ? "p-8" : "p-6"} ${showSidebar ? "ml-64" : ""}`}>
      {renderContent()}
    </div>
  );
}
