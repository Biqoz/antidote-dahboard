import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2 } from "lucide-react";

interface JobsCiblesEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function JobsCiblesEditForm({
  candidat,
  onSuccess,
  onCancel,
}: JobsCiblesEditFormProps) {
  const [jobsCibles, setJobsCibles] = useState(candidat.jobs_cibles || []);
  const [isLoading, setIsLoading] = useState(false);

  const addJob = () => {
    setJobsCibles([...jobsCibles, ""]);
  };

  const removeJob = (index: number) => {
    setJobsCibles(jobsCibles.filter((_, i) => i !== index));
  };

  const updateJob = (index: number, value: string) => {
    const updated = [...jobsCibles];
    updated[index] = value;
    setJobsCibles(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profils")
        .update({
          jobs_cibles: jobsCibles.filter((j) => j.trim() !== ""),
          updated_at: new Date().toISOString(),
        })
        .eq("id", candidat.id);

      if (error) throw error;

      alert("Jobs ciblés mis à jour avec succès");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour des jobs ciblés");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Jobs ciblés</Label>
        <Button type="button" onClick={addJob} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {jobsCibles.map((job, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={job}
            onChange={(e) => updateJob(index, e.target.value)}
            placeholder="Intitulé du poste ciblé"
          />
          <Button
            type="button"
            onClick={() => removeJob(index)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

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
