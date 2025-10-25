"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, MessageSquare, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactNote, CreateContactNoteData } from "@/types/client";
import { ContactNotesService } from "@/services/contact-notes-service";
// import { formatDistanceToNow } from "date-fns";
// import { fr } from "date-fns/locale";

interface ContactNotesProps {
  contactId: string;
  contactName: string;
}

const NOTE_TYPES = [
  { value: "generale", label: "Générale", color: "default" },
  { value: "commercial", label: "Commercial", color: "success" },
  { value: "technique", label: "Technique", color: "secondary" },
  { value: "suivi", label: "Suivi", color: "warning" },
] as const;

export function ContactNotes({ contactId, contactName }: ContactNotesProps) {
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<ContactNote | null>(null);
  const [newNote, setNewNote] = useState<CreateContactNoteData>({
    contact_id: contactId,
    titre: "",
    contenu: "",
    type: "generale",
    auteur: "",
  });

  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ContactNotesService.getByContactId(contactId);
      setNotes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreateNote = async () => {
    if (!newNote.contenu.trim()) return;

    try {
      const createdNote = await ContactNotesService.create(newNote);
      setNotes([createdNote, ...notes]);
      setNewNote({
        contact_id: contactId,
        titre: "",
        contenu: "",
        type: "generale",
        auteur: "",
      });
      setIsCreating(false);
    } catch (error) {
      console.error("Erreur lors de la création de la note:", error);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.contenu.trim()) return;

    try {
      const updatedNote = await ContactNotesService.update(editingNote);
      setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
      setEditingNote(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return;

    try {
      await ContactNotesService.delete(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error);
    }
  };

  const getTypeConfig = (type: string) => {
    return NOTE_TYPES.find(t => t.value === type) || NOTE_TYPES[0];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notes - {contactName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Chargement des notes...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notes - {contactName} ({notes.length})
          </CardTitle>
          <Button
            onClick={() => setIsCreating(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulaire de création */}
        {isCreating && (
          <Card className="border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-titre">Titre (optionnel)</Label>
                  <Input
                    id="new-titre"
                    value={newNote.titre}
                    onChange={(e) => setNewNote({ ...newNote, titre: e.target.value })}
                    placeholder="Titre de la note"
                  />
                </div>
                <div>
                  <Label htmlFor="new-type">Type</Label>
                  <Select
                    value={newNote.type}
                    onValueChange={(value) => setNewNote({ ...newNote, type: value as "generale" | "commercial" | "technique" | "suivi" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="new-auteur">Auteur (optionnel)</Label>
                <Input
                  id="new-auteur"
                  value={newNote.auteur}
                  onChange={(e) => setNewNote({ ...newNote, auteur: e.target.value })}
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <Label htmlFor="new-contenu">Contenu *</Label>
                <Textarea
                  id="new-contenu"
                  value={newNote.contenu}
                  onChange={(e) => setNewNote({ ...newNote, contenu: e.target.value })}
                  placeholder="Contenu de la note..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateNote} disabled={!newNote.contenu.trim()}>
                  Créer la note
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des notes */}
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune note pour ce contact</p>
            <p className="text-sm">Cliquez sur &quot;Ajouter une note&quot; pour commencer</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <Card key={note.id} className="relative">
                <CardContent className="pt-4">
                  {editingNote?.id === note.id ? (
                    // Mode édition
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-titre">Titre</Label>
                          <Input
                            id="edit-titre"
                            value={editingNote.titre || ""}
                            onChange={(e) => setEditingNote({ ...editingNote, titre: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-type">Type</Label>
                          <Select
                            value={editingNote.type}
                            onValueChange={(value) => setEditingNote({ ...editingNote, type: value as "generale" | "commercial" | "technique" | "suivi" })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {NOTE_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="edit-contenu">Contenu</Label>
                        <Textarea
                          id="edit-contenu"
                          value={editingNote.contenu}
                          onChange={(e) => setEditingNote({ ...editingNote, contenu: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateNote} size="sm">
                          Sauvegarder
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingNote(null)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={getTypeConfig(note.type || "generale").color as "default" | "secondary" | "destructive" | "outline"}>
                            {getTypeConfig(note.type || "generale").label}
                          </Badge>
                          {note.titre && (
                            <h4 className="font-medium">{note.titre}</h4>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingNote(note)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                        {note.contenu}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {note.auteur && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {note.auteur}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(note.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                        {note.updated_at !== note.created_at && (
                          <span>(modifiée)</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}