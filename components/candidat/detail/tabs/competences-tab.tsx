import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface CompetencesTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
}

export function CompetencesTab({ 
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
}: CompetencesTabProps) {
  return (
    <div className="space-y-4">
          {candidat.competences && candidat.competences.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {candidat.competences.map((comp, index) => {
                const itemId = `competence-${index}`;
                const isCurrentlyEditing = isEditing && editingItemId === itemId;
                
                return (
                  <div 
                    key={index} 
                    className={`p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-center ${
                      isCurrentlyEditing ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {comp}
                    </span>
                    {onEditItem && !isEditing && (
                      <div className="flex gap-1">
                        <Button
                          onClick={() => onEditItem(itemId)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          onClick={() => {/* TODO: Implement delete */}}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {(!candidat.competences || candidat.competences.length === 0) && (
            <p className="text-gray-500 text-center py-8">Aucune compétence renseignée</p>
          )}

          {candidat.competences_techniques &&
        candidat.competences_techniques.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Compétences techniques</h4>
            <div className="flex flex-wrap gap-2">
              {candidat.competences_techniques.map((comp, index) => (
                <Badge key={index} variant="outline">
                  {comp}
                </Badge>
              ))}
            </div>
          </div>
        )}

      {candidat.competences_linguistiques &&
        candidat.competences_linguistiques.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Langues</h4>
            <div className="space-y-2">
              {candidat.competences_linguistiques.map((langue, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span>{langue.langue}</span>
                  <Badge variant="outline">{langue.niveau}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
