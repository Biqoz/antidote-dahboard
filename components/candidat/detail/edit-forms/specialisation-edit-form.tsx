import React, { useState } from "react";
import { Candidat, SpecialisationItem } from "@/types/candidat";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface SpecialisationEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
  editingItemId?: string | null;
}

export function SpecialisationEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
  editingItemId,
}: SpecialisationEditFormProps) {
  // Déterminer si on édite un élément spécifique ou on ajoute un nouveau
  const isEditingSpecific = editingItemId && editingItemId.startsWith('specialisation-');
  const isAddingNew = editingItemId === 'specialisation-new';
  const editingIndex = isEditingSpecific && !isAddingNew ? parseInt(editingItemId.split('-')[1]) : -1;
  
  // Gérer les spécialisations qui peuvent être stockées comme string JSON
  const getSpecialisationsArray = () => {
    try {
      if (Array.isArray(candidat.specialisations)) {
        return candidat.specialisations;
      } else if (typeof candidat.specialisations === 'string') {
        return JSON.parse(candidat.specialisations);
      }
      return [];
    } catch (error) {
      console.error('Erreur lors du parsing des spécialisations:', error);
      return [];
    }
  };

  // État pour l'élément en cours d'édition
  const [specialisation, setSpecialisation] = useState<SpecialisationItem>(() => {
    const specialisationsArray = getSpecialisationsArray();
    if (isEditingSpecific && !isAddingNew && specialisationsArray[editingIndex]) {
      return specialisationsArray[editingIndex];
    }
    // Nouvel élément
    return {
      id: Date.now().toString(),
      nom: "",
      niveau: "debutant",
      domaine: "",
      certifie: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const updateSpecialisationField = (field: keyof SpecialisationItem, value: string | boolean) => {
    setSpecialisation(prev => ({
      ...prev,
      [field]: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentSpecialisations = getSpecialisationsArray();
      console.log('currentSpecialisations:', currentSpecialisations);
      console.log('specialisation à ajouter:', specialisation);
      console.log('isAddingNew:', isAddingNew, 'editingIndex:', editingIndex);
      
      let updatedSpecialisations;

      if (isAddingNew || editingIndex === -1) {
        // Ajouter une nouvelle spécialisation
        updatedSpecialisations = [...currentSpecialisations, specialisation];
      } else {
        // Modifier une spécialisation existante
        updatedSpecialisations = currentSpecialisations.map((item: SpecialisationItem, index: number) =>
          index === editingIndex ? specialisation : item
        );
      }

      if (updateField) {
        console.log('Utilisation de updateField avec:', updatedSpecialisations);
        await updateField("specialisations", updatedSpecialisations);
        console.log('updateField terminé avec succès');
        onSuccess();
      } else {
        const { error } = await supabase
          .from("profils")
          .update({
            specialisations: updatedSpecialisations,
            updated_at: new Date().toISOString(),
          })
          .eq("id", candidat.id);

        if (error) throw error;
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de la spécialisation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isAddingNew ? "Ajouter une spécialisation" : "Modifier la spécialisation"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom de la spécialisation</Label>
              <Input
                id="nom"
                value={specialisation.nom}
                onChange={(e) => updateSpecialisationField("nom", e.target.value)}
                placeholder="Ex: Développement React"
                required
              />
            </div>
            <div>
              <Label htmlFor="domaine">Domaine</Label>
              <Input
                id="domaine"
                value={specialisation.domaine}
                onChange={(e) => updateSpecialisationField("domaine", e.target.value)}
                placeholder="Ex: Développement web"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="niveau">Niveau</Label>
              <Select
                value={specialisation.niveau}
                onValueChange={(value) => updateSpecialisationField("niveau", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="certifie"
                checked={specialisation.certifie}
                onChange={(e) => updateSpecialisationField("certifie", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="certifie">Certifications</Label>
            </div>
          </div>

          {specialisation.certifie && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organisme">Organisme de certification</Label>
                <Input
                  id="organisme"
                  value={specialisation.organisme_certification || ""}
                  onChange={(e) => updateSpecialisationField("organisme_certification", e.target.value)}
                  placeholder="Ex: Microsoft, AWS, Google"
                />
              </div>
              <div>
                <Label htmlFor="date_obtention">Date d&apos;obtention</Label>
                <Input
                  id="date_obtention"
                  type="date"
                  value={specialisation.date_obtention || ""}
                  onChange={(e) => updateSpecialisationField("date_obtention", e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
