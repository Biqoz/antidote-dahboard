import React, { useState } from "react";
import { Candidat, Experience } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";


interface ExperienceEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
  editingItemId?: string | null;
}

export function ExperienceEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
  editingItemId,
}: ExperienceEditFormProps) {
  // Déterminer si on édite un élément spécifique ou on ajoute un nouveau
  const isEditingSpecific = editingItemId && editingItemId.startsWith('experience-');
  const isAddingNew = editingItemId === 'new-experience' || editingItemId === 'experience-new';
  const editingIndex = isEditingSpecific && !isAddingNew ? parseInt(editingItemId.split('-')[1]) : -1;

  // État pour l'élément en cours d'édition
  const [experience, setExperience] = useState<Experience>(() => {
    const experiencesArray = candidat.experiences || [];
    if (isEditingSpecific && !isAddingNew && experiencesArray[editingIndex]) {
      return experiencesArray[editingIndex];
    }
    // Nouvel élément
    return {
      id: Date.now().toString(),
      entreprise: "",
      poste: "",
      date_debut: "",
      date_fin: "",
      description: "",
      competences_acquises: [],
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateExperienceField = (field: keyof Experience, value: string | string[]) => {
    setExperience(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentExperiences = candidat.experiences || [];
      let updatedExperiences;

      if (isAddingNew || editingIndex === -1) {
        // Ajouter une nouvelle expérience
        updatedExperiences = [...currentExperiences, experience];
      } else {
        // Modifier une expérience existante
        updatedExperiences = currentExperiences.map((item: Experience, index: number) =>
          index === editingIndex ? experience : item
        );
      }

      if (updateField) {
        await updateField("experiences", updatedExperiences);
        onSuccess();
      } else {
        const { error } = await supabase
          .from("profils")
          .update({
            experiences: updatedExperiences,
            updated_at: new Date().toISOString(),
          })
          .eq("id", candidat.id);

        if (error) throw error;
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de l'expérience");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-lg p-4 space-y-4">
        <h5 className="font-medium">
          {isAddingNew ? "Nouvelle expérience" : "Modifier l'expérience"}
        </h5>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="entreprise">Entreprise</Label>
            <Input
              id="entreprise"
              value={experience.entreprise}
              onChange={(e) =>
                updateExperienceField("entreprise", e.target.value)
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="poste">Poste</Label>
            <Input
              id="poste"
              value={experience.poste}
              onChange={(e) =>
                updateExperienceField("poste", e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date_debut">Date de début</Label>
            <Input
              id="date_debut"
              type="date"
              value={experience.date_debut}
              onChange={(e) =>
                updateExperienceField("date_debut", e.target.value)
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="date_fin">Date de fin</Label>
            <Input
              id="date_fin"
              type="date"
              value={experience.date_fin}
              onChange={(e) =>
                updateExperienceField("date_fin", e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={experience.description}
            onChange={(e) =>
              updateExperienceField("description", e.target.value)
            }
            rows={3}
          />
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
