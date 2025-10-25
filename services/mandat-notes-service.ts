import { supabase } from "@/lib/supabase";
import {
  MandatNote,
  CreateMandatNoteData,
  UpdateMandatNoteData,
} from "@/types/mandat";

export class MandatNotesService {
  private static readonly TABLE_NAME = "mandat_notes";

  static async getByMandatId(mandatId: string): Promise<MandatNote[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .eq("mandat_id", mandatId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des notes:", error);
        throw new Error("Impossible de récupérer les notes du mandat");
      }

      return data || [];
    } catch (error) {
      console.error("Erreur MandatNotesService.getByMandatId:", error);
      throw error;
    }
  }

  static async create(noteData: CreateMandatNoteData): Promise<MandatNote> {
    try {
      const insertData = {
        ...noteData,
        type: noteData.type || "generale",
        priorite: noteData.priorite || "normale",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création de la note:", error);
        throw new Error(`Impossible de créer la note: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur MandatNotesService.create:", error);
      throw error;
    }
  }

  static async update(updateData: UpdateMandatNoteData): Promise<MandatNote> {
    try {
      const { id, ...dataToUpdate } = updateData;
      
      const updatePayload = {
        ...dataToUpdate,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour de la note:", error);
        throw new Error("Impossible de mettre à jour la note");
      }

      return data;
    } catch (error) {
      console.error("Erreur MandatNotesService.update:", error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erreur lors de la suppression de la note:", error);
        throw new Error("Impossible de supprimer la note");
      }
    } catch (error) {
      console.error("Erreur MandatNotesService.delete:", error);
      throw error;
    }
  }

  static async getById(id: string): Promise<MandatNote | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération de la note:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erreur MandatNotesService.getById:", error);
      return null;
    }
  }

  static async getStatsByMandatId(mandatId: string): Promise<{
    total: number;
    par_type: Record<string, number>;
    par_priorite: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("type, priorite")
        .eq("mandat_id", mandatId);

      if (error) {
        console.error("Erreur lors de la récupération des stats des notes:", error);
        throw new Error("Impossible de récupérer les statistiques des notes");
      }

      const stats = {
        total: data?.length || 0,
        par_type: data?.reduce((acc, note) => {
          const type = note.type || "generale";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {},
        par_priorite: data?.reduce((acc, note) => {
          const priorite = note.priorite || "normale";
          acc[priorite] = (acc[priorite] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {},
      };

      return stats;
    } catch (error) {
      console.error("Erreur MandatNotesService.getStatsByMandatId:", error);
      throw error;
    }
  }
}