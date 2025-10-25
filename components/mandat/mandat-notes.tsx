"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, MessageSquare, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MandatNote, CreateMandatNoteData } from "@/types/mandat";
import { MandatNotesService } from "@/services/mandat-notes-service";

interface MandatNotesProps {
  mandatId: string;
  mandatTitre: string;
}

const NOTE_TYPES = [
  { value: "generale", label: "Générale", color: "default" },
  { value: "commercial", label: "Commercial", color: "success" },
  { value: "technique", label: "Technique", color: "secondary" },
  { value: "suivi", label: "Suivi", color: "warning" },
  { value: "candidature", label: "Candidature", color: "info" },
] as const;

const NOTE_PRIORITES = [
  { value: "basse", label: "Basse", color: "secondary", icon: null },
  { value: "normale", label: "Normale", color: "default", icon: null },
  { value: "haute", label: "Haute", color: "destructive", icon: AlertTriangle },
] as const;

export function MandatNotes({ mandatId, mandatTitre }: MandatNotesProps) {
  const [notes, setNotes] = useState<MandatNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<MandatNote | null>(null);
  const [newNote, setNewNote] = useState<CreateMandatNoteData>({
    mandat_id: mandatId,
    titre: "",
    contenu: "",
    type: "generale",
    priorite: "normale",
  });

  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await MandatNotesService.getByMandatId(mandatId);
      setNotes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [mandatId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreateNote = async () => {
    if (!newNote.contenu.trim()) return;

    try {
      const createdNote = await MandatNotesService.create(newNote);
      setNotes([createdNote, ...notes]);
      setNewNote({
        mandat_id: mandatId,
        titre: "",
        contenu: "",
        type: "generale",
        priorite: "normale",
      });
      setIsCreating(false);
    } catch (error) {
      console.error("Erreur lors de la création de la note:", error);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.contenu.trim()) return;

    try {
      const updatedNote = await MandatNotesService.update(editingNote);
      setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
      setEditingNote(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return;

    try {
      await MandatNotesService.delete(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error);
    }
  };

  const getTypeConfig = (type: string) => {
    return NOTE_TYPES.find(t => t.value === type) || NOTE_TYPES[0];
  };

  const getPrioriteConfig = (priorite: string) => {
    return NOTE_PRIORITES.find(p => p.value === priorite) || NOTE_PRIORITES[1];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notes - {mandatTitre}
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
            Notes - {mandatTitre} ({notes.length})
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
              <div className="grid grid-cols-3 gap-4">
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
                    onValueChange={(value) => setNewNote({ ...newNote, type: value as "generale" | "commercial" | "technique" | "suivi" | "candidature" })}
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
                <div>
                  <Label htmlFor="new-priorite">Priorité</Label>
                  <Select
                    value={newNote.priorite}
                    onValueChange={(value) => setNewNote({ ...newNote, priorite: value as "basse" | "normale" | "haute" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTE_PRIORITES.map((priorite) => (
                        <SelectItem key={priorite.value} value={priorite.value}>
                          <div className="flex items-center gap-2">
                            {priorite.icon && (() => {
                              const IconComponent = priorite.icon;
                              return <IconComponent className="h-3 w-3" />;
                            })()}
                            {priorite.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
            <p>Aucune note pour ce mandat</p>
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
                      <div className="grid grid-cols-3 gap-4">
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
                            onValueChange={(value) => setEditingNote({ ...editingNote, type: value as "generale" | "commercial" | "technique" | "suivi" | "candidature" })}
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
                        <div>
                          <Label htmlFor="edit-priorite">Priorité</Label>
                          <Select
                            value={editingNote.priorite}
                            onValueChange={(value) => setEditingNote({ ...editingNote, priorite: value as "basse" | "normale" | "haute" })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {NOTE_PRIORITES.map((priorite) => (
                                <SelectItem key={priorite.value} value={priorite.value}>
                                  <div className="flex items-center gap-2">
                                    {priorite.icon && (() => {
                                      const IconComponent = priorite.icon;
                                      return <IconComponent className="h-3 w-3" />;
                                    })()}
                                    {priorite.label}
                                  </div>
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
                        <Button onClick={handleUpdateNote} disabled={!editingNote.contenu.trim()}>
                          Sauvegarder
                        </Button>
                        <Button variant="outline" onClick={() => setEditingNote(null)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          {note.titre && (
                            <h4 className="font-medium text-sm mb-1">{note.titre}</h4>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getTypeConfig(note.type || "generale").color as "default" | "secondary" | "destructive" | "outline"}>
                              {getTypeConfig(note.type || "generale").label}
                            </Badge>
                            <Badge 
                              variant={getPrioriteConfig(note.priorite || "normale").color as "default" | "secondary" | "destructive" | "outline"}
                              className="flex items-center gap-1"
                            >
                              {getPrioriteConfig(note.priorite || "normale").icon && (
                                (() => {
                                  const IconComponent = getPrioriteConfig(note.priorite || "normale").icon!;
                                  return <IconComponent className="h-3 w-3" />;
                                })()
                              )}
                              {getPrioriteConfig(note.priorite || "normale").label}
                            </Badge>
                          </div>
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
                          <span className="text-xs text-muted-foreground">
                            (modifié le {new Date(note.updated_at).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })})
                          </span>
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