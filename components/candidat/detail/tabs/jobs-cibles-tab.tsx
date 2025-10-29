import React from "react";
import { Candidat, JobCible } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";

interface JobsCiblesTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function JobsCiblesTab({ 
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
  updateField,
}: JobsCiblesTabProps) {
  // Gérer les jobs ciblés qui peuvent être stockés comme string JSON ou array
  let jobsCibles: JobCible[] = [];
  try {
    if (Array.isArray(candidat.jobs_cibles)) {
      jobsCibles = candidat.jobs_cibles;
    } else if (typeof candidat.jobs_cibles === "string") {
      jobsCibles = JSON.parse(candidat.jobs_cibles);
    } else if (candidat.jobs_cibles) {
      // Si c'est un objet, essayer de le convertir en array
      jobsCibles = [candidat.jobs_cibles];
    }
  } catch (error) {
    console.error("Erreur lors du parsing des jobs ciblés:", error);
    jobsCibles = [];
  }

  const handleDelete = async (index: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce job ciblé ?")) {
      const updatedJobsCibles = jobsCibles.filter((_, i) => i !== index);
      try {
        if (updateField) {
          await updateField("jobs_cibles", updatedJobsCibles);
        } else {
          console.warn("updateField function not provided");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du job ciblé");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Jobs ciblés */}
      <div className="border-b border-gray-100 pb-6">
        <div className="flex justify-end items-center mb-4">
          {onEditItem && (
            <Button
              onClick={() => onEditItem("job-cible-new")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un job ciblé
            </Button>
          )}
        </div>

        {jobsCibles && jobsCibles.length > 0 ? (
          <div className="space-y-4">
            {jobsCibles.map((job: JobCible, index: number) => {
              const itemId = `job-cible-${index}`;
              const isCurrentlyEditing = isEditing && editingItemId === itemId;

              return (
                <div
                  key={job.id || index}
                  className={`border rounded-lg p-4 space-y-3 ${
                    isCurrentlyEditing ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-900 text-lg">{job.titre}</h5>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        <span className="text-gray-500 font-medium">Aspirations:</span>
                        <br />
                        {job.description}
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
            Aucun job ciblé renseigné
          </div>
        )}
      </div>

      {/* Section Informations complémentaires */}
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