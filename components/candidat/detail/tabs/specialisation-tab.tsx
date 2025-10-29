import React from "react";
import { Candidat, SpecialisationItem } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";

interface SpecialisationTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function SpecialisationTab({
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
  updateField,
}: SpecialisationTabProps) {
  // Gérer les spécialisations qui peuvent être stockées comme string JSON ou array
  let specialisations: SpecialisationItem[] = [];
  try {
    if (Array.isArray(candidat.specialisations)) {
      specialisations = candidat.specialisations;
    } else if (typeof candidat.specialisations === "string") {
      specialisations = JSON.parse(candidat.specialisations);
    } else if (candidat.specialisations) {
      // Si c'est un objet, essayer de le convertir en array
      specialisations = [candidat.specialisations];
    }
  } catch (error) {
    console.error("Erreur lors du parsing des spécialisations:", error);
    specialisations = [];
  }

  const handleDelete = async (index: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette spécialisation ?")) {
      const updatedSpecialisations = specialisations.filter(
        (_, i) => i !== index
      );
      try {
        if (updateField) {
          await updateField("specialisations", updatedSpecialisations);
        } else {
          console.warn("updateField function not provided");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de la spécialisation");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Spécialisations */}
      <div className="border-b border-gray-100 pb-6">
        <div className="flex justify-end items-center mb-4">
          {onEditItem && (
            <Button
              onClick={() => onEditItem("specialisation-new")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une spécialisation
            </Button>
          )}
        </div>

        {specialisations && specialisations.length > 0 ? (
          <div className="space-y-4">
          {specialisations.map((spec: SpecialisationItem, index: number) => {
            const itemId = `specialisation-${index}`;
            const isCurrentlyEditing = isEditing && editingItemId === itemId;

            return (
              <div
                key={spec.id || index}
                className={`border rounded-lg p-4 space-y-3 ${
                  isCurrentlyEditing ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-blue-900 text-lg">{spec.nom}</h5>
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      <span className="text-gray-500">Domaine:</span> {spec.domaine}
                    </p>
                  </div>
                  {onEditItem && !isEditing && (
                    <div className="flex gap-1 ml-4">
                      <Button
                        onClick={() => onEditItem(itemId)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(index)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            Aucune spécialisation renseignée
          </div>
        )}
      </div>

      {/* Ancienne spécialisation simple (pour compatibilité) */}
      {candidat.specialisation && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Spécialisation principale</h4>
          <Badge variant="default" className="text-base px-3 py-1">
            {candidat.specialisation}
          </Badge>
        </div>
      )}

      {candidat.source_motivation?.preferences_poste?.secteur_prefere &&
        candidat.source_motivation.preferences_poste.secteur_prefere.length >
          0 && (
          <div>
            <h4 className="font-medium mb-2">Secteurs préférés</h4>
            <div className="flex flex-wrap gap-2">
              {candidat.source_motivation.preferences_poste.secteur_prefere.map(
                (secteur: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {secteur}
                  </Badge>
                )
              )}
            </div>
          </div>
        )}


    </div>
  );
}
