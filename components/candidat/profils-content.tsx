import React, { useState } from "react";
import { useCandidats } from "@/hooks/use-candidats";
import { Candidat } from "@/types/candidat";
import { CandidatDetailView } from "./candidat-detail-view";
import { CandidatList } from "./candidat-list";
import { CandidatSearch } from "./candidat-search";
import { TabType } from "@/hooks/use-candidat-tabs";

interface ProfilsContentProps {
  viewMode: "list" | "detail";
  activeSection?: string;
  selectedProfil?: Candidat | null;
  onProfilSelect?: (profil: Candidat) => void;
  onBackToList?: () => void;
  onEditCandidat?: (candidat: Candidat) => void;
}

export function ProfilsContent({
  viewMode,
  activeSection = "vue-ensemble",
  selectedProfil,
  onProfilSelect,
  onBackToList,
}: ProfilsContentProps) {
  const { candidats, loading } = useCandidats();
  const [filteredCandidats, setFilteredCandidats] = useState<Candidat[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Utiliser les candidats filtrés si la recherche est active, sinon tous les candidats
  const displayedCandidats = isSearchActive ? filteredCandidats : candidats;

  const renderContent = () => {
    // Mode liste : affichage avec le composant CandidatList
    if (viewMode === "list") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Vivier de talents</h1>
              <p className="text-gray-600 text-sm">
                {displayedCandidats.length} candidat{displayedCandidats.length > 1 ? "s" : ""} 
                {isSearchActive ? " trouvé" + (displayedCandidats.length > 1 ? "s" : "") : " dans le vivier"}
                {isSearchActive && candidats.length !== displayedCandidats.length && (
                  <span> sur {candidats.length} au total</span>
                )}
              </p>
            </div>
          </div>

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
    <div className={`flex-1 ${viewMode === "list" ? "p-8" : "p-6"}`}>
      {renderContent()}
    </div>
  );
}
