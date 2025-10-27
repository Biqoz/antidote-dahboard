import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CandidaturesTabProps {
  candidat: Candidat;
}

export function CandidaturesTab({ candidat }: CandidaturesTabProps) {
  const getStatusBadgeVariant = (statut: string) => {
    switch (statut) {
      case 'retenu':
        return 'default';
      case 'entretien':
        return 'secondary';
      case 'preselectionne':
        return 'outline';
      case 'refuse':
        return 'destructive';
      case 'retire':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'postule':
        return 'Postulé';
      case 'preselectionne':
        return 'Présélectionné';
      case 'entretien':
        return 'Entretien';
      case 'retenu':
        return 'Retenu';
      case 'refuse':
        return 'Refusé';
      case 'retire':
        return 'Retiré';
      default:
        return statut;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidatures</CardTitle>
      </CardHeader>
      <CardContent>
        {candidat.candidatures && candidat.candidatures.length > 0 ? (
          <div className="space-y-4">
            {candidat.candidatures.map((candidature, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    {candidature.mandat && (
                      <h4 className="font-medium">{candidature.mandat.titre}</h4>
                    )}
                    <p className="text-sm text-gray-600">
                      Candidature du {new Date(candidature.date_candidature).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(candidature.statut)}>
                    {getStatusLabel(candidature.statut)}
                  </Badge>
                </div>

                {candidature.score_adequation && (
                  <div className="mb-2">
                    <span className="text-sm font-medium">Score d&apos;adéquation: </span>
                    <Badge variant="outline">
                      {candidature.score_adequation}%
                    </Badge>
                  </div>
                )}

                {candidature.date_derniere_action && (
                  <p className="text-sm text-gray-500">
                    Dernière action: {new Date(candidature.date_derniere_action).toLocaleDateString('fr-FR')}
                  </p>
                )}

                {candidature.notes && (
                  <div className="mt-2">
                    <p className="text-sm bg-gray-50 p-2 rounded">{candidature.notes}</p>
                  </div>
                )}

                {candidature.etapes_recrutement && candidature.etapes_recrutement.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium mb-2">Étapes de recrutement:</h5>
                    <div className="space-y-1">
                      {candidature.etapes_recrutement.map((etape, etapeIndex) => (
                        <div key={etapeIndex} className="flex items-center gap-2 text-sm">
                          <Badge 
                            variant={
                              etape.statut === 'termine' ? 'default' :
                              etape.statut === 'en_cours' ? 'secondary' :
                              etape.statut === 'annule' ? 'destructive' :
                              'outline'
                            }
                            className="text-xs"
                          >
                            {etape.statut}
                          </Badge>
                          <span>{etape.nom}</span>
                          {etape.date_realisee && (
                            <span className="text-gray-500">
                              ({new Date(etape.date_realisee).toLocaleDateString('fr-FR')})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune candidature enregistrée</p>
        )}
      </CardContent>
    </Card>
  );
}