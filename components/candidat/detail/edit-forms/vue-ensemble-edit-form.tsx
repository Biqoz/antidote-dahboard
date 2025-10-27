import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
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
import { supabase } from "@/lib/supabase";

interface VueEnsembleEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function VueEnsembleEditForm({
  candidat,
  onSuccess,
  onCancel,
}: VueEnsembleEditFormProps) {
  const [formData, setFormData] = useState({
    nom: candidat.nom || "",
    prenom: candidat.prenom || "",
    email: candidat.email || "",
    telephone: candidat.telephone || "",
    ville: candidat.ville || "",
    statut: candidat.statut || "",
    specialisation: candidat.specialisation || "",
    niveau_experience: candidat.niveau_experience || "",
    salaire_souhaite: candidat.salaire_souhaite || "",
    disponibilite: candidat.disponibilite || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profils")
        .update({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          ville: formData.ville,
          statut: formData.statut,
          specialisation: formData.specialisation,
          niveau_experience: formData.niveau_experience,
          salaire_souhaite: formData.salaire_souhaite,
          disponibilite: formData.disponibilite,
          updated_at: new Date().toISOString(),
        })
        .eq("id", candidat.id);

      if (error) throw error;

      alert("Informations générales mises à jour avec succès");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour des informations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input
            id="prenom"
            value={formData.prenom}
            onChange={(e) => handleInputChange("prenom", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => handleInputChange("nom", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            value={formData.telephone}
            onChange={(e) => handleInputChange("telephone", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ville">Ville</Label>
          <Input
            id="ville"
            value={formData.ville}
            onChange={(e) => handleInputChange("ville", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select
            value={formData.statut}
            onValueChange={(value) => handleInputChange("statut", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="recrute">Recruté</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="specialisation">Spécialisation</Label>
        <Input
          id="specialisation"
          value={formData.specialisation}
          onChange={(e) => handleInputChange("specialisation", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="niveau_experience">Niveau d&apos;expérience</Label>
          <Select
            value={formData.niveau_experience}
            onValueChange={(value) =>
              handleInputChange("niveau_experience", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Junior (0-2 ans)</SelectItem>
              <SelectItem value="intermediaire">
                Intermédiaire (2-5 ans)
              </SelectItem>
              <SelectItem value="senior">Senior (5-10 ans)</SelectItem>
              <SelectItem value="expert">Expert (10+ ans)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="salaire_souhaite">Salaire souhaité</Label>
          <Input
            id="salaire_souhaite"
            value={formData.salaire_souhaite}
            onChange={(e) =>
              handleInputChange("salaire_souhaite", e.target.value)
            }
            placeholder="Ex: 45000€"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="disponibilite">Disponibilité</Label>
        <Input
          id="disponibilite"
          value={formData.disponibilite}
          onChange={(e) => handleInputChange("disponibilite", e.target.value)}
          placeholder="Ex: Immédiate, Dans 1 mois..."
        />
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
