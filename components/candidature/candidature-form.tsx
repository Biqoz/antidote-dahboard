"use client";

import { useState } from "react";
import { useCandidatures } from "@/hooks/use-candidatures";
import { useCandidats } from "@/hooks/use-candidats";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCandidatureData } from "@/types/candidat";

interface CandidatureFormProps {
  mandatId: string;
  onSuccess?: () => void;
}

export function CandidatureForm({ mandatId, onSuccess }: CandidatureFormProps) {
  const { candidats } = useCandidats();
  const { createCandidature } = useCandidatures();
  const [formData, setFormData] = useState<Partial<CreateCandidatureData>>({
    mandat_id: mandatId,
    statut: "postule",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.profil_id) {
      setError("Veuillez sélectionner un candidat");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createCandidature(formData as CreateCandidatureData);

      // Reset form
      setFormData({
        mandat_id: mandatId,
        statut: "postule",
      });

      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter une candidature</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="profil_id">Candidat</Label>
            <Select
              value={formData.profil_id || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, profil_id: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un candidat" />
              </SelectTrigger>
              <SelectContent>
                {candidats.map((candidat) => (
                  <SelectItem key={candidat.id} value={candidat.id}>
                    {candidat.nom} {candidat.prenom} - {candidat.specialisation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="statut">Statut initial</Label>
            <Select
              value={formData.statut || "postule"}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, statut: value as CreateCandidatureData['statut'] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postule">Postulé</SelectItem>
                <SelectItem value="preselectionne">Présélectionné</SelectItem>
                <SelectItem value="entretien">Entretien</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="score_adequation">
              Score d&apos;adéquation (%)
            </Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.score_adequation || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  score_adequation: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Notes sur la candidature..."
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" disabled={loading}>
            {loading ? "Création..." : "Ajouter la candidature"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
