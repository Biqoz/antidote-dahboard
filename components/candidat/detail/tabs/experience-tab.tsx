import React from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ExperienceTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
}

export function ExperienceTab({
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
}: ExperienceTabProps) {
  // Trier les expériences par date de début (du plus récent au plus ancien)
  const sortedExperiences = candidat.experiences ? 
    [...candidat.experiences].sort((a, b) => {
      // Convertir les dates en objets Date pour la comparaison
      const dateA = new Date(a.date_debut);
      const dateB = new Date(b.date_debut);
      return dateB.getTime() - dateA.getTime(); // Tri décroissant (plus récent en premier)
    }) : [];

  return (
    <div className="space-y-4">
      {sortedExperiences.length > 0 ? (
        sortedExperiences.map((exp, index) => {
          const itemId = `experience-${index}`;
          const isCurrentlyEditing = isEditing && editingItemId === itemId;

          return (
            <div
              key={index}
              className={`p-4 border-b border-gray-100 ${
                isCurrentlyEditing ? "ring-2 ring-blue-500 rounded" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{exp.poste}</h3>
                {onEditItem && !isEditing && (
                  <div className="flex gap-2">
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
                      onClick={() => {
                        /* TODO: Implement delete */
                      }}
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
              <div className="space-y-2 mt-2">
                <p className="text-sm text-gray-600">{exp.entreprise}</p>
                <p className="text-sm text-gray-500">
                  {exp.date_debut} - {exp.date_fin || "Présent"}
                </p>
                {exp.description && (
                  <p className="text-sm mt-2">{exp.description}</p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-6 text-center text-gray-500">
          Aucune expérience renseignée
        </div>
      )}
    </div>
  );
}
