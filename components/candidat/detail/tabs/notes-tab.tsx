import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NotesTabProps {
  candidat: Candidat;
  onEdit?: (noteId: string) => void;
  onAdd?: () => void;
  onRefresh?: () => void;
}

export function NotesTab({ candidat, onEdit, onAdd, onRefresh }: NotesTabProps) {
  const notes = candidat.profil_notes || [];

  const handleDelete = async (noteId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("profil_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      // Rafraîchir les données
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de la note");
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Button onClick={onAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une note
        </Button>
      </div>

      {/* Liste des notes */}
      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {note.type && (
                      <Badge variant="outline" className="text-xs">
                        {note.type}
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(note.created_at).toLocaleDateString("fr-FR")} à{" "}
                      {new Date(note.created_at).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(note.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-sm whitespace-pre-wrap">{note.contenu}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Aucune note disponible</p>
            <p className="text-sm text-gray-400 mb-4">
              Les notes permettent de garder une trace des interactions et
              observations concernant ce candidat.
            </p>
            <Button onClick={onAdd} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter la première note
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
