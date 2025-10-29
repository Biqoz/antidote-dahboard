import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, Plus } from "lucide-react";

interface FormationTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function FormationTab({
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
  updateField,
}: FormationTabProps) {
  const reconnaissances = candidat.reconnaissances_diplomes || [];
  const formations = candidat.formations || [];

  const handleDeleteFormation = async (index: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      const updatedFormations = formations.filter((_, i) => i !== index);
      try {
        if (updateField) {
          await updateField("formations", updatedFormations);
        } else {
          console.warn("updateField function not provided");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de la formation");
      }
    }
  };

  const handleDeleteReconnaissance = async (index: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette reconnaissance ?")) {
      const updatedReconnaissances = reconnaissances.filter(
        (_, i) => i !== index
      );
      try {
        if (updateField) {
          await updateField("reconnaissances_diplomes", updatedReconnaissances);
        } else {
          console.warn("updateField function not provided");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de la reconnaissance");
      }
    }
  };

  return (
    <Tabs defaultValue="formation" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="formation">Formation</TabsTrigger>
        <TabsTrigger value="reconnaissances">Reconnaissances</TabsTrigger>
      </TabsList>

      <TabsContent value="formation" className="space-y-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Formations</h2>
          {onEditItem && (
            <Button
              onClick={() => onEditItem("formation-new")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une formation
            </Button>
          )}
        </div>

        {formations.length > 0 ? (
          <div className="space-y-4">
            {formations.map((formation, index) => {
              const itemId = `formation-${index}`;
              const isCurrentlyEditing = isEditing && editingItemId === itemId;

              return (
                <div
                  key={index}
                  className={`p-4 border-b border-gray-100 ${
                    isCurrentlyEditing ? "ring-2 ring-blue-500 rounded" : ""
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
                          onClick={() => handleDeleteFormation(index)}
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
          <div className="p-6 text-center text-gray-500">
            Aucune formation renseignée
          </div>
        )}
      </TabsContent>

      <TabsContent value="reconnaissances" className="space-y-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Reconnaissances de diplômes</h2>
          {onEditItem && (
            <Button
              onClick={() => onEditItem("reconnaissance-new")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une reconnaissance
            </Button>
          )}
        </div>
        {reconnaissances.length > 0 ? (
          reconnaissances.map((reconnaissance, index) => {
            const itemId = `reconnaissance-${index}`;
            const isCurrentlyEditing = isEditing && editingItemId === itemId;

            return (
              <div
                key={index}
                className={`p-4 border-b border-gray-100 space-y-4 ${
                  isCurrentlyEditing ? "ring-2 ring-blue-500 rounded" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">
                    {reconnaissance.equivalence ||
                      reconnaissance.organisme ||
                      reconnaissance.organisme_reconnaissance ||
                      `Reconnaissance ${index + 1}`}
                  </h3>
                  {!isEditing && (
                    <div className="flex gap-2">
                      {onEditItem && (
                        <Button
                          onClick={() => onEditItem(itemId)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Modifier
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteReconnaissance(index)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {reconnaissance.statut && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Statut de reconnaissance
                      </h4>
                      <Badge
                        variant={
                          reconnaissance.statut === "reconnu"
                            ? "default"
                            : reconnaissance.statut === "en_cours"
                            ? "secondary"
                            : reconnaissance.statut === "non_reconnu"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {reconnaissance.statut === "reconnu"
                          ? "Reconnu"
                          : reconnaissance.statut === "en_cours"
                          ? "En cours"
                          : reconnaissance.statut === "non_reconnu"
                          ? "Non reconnu"
                          : "Non applicable"}
                      </Badge>
                    </div>
                  )}

                  {reconnaissance.organisme && (
                    <div>
                      <h4 className="font-medium mb-2">Organisme</h4>
                      <p className="text-sm">{reconnaissance.organisme}</p>
                    </div>
                  )}

                  {reconnaissance.organisme_reconnaissance && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Organisme de reconnaissance
                      </h4>
                      <p className="text-sm">
                        {reconnaissance.organisme_reconnaissance}
                      </p>
                    </div>
                  )}

                  {reconnaissance.date_reconnaissance && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Date de reconnaissance
                      </h4>
                      <p className="text-sm">
                        {reconnaissance.date_reconnaissance}
                      </p>
                    </div>
                  )}

                  {reconnaissance.equivalence && (
                    <div>
                      <h4 className="font-medium mb-2">Équivalence</h4>
                      <Badge variant="outline">
                        {reconnaissance.equivalence}
                      </Badge>
                    </div>
                  )}

                  {reconnaissance.pays_origine && (
                    <div>
                      <h4 className="font-medium mb-2">Pays d&apos;origine</h4>
                      <Badge variant="secondary">
                        {reconnaissance.pays_origine}
                      </Badge>
                    </div>
                  )}

                  {reconnaissance.numero_autorisation && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Numéro d&apos;autorisation
                      </h4>
                      <p className="text-sm font-mono">
                        {reconnaissance.numero_autorisation}
                      </p>
                    </div>
                  )}

                  {reconnaissance.documents_requis &&
                    reconnaissance.documents_requis.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Documents requis</h4>
                        <div className="flex flex-wrap gap-2">
                          {reconnaissance.documents_requis.map(
                            (doc, docIndex) => (
                              <Badge key={docIndex} variant="outline">
                                {doc}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {reconnaissance.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded">
                        {reconnaissance.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-gray-500">
            Aucune reconnaissance de diplôme enregistrée
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
