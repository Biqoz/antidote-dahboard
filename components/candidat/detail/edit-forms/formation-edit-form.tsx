import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface FormationEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
  editingItemId?: string | null;
}

export function FormationEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
  editingItemId,
}: FormationEditFormProps) {
  // Déterminer si on ajoute une nouvelle formation ou on édite une existante
  const isAddingNew = editingItemId === "formation-new";
  const editingIndex =
    editingItemId && !isAddingNew
      ? candidat.formations?.findIndex((f) => f.id === editingItemId) ?? -1
      : -1;

  // Initialiser la formation selon le contexte
  const [formation, setFormation] = useState(() => {
    if (isAddingNew) {
      return {
        id: Date.now().toString(),
        etablissement: "",
        diplome: "",
        niveau: "",
        specialite: "",
        date_debut: "",
        date_fin: "",
        lieu: "",
        mention: "",
      };
    } else if (editingIndex >= 0) {
      return candidat.formations![editingIndex];
    }
    return {
      id: Date.now().toString(),
      etablissement: "",
      diplome: "",
      niveau: "",
      specialite: "",
      date_debut: "",
      date_fin: "",
      lieu: "",
      mention: "",
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateFormationField = (field: string, value: string) => {
    setFormation((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (updateField) {
        // Utiliser updateField si disponible
        const formations = candidat.formations || [];
        let updatedFormations;

        if (isAddingNew) {
          updatedFormations = [...formations, formation];
        } else if (editingIndex >= 0) {
          updatedFormations = [...formations];
          updatedFormations[editingIndex] = formation;
        } else {
          updatedFormations = formations;
        }

        await updateField("formations", updatedFormations);
        alert("Formation mise à jour avec succès");
      } else {
        // Fallback vers Supabase direct
        const formations = candidat.formations || [];
        let updatedFormations;

        if (isAddingNew) {
          updatedFormations = [...formations, formation];
        } else if (editingIndex >= 0) {
          updatedFormations = [...formations];
          updatedFormations[editingIndex] = formation;
        } else {
          updatedFormations = formations;
        }

        const { error } = await supabase
          .from("profils")
          .update({
            formations: updatedFormations,
            updated_at: new Date().toISOString(),
          })
          .eq("id", candidat.id);

        if (error) throw error;
        alert("Formation mise à jour avec succès");
      }

      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de la formation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium">
          {isAddingNew ? "Nouvelle formation" : "Modifier la formation"}
        </h4>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="etablissement">Établissement</Label>
            <Input
              id="etablissement"
              value={formation.etablissement}
              onChange={(e) =>
                updateFormationField("etablissement", e.target.value)
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="diplome">Diplôme</Label>
            <Input
              id="diplome"
              value={formation.diplome}
              onChange={(e) => updateFormationField("diplome", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="niveau">Niveau</Label>
            <Input
              id="niveau"
              value={formation.niveau}
              onChange={(e) => updateFormationField("niveau", e.target.value)}
              placeholder="bac, bac+2, bac+3, bac+5, doctorat"
              required
            />
          </div>
          <div>
            <Label htmlFor="specialite">Spécialité</Label>
            <Input
              id="specialite"
              value={formation.specialite || ""}
              onChange={(e) =>
                updateFormationField("specialite", e.target.value)
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date_debut">Date de début</Label>
            <Input
              id="date_debut"
              type="date"
              value={formation.date_debut}
              onChange={(e) =>
                updateFormationField("date_debut", e.target.value)
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="date_fin">Date de fin</Label>
            <Input
              id="date_fin"
              type="date"
              value={formation.date_fin}
              onChange={(e) => updateFormationField("date_fin", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lieu">Lieu</Label>
            <Input
              id="lieu"
              value={formation.lieu || ""}
              onChange={(e) => updateFormationField("lieu", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="mention">Mention</Label>
            <Input
              id="mention"
              value={formation.mention || ""}
              onChange={(e) => updateFormationField("mention", e.target.value)}
            />
          </div>
        </div>
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
