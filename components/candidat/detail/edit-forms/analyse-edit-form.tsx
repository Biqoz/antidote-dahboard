import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2 } from "lucide-react";

interface AnalyseEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function AnalyseEditForm({
  candidat,
  onSuccess,
  onCancel,
}: AnalyseEditFormProps) {
  const [scoreGlobal, setScoreGlobal] = useState(
    candidat.analyse_ia?.score_global?.toString() || ""
  );
  const [competencesDetectees, setCompetencesDetectees] = useState(
    candidat.analyse_ia?.competences_detectees || []
  );
  const [pointsForts, setPointsForts] = useState(
    candidat.analyse_ia?.points_forts || []
  );
  const [pointsAmelioration, setPointsAmelioration] = useState(
    candidat.analyse_ia?.points_amelioration || []
  );
  const [recommandations, setRecommandations] = useState(
    candidat.analyse_ia?.recommandations || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const addItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    items: string[]
  ) => {
    setter([...items, ""]);
  };

  const removeItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    items: string[],
    index: number
  ) => {
    setter(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    items: string[],
    index: number,
    value: string
  ) => {
    const updated = [...items];
    updated[index] = value;
    setter(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const analyseData = {
        score_global: scoreGlobal ? parseFloat(scoreGlobal) : undefined,
        competences_detectees: competencesDetectees.filter(
          (c) => c.trim() !== ""
        ),
        points_forts: pointsForts.filter((p) => p.trim() !== ""),
        points_amelioration: pointsAmelioration.filter((p) => p.trim() !== ""),
        recommandations: recommandations.filter((r) => r.trim() !== ""),
        derniere_analyse: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profils")
        .update({
          analyse_ia: analyseData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", candidat.id);

      if (error) throw error;

      alert("Analyse IA mise à jour avec succès");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de l'analyse IA");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="score">Score global</Label>
        <Input
          id="score"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={scoreGlobal}
          onChange={(e) => setScoreGlobal(e.target.value)}
          placeholder="Score sur 100"
        />
      </div>

      <div>
        <Label>Compétences détectées</Label>
        {competencesDetectees.map((competence, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={competence}
              onChange={(e) =>
                updateItem(
                  setCompetencesDetectees,
                  competencesDetectees,
                  index,
                  e.target.value
                )
              }
              placeholder="Compétence"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                removeItem(setCompetencesDetectees, competencesDetectees, index)
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setCompetencesDetectees, competencesDetectees)}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une compétence
        </Button>
      </div>

      <div>
        <Label>Points forts</Label>
        {pointsForts.map((point, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={point}
              onChange={(e) =>
                updateItem(setPointsForts, pointsForts, index, e.target.value)
              }
              placeholder="Point fort"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeItem(setPointsForts, pointsForts, index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setPointsForts, pointsForts)}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un point fort
        </Button>
      </div>

      <div>
        <Label>Points d&apos;amélioration</Label>
        {pointsAmelioration.map((point, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={point}
              onChange={(e) =>
                updateItem(
                  setPointsAmelioration,
                  pointsAmelioration,
                  index,
                  e.target.value
                )
              }
              placeholder="Point d'amélioration"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                removeItem(setPointsAmelioration, pointsAmelioration, index)
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setPointsAmelioration, pointsAmelioration)}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un point d&apos;amélioration
        </Button>
      </div>

      <div>
        <Label>Recommandations</Label>
        {recommandations.map((recommandation, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Textarea
              value={recommandation}
              onChange={(e) =>
                updateItem(
                  setRecommandations,
                  recommandations,
                  index,
                  e.target.value
                )
              }
              placeholder="Recommandation"
              rows={2}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                removeItem(setRecommandations, recommandations, index)
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addItem(setRecommandations, recommandations)}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une recommandation
        </Button>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
