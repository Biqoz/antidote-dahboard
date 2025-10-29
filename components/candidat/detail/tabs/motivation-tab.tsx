import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

interface MotivationTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
}

export function MotivationTab({ candidat, onEditItem }: MotivationTabProps) {
  const motivation = candidat.source_motivation;

  return (
    <div className="space-y-6">
      {/* Header avec titre et bouton d'ajout */}
      <div className="flex justify-end items-center">
        {onEditItem && (
          <Button
            onClick={() => onEditItem("motivation-edit")}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une motivation
          </Button>
        )}
      </div>

      {/* Affichage des motivations */}
      {motivation && motivation.motivation_principale ? (
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {motivation.source && (
                    <Badge variant="secondary">{motivation.source}</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700">
                  {motivation.motivation_principale}
                </p>
              </div>
              <div className="flex gap-1 ml-4">
                {onEditItem && (
                  <>
                    <Button
                      onClick={() => onEditItem("motivation-edit")}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        // TODO: Implémenter la suppression
                        console.log("Supprimer motivation");
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-gray-100">
          <p className="text-gray-500 text-center">
            Aucunes motivations renseignées
          </p>
        </div>
      )}
    </div>
  );
}
