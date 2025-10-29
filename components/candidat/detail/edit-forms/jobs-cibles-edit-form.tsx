import React, { useState } from "react";
import { Candidat, JobCible } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface JobsCiblesEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
  editingItemId?: string | null;
}

export function JobsCiblesEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
  editingItemId,
}: JobsCiblesEditFormProps) {
  // Déterminer si on édite un élément spécifique ou on ajoute un nouveau
  const isEditingSpecific = editingItemId && editingItemId.startsWith("job-cible-");
  const isAddingNew = editingItemId === "job-cible-new";
  const editingIndex = isEditingSpecific && !isAddingNew ? parseInt(editingItemId.split("-")[2]) : -1;

  // Gérer les jobs ciblés qui peuvent être stockés comme string JSON ou array
  let jobsCiblesArray: JobCible[] = [];
  try {
    if (Array.isArray(candidat.jobs_cibles)) {
      jobsCiblesArray = candidat.jobs_cibles;
    } else if (typeof candidat.jobs_cibles === "string") {
      jobsCiblesArray = JSON.parse(candidat.jobs_cibles);
    } else if (candidat.jobs_cibles) {
      jobsCiblesArray = [candidat.jobs_cibles];
    }
  } catch (error) {
    console.error("Erreur lors du parsing des jobs ciblés:", error);
    jobsCiblesArray = [];
  }

  // État pour l'élément en cours d'édition
  const [jobCible, setJobCible] = useState<JobCible>(() => {
    if (isEditingSpecific && !isAddingNew && jobsCiblesArray[editingIndex]) {
      return jobsCiblesArray[editingIndex];
    }
    // Nouvel élément
    return {
      id: Date.now().toString(),
      titre: "",
      description: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobCible.titre.trim()) {
      alert("Le titre du job ciblé est requis");
      return;
    }

    setIsLoading(true);

    try {
      let updatedJobsCibles: JobCible[];

      if (isAddingNew) {
        // Ajouter un nouveau job ciblé
        updatedJobsCibles = [...jobsCiblesArray, {
          ...jobCible,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }];
      } else if (isEditingSpecific && editingIndex >= 0) {
        // Modifier un job ciblé existant
        updatedJobsCibles = [...jobsCiblesArray];
        updatedJobsCibles[editingIndex] = {
          ...jobCible,
          updated_at: new Date().toISOString(),
        };
      } else {
        throw new Error("Mode d'édition non reconnu");
      }

      if (updateField) {
        await updateField("jobs_cibles", updatedJobsCibles);
      } else {
        // Fallback vers Supabase direct
        const { error } = await supabase
          .from("profils")
          .update({
            jobs_cibles: updatedJobsCibles,
            updated_at: new Date().toISOString(),
          })
          .eq("id", candidat.id);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du job ciblé");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium">
          {isAddingNew ? "Ajouter un job ciblé" : "Modifier le job ciblé"}
        </h4>
      </div>

      {/* Titre du job */}
      <div>
        <Label htmlFor="titre">Titre du poste ciblé *</Label>
        <Input
          id="titre"
          value={jobCible.titre}
          onChange={(e) => setJobCible({ ...jobCible, titre: e.target.value })}
          placeholder="Ex: Développeur Full Stack, Chef de projet..."
          required
        />
      </div>

      {/* Description des aspirations */}
      <div>
        <Label htmlFor="description">Description des aspirations</Label>
        <Textarea
          id="description"
          value={jobCible.description}
          onChange={(e) => setJobCible({ ...jobCible, description: e.target.value })}
          placeholder="Décrivez les aspirations, motivations et objectifs pour ce poste..."
          rows={4}
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
