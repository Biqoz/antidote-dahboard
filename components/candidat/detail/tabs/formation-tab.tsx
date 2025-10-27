import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface FormationTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
}

export function FormationTab({ 
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
}: FormationTabProps) {
  return (
    <div className="space-y-4">
      {candidat.formations && candidat.formations.length > 0 ? (
        <div className="space-y-4">
          {candidat.formations.map((formation, index) => {
            const itemId = `formation-${index}`;
            const isCurrentlyEditing = isEditing && editingItemId === itemId;
            
            return (
              <div 
                key={index} 
                className={`p-4 border rounded-lg ${
                  isCurrentlyEditing ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{formation.diplome}</h4>
                    <p className="text-sm text-gray-600">
                      {formation.etablissement}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formation.date_debut} - {formation.date_fin}
                    </p>
                    {formation.mention && (
                      <Badge variant="secondary" className="mt-2">
                        {formation.mention}
                      </Badge>
                    )}
                  </div>
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
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">Aucune formation renseignée</p>
      )}
    </div>
  );
}
