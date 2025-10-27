"use client";

import { useState } from "react";
import { useCandidatures } from "@/hooks/use-candidatures";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Candidature } from "@/types/candidat";
import { formatDate } from "@/lib/formatters";

interface CandidatureListProps {
  mandatId: string;
}

const statutLabels = {
  postule: "Postulé",
  preselectionne: "Présélectionné",
  entretien: "Entretien",
  retenu: "Retenu",
  refuse: "Refusé",
  retire: "Retiré",
};

const statutColors = {
  postule: "default",
  preselectionne: "secondary",
  entretien: "outline",
  retenu: "default",
  refuse: "destructive",
  retire: "secondary",
} as const;

export function CandidatureList({ mandatId }: CandidatureListProps) {
  const { candidatures, loading, error, updateStatut } =
    useCandidatures(mandatId);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatutChange = async (
    candidatureId: string,
    newStatut: Candidature["statut"]
  ) => {
    try {
      setUpdatingId(candidatureId);
      await updateStatut(candidatureId, newStatut);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div>Chargement des candidatures...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  if (candidatures.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Aucune candidature pour ce mandat
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Candidatures ({candidatures.length})
        </h3>
      </div>

      <div className="space-y-3">
        {candidatures.map((candidature) => (
          <Card key={candidature.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">
                      {candidature.profils?.nom} {candidature.profils?.prenom}
                    </h4>
                    <Badge variant={statutColors[candidature.statut]}>
                      {statutLabels[candidature.statut]}
                    </Badge>
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground space-y-1">
                    {candidature.profils?.email && (
                      <p>Email: {candidature.profils.email}</p>
                    )}
                    {candidature.profils?.specialisation && (
                      <p>
                        Spécialisation: {candidature.profils.specialisation}
                      </p>
                    )}
                    <p>
                      Candidature: {formatDate(candidature.date_candidature)}
                    </p>
                    {candidature.score_adequation && (
                      <p>Score d&apos;adéquation: {candidature.score_adequation}%</p>
                    )}
                  </div>

                  {candidature.notes && (
                    <div className="mt-3 p-2 bg-muted rounded text-sm">
                      {candidature.notes}
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <Select
                    value={candidature.statut}
                    onValueChange={(value) =>
                      handleStatutChange(
                        candidature.id,
                        value as Candidature["statut"]
                      )
                    }
                    disabled={updatingId === candidature.id}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statutLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
