import { useState, useEffect, useCallback } from "react";
import { ContactNote, CreateContactNoteData, UpdateContactNoteData } from "@/types/client";
import { ContactNotesService } from "@/services/contact-notes-service";

export function useContactNotes(contactId: string) {
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ContactNotesService.getByContactId(contactId);
      setNotes(data);
    } catch (err) {
      console.error("Erreur lors du chargement des notes:", err);
      setError("Impossible de charger les notes");
    } finally {
      setIsLoading(false);
    }
  }, [contactId]);

  const createNote = async (noteData: CreateContactNoteData): Promise<ContactNote | null> => {
    try {
      setError(null);
      const newNote = await ContactNotesService.create(noteData);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      console.error("Erreur lors de la création de la note:", err);
      setError("Impossible de créer la note");
      return null;
    }
  };

  const updateNote = async (updateData: UpdateContactNoteData): Promise<ContactNote | null> => {
    try {
      setError(null);
      const updatedNote = await ContactNotesService.update(updateData);
      setNotes(prev => prev.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
      return updatedNote;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la note:", err);
      setError("Impossible de mettre à jour la note");
      return null;
    }
  };

  const deleteNote = async (noteId: string): Promise<boolean> => {
    try {
      setError(null);
      await ContactNotesService.delete(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression de la note:", err);
      setError("Impossible de supprimer la note");
      return false;
    }
  };

  const getStats = () => {
    const total = notes.length;
    const parType = notes.reduce((acc, note) => {
      const type = note.type || "generale";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, parType };
  };

  useEffect(() => {
    if (contactId) {
      loadNotes();
    }
  }, [contactId, loadNotes]);

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: loadNotes,
    stats: getStats(),
  };
}