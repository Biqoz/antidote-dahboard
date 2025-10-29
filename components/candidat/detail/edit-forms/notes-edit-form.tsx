import React, { useState, useEffect } from "react";
import { Candidat, Note } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface NotesEditFormProps {
  candidat: Candidat;
  editingItemId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NotesEditForm({
  candidat,
  editingItemId,
  onSuccess,
  onCancel,
}: NotesEditFormProps) {
  const [note, setNote] = useState<Partial<Note>>({
    contenu: "",
    type: "remarque",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingItemId) {
      // Mode édition - charger la note existante
      const existingNote = candidat.profil_notes?.find(n => n.id === editingItemId);
      if (existingNote) {
        setNote({
          contenu: existingNote.contenu,
          type: existingNote.type || "remarque",
        });
      }
    } else {
      // Mode ajout - réinitialiser le formulaire
      setNote({
        contenu: "",
        type: "remarque",
      });
    }
  }, [editingItemId, candidat.profil_notes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!note.contenu?.trim()) {
        alert("Le contenu de la note est requis");
        return;
      }

      if (editingItemId) {
        // Mode édition - mettre à jour la note existante
        const { error } = await supabase
          .from('profil_notes')
          .update({
            contenu: note.contenu,
            type: note.type,
          })
          .eq('id', editingItemId);

        if (error) throw error;
      } else {
        // Mode ajout - créer une nouvelle note
        const { error } = await supabase
          .from('profil_notes')
          .insert({
            profil_id: candidat.id,
            contenu: note.contenu,
            type: note.type,
          });

        if (error) throw error;
      }

      alert(editingItemId ? "Note mise à jour avec succès" : "Note ajoutée avec succès");
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert("Erreur lors de la sauvegarde de la note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {editingItemId ? "Modifier la note" : "Ajouter une note"}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="type">Type de note</Label>
          <Select
            value={note.type || "remarque"}
            onValueChange={(value) => setNote({ ...note, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remarque">Remarque</SelectItem>
              <SelectItem value="entretien">Entretien</SelectItem>
              <SelectItem value="suivi">Suivi</SelectItem>
              <SelectItem value="competences">Compétences</SelectItem>
              <SelectItem value="motivation">Motivation</SelectItem>
              <SelectItem value="administratif">Administratif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="contenu">Contenu de la note</Label>
          <Textarea
            id="contenu"
            value={note.contenu || ""}
            onChange={(e) => setNote({ ...note, contenu: e.target.value })}
            rows={6}
            placeholder="Saisissez le contenu de la note..."
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : editingItemId ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}