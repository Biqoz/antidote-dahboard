"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Note } from "@/types/candidat";
import { ProfilNotesService } from "@/services/profil-notes-service";

interface ProfilNotesProps {
  profilId: string;
  notes: Note[];
  onNotesUpdate?: () => void;
}

export function ProfilNotes({ profilId, notes, onNotesUpdate }: ProfilNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [editNote, setEditNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      await ProfilNotesService.create(profilId, newNote.trim());
      setNewNote("");
      setIsAdding(false);
      onNotesUpdate?.();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = async (id: string) => {
    if (!editNote.trim()) return;

    setLoading(true);
    try {
      await ProfilNotesService.update(id, editNote.trim());
      setEditingId(null);
      setEditNote("");
      onNotesUpdate?.();
    } catch (error) {
      console.error("Erreur lors de la modification de la note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return;

    setLoading(true);
    try {
      await ProfilNotesService.delete(id);
      onNotesUpdate?.();
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditNote(note.contenu);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNote("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Notes ({notes.length})</span>
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding || loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une note
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formulaire d'ajout */}
        {isAdding && (
          <div className="border rounded-lg p-4 bg-blue-50">
            <Textarea
              placeholder="Saisir une nouvelle note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mb-3"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim() || loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote("");
                }}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Liste des notes */}
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucune note pour ce profil</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{note.type || "remarque"}</Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(note.created_at)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(note)}
                      disabled={editingId === note.id || loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {editingId === note.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditNote(note.id)}
                        disabled={!editNote.trim() || loading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{note.contenu}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}