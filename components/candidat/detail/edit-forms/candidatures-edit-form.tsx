import React, { useState } from "react";
import { Candidat, Candidature } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllMandats } from "@/hooks/use-all-mandats";
import { useClients } from "@/hooks/use-clients";
import { supabase } from "@/lib/supabase";

interface CandidaturesEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
  editingItemId?: string | null;
}

export function CandidaturesEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
  editingItemId,
}: CandidaturesEditFormProps) {
  // Hooks pour récupérer les données
  const { mandats, loading: mandatsLoading } = useAllMandats();
  const { clients } = useClients();

  // Déterminer si on édite un élément spécifique ou on ajoute un nouveau
  const isEditingSpecific =
    editingItemId && editingItemId.startsWith("candidature-");
  const isAddingNew = editingItemId === "candidature-new";
  const editingIndex =
    isEditingSpecific && !isAddingNew
      ? parseInt(editingItemId.split("-")[1])
      : -1;

  const candidaturesArray = candidat.candidatures || [];

  // État pour l'élément en cours d'édition
  const [candidature, setCandidature] = useState<Partial<Candidature>>(() => {
    if (isEditingSpecific && !isAddingNew && candidaturesArray[editingIndex]) {
      return candidaturesArray[editingIndex];
    }
    // Nouvel élément
    return {
      id: Date.now().toString(),
      profil_id: candidat.id,
      mandat_id: "",
      statut: "postule",
      date_candidature: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour obtenir le nom du client
  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.nom : "Client inconnu";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidature.mandat_id?.trim()) {
      alert("Le mandat est requis");
      return;
    }

    if (!candidature.date_candidature) {
      alert("La date de candidature est requise");
      return;
    }

    setIsLoading(true);

    try {
      let updatedCandidatures: Candidature[];

      if (isAddingNew) {
        // Ajouter une nouvelle candidature
        updatedCandidatures = [
          ...candidaturesArray,
          {
            ...candidature,
            id: Date.now().toString(),
            profil_id: candidat.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as Candidature,
        ];
      } else if (isEditingSpecific && editingIndex >= 0) {
        // Modifier une candidature existante
        updatedCandidatures = [...candidaturesArray];
        updatedCandidatures[editingIndex] = {
          ...candidature,
          updated_at: new Date().toISOString(),
        } as Candidature;
      } else {
        throw new Error("Mode d'édition non reconnu");
      }

      if (updateField) {
        await updateField("candidatures", updatedCandidatures);
      } else {
        // Fallback vers Supabase direct
        const { error } = await supabase
          .from("profils")
          .update({
            candidatures: updatedCandidatures,
            updated_at: new Date().toISOString(),
          })
          .eq("id", candidat.id);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de la candidature");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium">
          {isAddingNew ? "Ajouter une candidature" : "Modifier la candidature"}
        </h4>
      </div>

      {/* Sélection du mandat */}
      <div>
        <Label htmlFor="mandat_id">Mandat *</Label>
        <Select
          value={candidature.mandat_id || ""}
          onValueChange={(value) =>
            setCandidature({ ...candidature, mandat_id: value })
          }
          disabled={mandatsLoading}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                mandatsLoading ? "Chargement..." : "Sélectionnez un mandat"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {mandats.map((mandat) => (
              <SelectItem key={mandat.id} value={mandat.id}>
                {mandat.titre} - {getClientName(mandat.entreprise_id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date de candidature */}
      <div>
        <Label htmlFor="date_candidature">Date de candidature *</Label>
        <Input
          id="date_candidature"
          type="date"
          value={candidature.date_candidature || ""}
          onChange={(e) =>
            setCandidature({ ...candidature, date_candidature: e.target.value })
          }
          required
        />
      </div>

      {/* Statut */}
      <div>
        <Label htmlFor="statut">Statut *</Label>
        <Select
          value={candidature.statut || "postule"}
          onValueChange={(value) =>
            setCandidature({
              ...candidature,
              statut: value as Candidature["statut"],
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="postule">Postulé</SelectItem>
            <SelectItem value="preselectionne">Présélectionné</SelectItem>
            <SelectItem value="entretien">Entretien</SelectItem>
            <SelectItem value="retenu">Retenu</SelectItem>
            <SelectItem value="refuse">Refusé</SelectItem>
            <SelectItem value="retire">Retiré</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
