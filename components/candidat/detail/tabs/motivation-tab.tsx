import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

interface MotivationTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
}

export function MotivationTab({ 
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
}: MotivationTabProps) {
  const motivation = candidat.source_motivation;
  const motivations = candidat.motivations;

  return (
    <div className="space-y-4">
      {/* Bouton Ajouter motivation */}
      <div className="flex justify-end">
        <Button
          onClick={() => onEditItem?.('add-motivation')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter motivation
        </Button>
      </div>
        {/* Nouvelles motivations multi-éléments */}
        {motivations && motivations.length > 0 && (
          <div className="space-y-4 mb-6">
            <h4 className="font-medium text-lg">Motivations détaillées</h4>
            {motivations.map((motiv, index) => {
              const itemId = `motivation-${index}`;
              const isCurrentlyEditing = isEditing && editingItemId === itemId;
              
              return (
                <div 
                  key={motiv.id} 
                  className={`border rounded-lg p-4 space-y-2 ${
                    isCurrentlyEditing ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-blue-900">{motiv.titre}</h5>
                        <Badge 
                          variant={motiv.priorite === 'haute' ? 'destructive' : motiv.priorite === 'moyenne' ? 'default' : 'secondary'}
                        >
                          {motiv.priorite}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{motiv.description}</p>
                      <p className="text-xs text-gray-500">
                        Ajoutée le {new Date(motiv.date_creation).toLocaleDateString()}
                      </p>
                    </div>
                    {onEditItem && !isEditing && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => onEditItem(itemId)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Modifier
                        </Button>
                        <Button
                          onClick={() => {/* TODO: Implement delete */}}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ancien système de motivation (pour compatibilité) */}
        {motivation ? (
          <div className="space-y-4">
            {motivation.source && (
              <div>
                <h4 className="font-medium mb-2">Source</h4>
                <Badge variant="default">{motivation.source}</Badge>
              </div>
            )}

            {motivation.canal_acquisition && (
              <div>
                <h4 className="font-medium mb-2">Canal d&apos;acquisition</h4>
                <Badge variant="outline">{motivation.canal_acquisition}</Badge>
              </div>
            )}

            {motivation.motivation_principale && (
              <div>
                <h4 className="font-medium mb-2">Motivation principale</h4>
                <p className="text-sm bg-blue-50 p-3 rounded">{motivation.motivation_principale}</p>
              </div>
            )}

            {motivation.motivations_principales && motivation.motivations_principales.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Motivations</h4>
                <div className="flex flex-wrap gap-2">
                  {motivation.motivations_principales.map((motiv, index) => (
                    <Badge key={index} variant="secondary">
                      {motiv}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {motivation.preferences_travail && motivation.preferences_travail.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Préférences de travail</h4>
                <div className="flex flex-wrap gap-2">
                  {motivation.preferences_travail.map((pref, index) => (
                    <Badge key={index} variant="outline">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {motivation.zones_mobilite && motivation.zones_mobilite.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Zones de mobilité</h4>
                <div className="flex flex-wrap gap-2">
                  {motivation.zones_mobilite.map((zone, index) => (
                    <Badge key={index} variant="secondary">
                      {zone}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {candidat.source_recrutement && (
              <div>
                <h4 className="font-medium mb-2">Source de recrutement</h4>
                <Badge variant="outline">
                  {candidat.source_recrutement === 'site_web' ? 'Site web' :
                   candidat.source_recrutement === 'linkedin' ? 'LinkedIn' :
                   candidat.source_recrutement === 'cooptation' ? 'Cooptation' :
                   candidat.source_recrutement === 'chasse' ? 'Chasse' :
                   candidat.source_recrutement}
                </Badge>
              </div>
            )}
          </div>
        ) : null}

        {/* Message si aucune motivation */}
        {(!motivations || motivations.length === 0) && !motivation && (
          <p className="text-gray-500 text-center py-8">
            Aucune motivation renseignée
          </p>
        )}
    </div>
  );
}