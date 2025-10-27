import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface CvEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function CvEditForm({ candidat, onSuccess, onCancel }: CvEditFormProps) {
  const [cvContent, setCvContent] = useState(candidat.cv_text || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profils")
        .update({
          cv_text: cvContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", candidat.id);

      if (error) throw error;

      alert("CV mis à jour avec succès");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du CV");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cv_content">Contenu du CV</Label>
        <Textarea
          id="cv_content"
          value={cvContent}
          onChange={(e) => setCvContent(e.target.value)}
          rows={10}
          placeholder="Contenu du CV..."
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
