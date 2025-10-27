import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface CandidaturesEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function CandidaturesEditForm({
  candidat,
  onSuccess,
  onCancel,
}: CandidaturesEditFormProps) {
  const [candidatures, setCandidatures] = useState(
    candidat.candidatures
      ?.map(
        (c) =>
          `${c.mandat?.titre || "Poste non défini"} - ${
            c.mandat?.entreprise_id || "Entreprise non définie"
          } - ${c.statut}`
      )
      .join("\n") || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const candidaturesArray = candidatures
        .split("\n")
        .filter((c) => c.trim() !== "")
        .map((line, index) => {
          const [, , statut] = line.split(" - ");
          return {
            id: `cand-${Date.now()}-${index}`,
            profil_id: candidat.id,
            mandat_id: `mandat-${Date.now()}-${index}`, // This should be a real mandat ID
            statut:
              (statut?.trim() as
                | "postule"
                | "preselectionne"
                | "entretien"
                | "retenu"
                | "refuse"
                | "retire") || "postule",
            date_candidature: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        });

      const { error } = await supabase
        .from("profils")
        .update({
          candidatures: candidaturesArray,
          updated_at: new Date().toISOString(),
        })
        .eq("id", candidat.id);

      if (error) throw error;

      alert("Candidatures mises à jour avec succès");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour des candidatures");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="candidatures">
          Candidatures (format: &quot;Poste - Entreprise - Statut&quot;, une par
          ligne)
        </Label>
        <Textarea
          id="candidatures"
          value={candidatures}
          onChange={(e) => setCandidatures(e.target.value)}
          rows={6}
          placeholder="Développeur Full Stack - TechCorp - En cours&#10;Data Scientist - DataLab - Refusé"
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
