import { useState } from "react";
import { LoadingState } from "@/components/shared/loading-state";
import { CandidatHeader } from "./candidats-header";
import { CandidatList } from "./candidats-list";
import { CandidatForm } from "./candidats-form";
import { useCandidats } from "@/hooks/use-candidats";
import { Candidat, CreateCandidatData } from "@/types/candidat";

interface CandidatViewProps {
  onCandidatselect: (candidat: Candidat) => void;
}

export function CandidatView({ onCandidatselect }: CandidatViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidat, setEditingCandidat] = useState<Candidat | null>(null);
  const {
    candidats,
    stats,
    loading,
    createCandidat,
    updateCandidat,
    deleteCandidat,
    refreshCandidats,
  } = useCandidats();

  const handleNewCandidat = () => {
    setEditingCandidat(null); // Reset editing candidat
    setIsFormOpen(!isFormOpen);
  };

  const handleFormSubmit = async (data: CreateCandidatData) => {
    try {
      if (editingCandidat) {
        // Mode édition
        await updateCandidat(editingCandidat.id, data);
      } else {
        // Mode création
        await createCandidat(data);
      }
      setIsFormOpen(false);
      setEditingCandidat(null);
      await refreshCandidats();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du candidat:", error);
    }
  };

  const handleEdit = (candidat: Candidat) => {
    setEditingCandidat(candidat);
    setIsFormOpen(true);
  };

  const handleDelete = async (candidat: Candidat) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le candidat "${candidat.nom}" ?`
      )
    ) {
      try {
        await deleteCandidat(candidat.id);
        await refreshCandidats();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du client");
      }
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <CandidatHeader
        candidatsCount={stats?.total || 0}
        stats={stats}
        onNewCandidat={handleNewCandidat}
        isFormOpen={isFormOpen}
      />

      <CandidatForm
        isOpen={isFormOpen}
        onToggle={() => setIsFormOpen(!isFormOpen)}
        onSubmit={handleFormSubmit}
        candidat={editingCandidat || undefined}
        mode={editingCandidat ? "edit" : "create"}
      />

      <CandidatList
        candidats={candidats}
        onCandidatselect={onCandidatselect}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
