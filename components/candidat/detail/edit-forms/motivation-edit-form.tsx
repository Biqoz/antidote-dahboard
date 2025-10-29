import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface MotivationEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function MotivationEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
}: MotivationEditFormProps) {
  const [motivation, setMotivation] = useState(
    candidat.source_motivation?.motivation_principale || ""
  );
  const [typeMotivation, setTypeMotivation] = useState(
    candidat.source_motivation?.source || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sourceMotivation = {
        motivation_principale: motivation,
        source: typeMotivation,
      };

      if (updateField) {
        // Utiliser le hook pour mise à jour optimiste
        await updateField("source_motivation", sourceMotivation);
        onSuccess();
      } else {
        // Fallback vers Supabase direct
        const { error } = await supabase
          .from("profils")
          .update({
            source_motivation: sourceMotivation,
            updated_at: new Date().toISOString(),
          })
          .eq("id", candidat.id);

        if (error) throw error;
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour des motivations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium">Informations de motivation</h4>
      </div>

      {/* Type de motivation */}
      <div>
        <Label htmlFor="source">Type de motivation</Label>
        <Select value={typeMotivation} onValueChange={setTypeMotivation}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le type de motivation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="financieres">Financières</SelectItem>
            <SelectItem value="professionnelles">Professionnelles</SelectItem>
            <SelectItem value="personnelles">Personnelles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Motivation */}
      <div>
        <Label htmlFor="motivation">Motivation</Label>
        <Textarea
          id="motivation"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Décrivez la motivation du candidat..."
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
