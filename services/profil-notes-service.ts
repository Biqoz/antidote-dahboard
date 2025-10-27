import { supabase } from "@/lib/supabase";
import { Note } from "@/types/candidat";

export class ProfilNotesService {
  static async getByProfilId(profilId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from("profil_notes")
      .select("*")
      .eq("profil_id", profilId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des notes:", error);
      throw error;
    }

    return data || [];
  }

  static async create(profilId: string, contenu: string, type: string = "remarque"): Promise<Note> {
    const { data, error } = await supabase
      .from("profil_notes")
      .insert({
        profil_id: profilId,
        contenu,
        type,
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création de la note:", error);
      throw error;
    }

    return data;
  }

  static async update(id: string, contenu: string, type?: string): Promise<Note> {
    const updateData: { contenu: string; type?: string } = { contenu };
    if (type) updateData.type = type;

    const { data, error } = await supabase
      .from("profil_notes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour de la note:", error);
      throw error;
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("profil_notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression de la note:", error);
      throw error;
    }
  }

  static async createMultiple(profilId: string, notes: string[]): Promise<Note[]> {
    const notesToInsert = notes
      .filter(note => note.trim() !== "")
      .map(note => ({
        profil_id: profilId,
        contenu: note.trim(),
        type: "remarque",
      }));

    if (notesToInsert.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from("profil_notes")
      .insert(notesToInsert)
      .select();

    if (error) {
      console.error("Erreur lors de la création des notes:", error);
      throw error;
    }

    return data || [];
  }
}