import { useState } from "react";
import { useAllMandats } from "@/hooks/use-all-mandats";
import { useCandidatures } from "@/hooks/use-candidatures";
import { useClients } from "@/hooks/use-clients";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCandidatureData, Candidat } from "@/types/candidat";
import { X } from "lucide-react";

interface CandidatMandatLinkProps {
  candidat: Candidat;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  embedded?: boolean; // Nouveau prop pour l'affichage intégré
}

const statutLabels = {
  postule: "Postulé",
  preselectionne: "Présélectionné",
  entretien: "Entretien",
  retenu: "Retenu",
  refuse: "Refusé",
  retire: "Retiré",
};

export function CandidatMandatLink({
  candidat,
  isOpen,
  onClose,
  onSuccess,
  embedded = false,
}: CandidatMandatLinkProps) {
  const { mandats, loading: mandatsLoading } = useAllMandats();
  const { clients } = useClients();
  const { createCandidature } = useCandidatures();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getClientName = (entrepriseId: string) => {
    const client = clients.find((c) => c.id === entrepriseId);
    return client?.nom || "Client inconnu";
  };

  const [formData, setFormData] = useState<CreateCandidatureData>({
    profil_id: candidat.id,
    mandat_id: "",
    statut: "postule",
    score_adequation: undefined,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mandat_id) {
      alert("Veuillez sélectionner un mandat");
      return;
    }

    try {
      setIsSubmitting(true);
      await createCandidature(formData);
      onSuccess?.();
      onClose();

      // Réinitialiser le formulaire
      setFormData({
        profil_id: candidat.id,
        mandat_id: "",
        statut: "postule",
        score_adequation: undefined,
        notes: "",
      });
    } catch (error) {
      console.error("Erreur lors de la création de la candidature:", error);
      
      // Afficher un message d'erreur spécifique
      if (error instanceof Error) {
        if (error.message.includes("déjà postulé")) {
          alert("Ce candidat a déjà postulé pour ce mandat");
        } else {
          alert(`Erreur: ${error.message}`);
        }
      } else {
        alert("Erreur lors de la liaison avec le mandat");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const formContent = (
    <>
      {!embedded && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lier à un mandat</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
      )}
      <CardContent className={embedded ? "p-0" : ""}>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              {candidat.prenom} {candidat.nom}
            </p>
            <p className="text-xs text-gray-600">
              {candidat.specialisation || "Spécialisation non renseignée"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="mandat_id">Mandat</Label>
              <Select
                value={formData.mandat_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, mandat_id: value }))
                }
                disabled={mandatsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mandat" />
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

            <div>
              <Label htmlFor="statut">Statut initial</Label>
              <Select
                value={formData.statut || "postule"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    statut: value as CreateCandidatureData["statut"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statutLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="score_adequation">
                Score d&apos;adéquation (optionnel)
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.score_adequation || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    score_adequation: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
                placeholder="Score sur 100"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Notes sur la candidature..."
                rows={3}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.mandat_id}
                className="flex-1"
              >
                {isSubmitting ? "Liaison..." : "Lier au mandat"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            </div>
          </form>
      </CardContent>
    </>
  );

  if (embedded) {
    return (
      <div className="space-y-4">
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        {formContent}
      </Card>
    </div>
  );
}
