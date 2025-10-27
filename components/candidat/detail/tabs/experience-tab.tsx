import React from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  editingItemId
}: ExperienceTabProps) {
  return (
    <div className="space-y-4">
      {candidat.experiences && candidat.experiences.length > 0 ? (
        candidat.experiences.map((exp, index) => {
          const itemId = `experience-${index}`;
          const isCurrentlyEditing = isEditing && editingItemId === itemId;
          
          return (
            <Card key={index} className={isCurrentlyEditing ? "ring-2 ring-blue-500" : ""}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Expérience #{index + 1}</CardTitle>
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
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium">{exp.poste}</h4>
                  <p className="text-sm text-gray-600">{exp.entreprise}</p>
                  <p className="text-sm text-gray-500">
                    {exp.date_debut} - {exp.date_fin || "Présent"}
                  </p>
                  {exp.description && (
                    <p className="text-sm mt-2">{exp.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Aucune expérience renseignée
          </CardContent>
        </Card>
      )}
    </div>
  );
}
