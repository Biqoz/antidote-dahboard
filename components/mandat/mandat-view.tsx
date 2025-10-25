import { useState } from "react";
import { MandatHeader } from "./mandat-header";
import { MandatForm } from "./mandat-form";
import { MandatCard } from "./mandat-card";
import { useAllMandats } from "@/hooks/use-all-mandats";
import { Mandat } from "@/types/mandat";
import { MandatService } from "@/services/mandat-service";

interface MandatViewProps {
  onMandatSelect: (mandat: Mandat) => void;
  initialFormOpen?: boolean;
  preSelectedClientId?: string;
}

interface MandatFormData {
  titre: string;
  entreprise_id: string;
  description?: string;
  type_contrat?: "determine" | "indetermine";
  niveau_experience?: string;
  statut: "ouvert" | "en_cours" | "ferme" | "suspendu";
  salaire_min?: number;
  salaire_max?: number;
  localisation?: string;
  date_debut?: string;
  priorite?: "basse" | "normale" | "haute";
  nombre_postes?: number;
}

export function MandatView({
  onMandatSelect,
  initialFormOpen = false,
  preSelectedClientId,
}: MandatViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(initialFormOpen);
  const [editingMandat, setEditingMandat] = useState<Mandat | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mandats, loading, error, refresh } = useAllMandats();

  const handleFormSubmit = async (data: MandatFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Données du formulaire:", data);

      if (editingMandat) {
        // Mode édition
        await MandatService.update(editingMandat.id, data);
        console.log("Mandat mis à jour avec succès");
      } else {
        // Mode création
        await MandatService.create(data);
        console.log("Mandat créé avec succès");
      }

      // Rafraîchir la liste des mandats
      refresh();

      // Fermer le formulaire
      setIsFormOpen(false);
      setEditingMandat(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du mandat:", error);
      // TODO: Afficher un message d'erreur à l'utilisateur
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (mandat: Mandat) => {
    setEditingMandat(mandat);
    setIsFormOpen(true);
  };

  const handleDelete = async (mandatId: string) => {
    try {
      console.log("Suppression du mandat:", mandatId);
      await MandatService.delete(mandatId);
      console.log("Mandat supprimé avec succès");

      // Rafraîchir la liste des mandats
      refresh();
    } catch (error) {
      console.error("Erreur lors de la suppression du mandat:", error);
      // TODO: Afficher un message d'erreur à l'utilisateur
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingMandat(null);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <MandatHeader
        mandatsCount={mandats.length}
        isFormOpen={isFormOpen}
        onNewMandat={() => setIsFormOpen(!isFormOpen)}
      />

      {isFormOpen && (
        <MandatForm
          mandat={editingMandat}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          mode={editingMandat ? "edit" : "create"}
          preSelectedClientId={preSelectedClientId}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mandats.map((mandat) => (
          <MandatCard
            key={mandat.id}
            mandat={mandat}
            onClick={() => onMandatSelect(mandat)}
            onEdit={() => handleEdit(mandat)}
            onDelete={() => handleDelete(mandat.id)}
          />
        ))}
      </div>

      {mandats.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun mandat trouvé</p>
        </div>
      )}
    </div>
  );
}
