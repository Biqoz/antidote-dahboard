import React, { useState } from "react";
import { Candidat, NoteItem } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NotesEditFormProps {
  candidat: Candidat;
  onSuccess: () => void;
  onCancel: () => void;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function NotesEditForm({
  candidat,
  onSuccess,
  onCancel,
  updateField,
}: NotesEditFormProps) {
  const [notes, setNotes] = useState<NoteItem[]>(
    candidat.notes_profil || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const addNote = () => {
    const newNote: NoteItem = {
      id: Date.now().toString(),
      titre: "",
      contenu: "",
      categorie: "general",
      priorite: "normale",
      date_creation: new Date().toISOString(),
      date_modification: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const updateNote = (id: string, field: keyof NoteItem, value: string) => {
    setNotes(notes.map(n => 
      n.id === id ? { ...n, [field]: value, date_modification: new Date().toISOString() } : n
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (updateField) {
        await updateField('notes_profil', notes);
      } else {
        const { error } = await supabase
          .from('profils')
          .update({
            notes_profil: notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', candidat.id);

        if (error) throw error;
      }

      alert("Notes mises à jour avec succès");
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert("Erreur lors de la mise à jour des notes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Notes du profil</h3>
        <Button type="button" onClick={addNote} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une note
        </Button>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Note #{note.id}</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeNote(note.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Titre</Label>
                  <Input
                    value={note.titre}
                    onChange={(e) => updateNote(note.id, 'titre', e.target.value)}
                    placeholder="Titre de la note"
                  />
                </div>
                <div>
                  <Label>Catégorie</Label>
                  <Select
                    value={note.categorie}
                    onValueChange={(value) => updateNote(note.id, 'categorie', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Général</SelectItem>
                      <SelectItem value="entretien">Entretien</SelectItem>
                      <SelectItem value="suivi">Suivi</SelectItem>
                      <SelectItem value="competences">Compétences</SelectItem>
                      <SelectItem value="motivation">Motivation</SelectItem>
                      <SelectItem value="administratif">Administratif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priorité</Label>
                  <Select
                    value={note.priorite}
                    onValueChange={(value) => updateNote(note.id, 'priorite', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basse">Basse</SelectItem>
                      <SelectItem value="normale">Normale</SelectItem>
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Contenu</Label>
                <Textarea
                  value={note.contenu}
                  onChange={(e) => updateNote(note.id, 'contenu', e.target.value)}
                  rows={4}
                  placeholder="Contenu de la note..."
                />
              </div>
            </CardContent>
          </Card>
        ))}
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