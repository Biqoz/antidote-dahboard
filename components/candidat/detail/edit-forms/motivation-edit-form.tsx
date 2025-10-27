import React, { useState } from "react";
import { Candidat, MotivationItem } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2 } from "lucide-react";

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
  const [motivations, setMotivations] = useState<MotivationItem[]>(
    candidat.motivations || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const addMotivation = () => {
    const newMotivation: MotivationItem = {
      id: Date.now().toString(),
      titre: "",
      description: "",
      priorite: "moyenne",
      date_creation: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setMotivations([...motivations, newMotivation]);
  };

  const removeMotivation = (index: number) => {
    setMotivations(motivations.filter((_, i) => i !== index));
  };

  const updateMotivation = (index: number, field: keyof MotivationItem, value: string) => {
    const updated = [...motivations];
    updated[index] = { 
      ...updated[index], 
      [field]: value,
      updated_at: new Date().toISOString()
    };
    setMotivations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (updateField) {
        // Utiliser le hook pour mise à jour optimiste
        await updateField('motivations', motivations);
        onSuccess();
      } else {
        // Fallback vers Supabase direct
        const { error } = await supabase
          .from('profils')
          .update({
            motivations: motivations,
            updated_at: new Date().toISOString(),
          })
          .eq('id', candidat.id);

        if (error) throw error;
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert("Erreur lors de la mise à jour des motivations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium">Motivations</h4>
        <Button type="button" onClick={addMotivation} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une motivation
        </Button>
      </div>

      {motivations.map((motivation, index) => (
        <div key={motivation.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h5 className="font-medium">Motivation {index + 1}</h5>
            <Button
              type="button"
              onClick={() => removeMotivation(index)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`titre-${index}`}>Titre</Label>
              <Input
                id={`titre-${index}`}
                value={motivation.titre}
                onChange={(e) => updateMotivation(index, "titre", e.target.value)}
                placeholder="Ex: Évolution de carrière"
                required
              />
            </div>
            <div>
              <Label htmlFor={`priorite-${index}`}>Priorité</Label>
              <Select
                value={motivation.priorite}
                onValueChange={(value) => updateMotivation(index, "priorite", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="moyenne">Moyenne</SelectItem>
                  <SelectItem value="basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor={`description-${index}`}>Description</Label>
            <Textarea
              id={`description-${index}`}
              value={motivation.description}
              onChange={(e) => updateMotivation(index, "description", e.target.value)}
              rows={3}
              placeholder="Décrivez cette motivation en détail..."
              required
            />
          </div>
        </div>
      ))}

      {motivations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune motivation ajoutée</p>
          <p className="text-sm">Cliquez sur &quot;Ajouter une motivation&quot; pour commencer</p>
        </div>
      )}

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