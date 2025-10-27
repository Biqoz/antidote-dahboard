import React, { useState } from "react";
import { Candidat, InteractionIA } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface MemoireIAEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function MemoireIAEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
}: MemoireIAEditFormProps) {
  const [interactions, setInteractions] = useState<InteractionIA[]>(
    candidat.interactions_ia || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const addInteraction = () => {
    const newInteraction: InteractionIA = {
      id: Date.now().toString(),
      type: "conversation",
      contenu: "",
      reponse_ia: "",
      contexte: "",
      score_pertinence: 0,
      date_interaction: new Date().toISOString(),
    };
    setInteractions([...interactions, newInteraction]);
  };

  const removeInteraction = (id: string) => {
    setInteractions(interactions.filter((i) => i.id !== id));
  };

  const updateInteraction = (
    id: string,
    field: keyof InteractionIA,
    value: string | number
  ) => {
    setInteractions(
      interactions.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (updateField) {
        await updateField("interactions_ia", interactions);
      } else {
        const { error } = await supabase
          .from("profils")
          .update({
            interactions_ia: interactions,
            updated_at: new Date().toISOString(),
          })
          .eq("id", candidat.id);

        if (error) throw error;
      }

      alert("Interactions IA mises à jour avec succès");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour des interactions IA");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Interactions IA</h3>
        <Button type="button" onClick={addInteraction} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une interaction
        </Button>
      </div>

      <div className="space-y-4">
        {interactions.map((interaction) => (
          <Card key={interaction.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  Interaction #{interaction.id}
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeInteraction(interaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type d&apos;interaction</Label>
                  <Select
                    value={interaction.type}
                    onValueChange={(value) =>
                      updateInteraction(interaction.id, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversation">Conversation</SelectItem>
                      <SelectItem value="analyse">Analyse</SelectItem>
                      <SelectItem value="recommandation">
                        Recommandation
                      </SelectItem>
                      <SelectItem value="evaluation">Évaluation</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Score de pertinence (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={interaction.score_pertinence}
                    onChange={(e) =>
                      updateInteraction(
                        interaction.id,
                        "score_pertinence",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Contenu de l&apos;interaction</Label>
                <Textarea
                  value={interaction.contenu}
                  onChange={(e) =>
                    updateInteraction(interaction.id, "contenu", e.target.value)
                  }
                  rows={3}
                  placeholder="Décrivez l'interaction..."
                />
              </div>

              <div>
                <Label>Réponse de l&apos;IA</Label>
                <Textarea
                  value={interaction.reponse_ia}
                  onChange={(e) =>
                    updateInteraction(
                      interaction.id,
                      "reponse_ia",
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Réponse générée par l'IA..."
                />
              </div>

              <div>
                <Label>Contexte</Label>
                <Textarea
                  value={interaction.contexte}
                  onChange={(e) =>
                    updateInteraction(
                      interaction.id,
                      "contexte",
                      e.target.value
                    )
                  }
                  rows={2}
                  placeholder="Contexte de l'interaction..."
                />
              </div>

              <div>
                <Label>Date d&apos;interaction</Label>
                <Input
                  type="datetime-local"
                  value={
                    interaction.date_interaction
                      ? new Date(interaction.date_interaction)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    updateInteraction(
                      interaction.id,
                      "date_interaction",
                      new Date(e.target.value).toISOString()
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
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
