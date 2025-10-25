import { supabase } from "@/lib/supabase";
import { Candidat } from "@/types/candidat";

export class CandidatService {
  static async getAll(): Promise<Candidat[]> {
    const { data, error } = await supabase
      .from("profils")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des candidats:", error);
      throw error;
    }

    return data || [];
  }

  static async getById(id: string): Promise<Candidat | null> {
    const { data, error } = await supabase
      .from("profils")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du candidat:", error);
      throw error;
    }

    return data;
  }

  static async create(
    candidat: Omit<Candidat, "id" | "created_at" | "updated_at">
  ): Promise<Candidat> {
    const { data, error } = await supabase
      .from("profils")
      .insert([candidat])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création du candidat:", error);
      throw error;
    }

    return data;
  }

  static async update(
    id: string,
    candidat: Partial<Candidat>
  ): Promise<Candidat> {
    const { data, error } = await supabase
      .from("profils")
      .update({ ...candidat, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour du candidat:", error);
      throw error;
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("profils").delete().eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression du candidat:", error);
      throw error;
    }
  }

  static async searchBySpecialisation(
    specialisation: string
  ): Promise<Candidat[]> {
    const { data, error } = await supabase
      .from("profils")
      .select("*")
      .ilike("specialisation", `%${specialisation}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la recherche par spécialisation:", error);
      throw error;
    }

    return data || [];
  }

  static async getCandidaturesByMandatId(
    mandatId: string
  ): Promise<Candidat[]> {
    const { data, error } = await supabase
      .from("candidatures")
      .select(
        `
        *,
        profils (*)
      `
      )
      .eq("mandat_id", mandatId);

    if (error) {
      console.error("Erreur lors de la récupération des candidatures:", error);
      throw error;
    }

    return data?.map((item) => item.profils).filter(Boolean) || [];
  }
}
