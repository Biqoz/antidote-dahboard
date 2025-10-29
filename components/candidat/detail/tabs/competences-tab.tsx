import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";

interface CompetencesTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function CompetencesTab({ 
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
  updateField,
}: CompetencesTabProps) {
  const handleDeleteCompetence = async (index: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) {
      const competences = candidat.competences || [];
      const updatedCompetences = competences.filter((_, i) => i !== index);
      try {
        if (updateField) {
          await updateField("competences", updatedCompetences);
        } else {
          console.warn("updateField function not provided");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de la compétence");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Compétences principales */}
      <div className="border-b border-gray-100 pb-6">
        <div className="flex justify-end items-center mb-4">
          {onEditItem && (
            <Button
              onClick={() => onEditItem("competences-new")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une compétence
            </Button>
          )}
        </div>
        
        {candidat.competences && candidat.competences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {candidat.competences.map((comp, index) => {
              const itemId = `competence-${index}`;
              const isCurrentlyEditing = isEditing && editingItemId === itemId;
              
              return (
                <div 
                  key={index} 
                  className={`p-4 border-b border-gray-100 flex justify-between items-center ${
                    isCurrentlyEditing ? "ring-2 ring-blue-500 rounded bg-blue-50" : ""
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
                        onClick={() => handleDeleteCompetence(index)}
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
        ) : (
          <div className="text-gray-500 text-center py-8">
            Aucune compétence renseignée
          </div>
        )}
      </div>

      {/* Section Compétences techniques */}
      {candidat.competences_techniques && candidat.competences_techniques.length > 0 && (
        <div className="border-b border-gray-100 pb-6">
          <h4 className="font-medium mb-4">Compétences techniques</h4>
          <div className="flex flex-wrap gap-2">
            {candidat.competences_techniques.map((comp, index) => (
              <Badge key={index} variant="outline">
                {comp}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Section Langues */}
      {candidat.competences_linguistiques && candidat.competences_linguistiques.length > 0 && (
        <div>
          <h4 className="font-medium mb-4">Langues</h4>
          <div className="space-y-2">
            {candidat.competences_linguistiques.map((langue, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border-b border-gray-100"
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
