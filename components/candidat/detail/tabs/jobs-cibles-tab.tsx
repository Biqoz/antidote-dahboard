import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface JobsCiblesTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
}

export function JobsCiblesTab({ 
  candidat,
  onEditItem,
}: JobsCiblesTabProps) {
  return (
    <div className="space-y-4">
      {/* Bouton Ajouter job cible */}
      <div className="flex justify-end">
        <Button
          onClick={() => onEditItem?.('add-job-cible')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter job cible
        </Button>
      </div>
          {candidat.source_motivation?.objectifs_carriere && (
            <div>
              <h4 className="font-medium mb-2">Objectifs de carrière</h4>
              {Array.isArray(candidat.source_motivation.objectifs_carriere) ? (
                <div className="flex flex-wrap gap-2">
                  {candidat.source_motivation.objectifs_carriere.map((objectif, index) => (
                    <Badge key={index} variant="default">
                      {objectif}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm">{candidat.source_motivation.objectifs_carriere}</p>
              )}
            </div>
          )}

          {candidat.source_motivation?.preferences_poste && (
            <div>
              <h4 className="font-medium mb-2">Préférences de poste</h4>
              <div className="space-y-2">
                {candidat.source_motivation.preferences_poste.type_contrat && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Type de contrat:</span>
                    <Badge variant="outline">
                      {candidat.source_motivation.preferences_poste.type_contrat}
                    </Badge>
                  </div>
                )}
                
                {candidat.source_motivation.preferences_poste.localisation && candidat.source_motivation.preferences_poste.localisation.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Localisation préférée:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {candidat.source_motivation.preferences_poste.localisation.map((lieu, index) => (
                        <Badge key={index} variant="secondary">
                          {lieu}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {candidat.source_motivation.preferences_poste.salaire_min && candidat.source_motivation.preferences_poste.salaire_max && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Fourchette salariale:</span>
                    <Badge variant="outline">
                      {candidat.source_motivation.preferences_poste.salaire_min}€ - {candidat.source_motivation.preferences_poste.salaire_max}€
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {candidat.salaire_souhaite && (
            <div>
              <h4 className="font-medium mb-2">Salaire souhaité</h4>
              <Badge variant="default">
                {candidat.salaire_souhaite}€
              </Badge>
            </div>
          )}

          {candidat.disponibilite && (
            <div>
              <h4 className="font-medium mb-2">Disponibilité</h4>
              <Badge variant="outline">
                {candidat.disponibilite}
              </Badge>
            </div>
          )}
    </div>
  );
}