import React, { useState } from "react";
import { Candidat, ReconnaissanceDiplome } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface ReconnaissancesEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
  editingItemId?: string | null;
}

export function ReconnaissancesEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
  editingItemId,
}: ReconnaissancesEditFormProps) {
  // Déterminer si on édite un élément spécifique ou on ajoute un nouveau
  const isEditingSpecific = editingItemId && editingItemId.startsWith('reconnaissance-');
  const editingIndex = isEditingSpecific ? parseInt(editingItemId.split('-')[1]) : -1;
  
  // État pour l'élément en cours d'édition
  const [reconnaissance, setReconnaissance] = useState<ReconnaissanceDiplome>(() => {
    if (isEditingSpecific && candidat.reconnaissances_diplomes?.[editingIndex]) {
      return candidat.reconnaissances_diplomes[editingIndex];
    }
    return {}; // Nouvel élément
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const updateReconnaissanceField = (field: keyof ReconnaissanceDiplome, value: string | string[]) => {
    setReconnaissance(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (updateField) {
        // Mettre à jour la liste complète des reconnaissances
        const updatedReconnaissances = [...(candidat.reconnaissances_diplomes || [])];
        
        if (isEditingSpecific) {
          // Modifier l'élément existant
          updatedReconnaissances[editingIndex] = reconnaissance;
        } else {
          // Ajouter un nouvel élément
          updatedReconnaissances.push(reconnaissance);
        }
        
        await updateField('reconnaissances_diplomes', updatedReconnaissances);
      } else {
        const { error } = await supabase
          .from('profils')
          .update({ reconnaissances_diplomes: [reconnaissance] })
          .eq('id', candidat.id);

        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditingSpecific ? 'Modifier la reconnaissance' : 'Ajouter une reconnaissance'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Organisme</Label>
              <Input
                value={reconnaissance.organisme || ''}
                onChange={(e) => updateReconnaissanceField('organisme', e.target.value)}
                placeholder="Université de Paris"
              />
            </div>
            <div>
              <Label>Organisme de reconnaissance</Label>
              <Input
                value={reconnaissance.organisme_reconnaissance || ''}
                onChange={(e) => updateReconnaissanceField('organisme_reconnaissance', e.target.value)}
                placeholder="ENIC-NARIC France"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Statut</Label>
              <Select
                value={reconnaissance.statut || ''}
                onValueChange={(value) => updateReconnaissanceField('statut', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="reconnu">Reconnu</SelectItem>
                  <SelectItem value="non_reconnu">Non reconnu</SelectItem>
                  <SelectItem value="non_applicable">Non applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date de reconnaissance</Label>
              <Input
                type="date"
                value={reconnaissance.date_reconnaissance || ''}
                onChange={(e) => updateReconnaissanceField('date_reconnaissance', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pays d&apos;origine</Label>
              <Input
                value={reconnaissance.pays_origine || ''}
                onChange={(e) => updateReconnaissanceField('pays_origine', e.target.value)}
                placeholder="France"
              />
            </div>
            <div>
              <Label>Numéro d&apos;autorisation</Label>
              <Input
                value={reconnaissance.numero_autorisation || ''}
                onChange={(e) => updateReconnaissanceField('numero_autorisation', e.target.value)}
                placeholder="AUTH-2024-001"
              />
            </div>
          </div>

          <div>
            <Label>Équivalence</Label>
            <Input
              value={reconnaissance.equivalence || ''}
              onChange={(e) => updateReconnaissanceField('equivalence', e.target.value)}
              placeholder="Master français en informatique"
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Input
              value={reconnaissance.notes || ''}
              onChange={(e) => updateReconnaissanceField('notes', e.target.value)}
              placeholder="Notes additionnelles"
            />
          </div>
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
