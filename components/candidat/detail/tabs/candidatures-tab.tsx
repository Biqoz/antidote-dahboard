import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { useAllMandats } from "@/hooks/use-all-mandats";
import { useClients } from "@/hooks/use-clients";

interface CandidaturesTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function CandidaturesTab({
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
  updateField,
}: CandidaturesTabProps) {
  // Hooks pour récupérer les données
  const { mandats } = useAllMandats();
  const { clients } = useClients();

  // Fonction pour obtenir le nom du client
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.nom : "Client inconnu";
  };

  // Fonction pour obtenir les informations complètes du mandat
  const getMandatInfo = (mandatId: string) => {
    const mandat = mandats.find(m => m.id === mandatId);
    if (mandat) {
      const clientName = getClientName(mandat.entreprise_id);
      return {
        titre: mandat.titre,
        client: clientName,
        fullDisplay: `${mandat.titre} - ${clientName}`
      };
    }
    return {
      titre: `Mandat ${mandatId}`,
      client: "Client inconnu",
      fullDisplay: `Mandat ${mandatId}`
    };
  };
  const getStatusBadgeVariant = (statut: string) => {
    switch (statut) {
      case "retenu":
        return "default";
      case "entretien":
        return "secondary";
      case "preselectionne":
        return "outline";
      case "refuse":
        return "destructive";
      case "retire":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case "postule":
        return "Postulé";
      case "preselectionne":
        return "Présélectionné";
      case "entretien":
        return "Entretien";
      case "retenu":
        return "Retenu";
      case "refuse":
        return "Refusé";
      case "retire":
        return "Retiré";
      default:
        return statut;
    }
  };

  const handleDelete = async (index: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
      const updatedCandidatures =
        candidat.candidatures?.filter((_, i) => i !== index) || [];
      try {
        if (updateField) {
          await updateField("candidatures", updatedCandidatures);
        } else {
          console.warn("updateField function not provided");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de la candidature");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Candidatures */}
      <div className="border-b border-gray-100 pb-6">
        <div className="flex justify-end items-center mb-4">
          {onEditItem && (
            <Button
              onClick={() => onEditItem("candidature-new")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une candidature
            </Button>
          )}
        </div>
        {candidat.candidatures && candidat.candidatures.length > 0 ? (
          <div className="space-y-4">
            {candidat.candidatures.map((candidature, index) => {
              const itemId = `candidature-${index}`;
              const isCurrentlyEditing = isEditing && editingItemId === itemId;

              return (
                <div
                  key={candidature.id || index}
                  className={`border rounded-lg p-4 space-y-3 ${
                    isCurrentlyEditing ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {candidature.mandat_id && (
                        <div>
                          <h4 className="font-medium text-blue-900 text-lg">
                            {getMandatInfo(candidature.mandat_id).titre}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {getMandatInfo(candidature.mandat_id).client}
                          </p>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mt-2">
                        Candidature du{" "}
                        {new Date(
                          candidature.date_candidature
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getStatusBadgeVariant(candidature.statut)}
                      >
                        {getStatusLabel(candidature.statut)}
                      </Badge>
                      {onEditItem && !isEditing && (
                        <div className="flex gap-1 ml-2">
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

                  <div className="space-y-3">
                    {candidature.score_adequation && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">
                          Score d&apos;adéquation:
                        </span>
                        <Badge variant="outline">
                          {candidature.score_adequation}%
                        </Badge>
                      </div>
                    )}

                    {candidature.date_derniere_action && (
                      <p className="text-sm text-gray-500">
                        Dernière action:{" "}
                        {new Date(
                          candidature.date_derniere_action
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    )}

                    {candidature.notes && (
                      <div>
                        <p className="text-sm bg-gray-50 p-3 rounded border-l-4 border-blue-200">
                          <span className="font-medium text-gray-700">
                            Notes:
                          </span>
                          <br />
                          {candidature.notes}
                        </p>
                      </div>
                    )}

                    {candidature.etapes_recrutement &&
                      candidature.etapes_recrutement.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2 text-gray-700">
                            Étapes de recrutement:
                          </h5>
                          <div className="space-y-2">
                            {candidature.etapes_recrutement.map(
                              (etape, etapeIndex) => (
                                <div
                                  key={etapeIndex}
                                  className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded"
                                >
                                  <Badge
                                    variant={
                                      etape.statut === "termine"
                                        ? "default"
                                        : etape.statut === "en_cours"
                                        ? "secondary"
                                        : etape.statut === "annule"
                                        ? "destructive"
                                        : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {etape.statut}
                                  </Badge>
                                  <span className="font-medium">
                                    {etape.nom}
                                  </span>
                                  {etape.date_realisee && (
                                    <span className="text-gray-500 ml-auto">
                                      {new Date(
                                        etape.date_realisee
                                      ).toLocaleDateString("fr-FR")}
                                    </span>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            Aucune candidature enregistrée
          </div>
        )}
      </div>
    </div>
  );
}
