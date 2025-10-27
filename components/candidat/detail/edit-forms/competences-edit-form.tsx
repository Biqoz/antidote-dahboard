import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface CompetencesEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
  editingItemId?: string | null;
}

export function CompetencesEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
  editingItemId,
}: CompetencesEditFormProps) {
  // Déterminer si on ajoute une nouvelle compétence ou on édite une existante
  const isAddingNew = editingItemId === "competences-new";
  const editingIndex =
    editingItemId && !isAddingNew
      ? candidat.competences?.findIndex(
          (_, index) => `competence-${index}` === editingItemId
        ) ?? -1
      : -1;

  // Initialiser la compétence selon le contexte
  const [competence, setCompetence] = useState(() => {
    if (isAddingNew) {
      return "";
    } else if (editingIndex >= 0) {
      return candidat.competences![editingIndex];
    }
    return "";
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateCompetenceField = (value: string) => {
    setCompetence(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (updateField) {
        // Utiliser updateField si disponible
        const competences = candidat.competences || [];
        let updatedCompetences;

        if (isAddingNew) {
          updatedCompetences = [...competences, competence].filter(
            (c) => c.trim() !== ""
          );
        } else if (editingIndex >= 0) {
          updatedCompetences = [...competences];
          updatedCompetences[editingIndex] = competence;
          updatedCompetences = updatedCompetences.filter(
            (c) => c.trim() !== ""
          );
        } else {
          updatedCompetences = competences;
        }

        await updateField("competences", updatedCompetences);
        alert("Compétence mise à jour avec succès");
      } else {
        // Fallback vers Supabase direct
        const competences = candidat.competences || [];
        let updatedCompetences;

        if (isAddingNew) {
          updatedCompetences = [...competences, competence].filter(
            (c) => c.trim() !== ""
          );
        } else if (editingIndex >= 0) {
          updatedCompetences = [...competences];
          updatedCompetences[editingIndex] = competence;
          updatedCompetences = updatedCompetences.filter(
            (c) => c.trim() !== ""
          );
        } else {
          updatedCompetences = competences;
        }

        const { error } = await supabase
          .from("profils")
          .update({
            competences: updatedCompetences,
            updated_at: new Date().toISOString(),
          })
          .eq("id", candidat.id);

        if (error) throw error;
        alert("Compétence mise à jour avec succès");
      }

      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de la compétence");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>
          {isAddingNew ? "Nouvelle compétence" : "Modifier la compétence"}
        </Label>
      </div>

      <div className="space-y-4">
        <Input
          value={competence}
          onChange={(e) => updateCompetenceField(e.target.value)}
          placeholder="Nom de la compétence"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
