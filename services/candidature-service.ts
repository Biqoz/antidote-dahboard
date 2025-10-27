import { supabase } from "@/lib/supabase";
import {
  Candidature,
  CreateCandidatureData,
  UpdateCandidatureData,
} from "@/types/candidat";

export class CandidatureService {
  static async getAll(): Promise<Candidature[]> {
    const { data, error } = await supabase
      .from("candidatures")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des candidatures:", error);
      throw error;
    }

    return data || [];
  }

  static async getById(id: string): Promise<Candidature | null> {
    const { data, error } = await supabase
      .from("candidatures")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération de la candidature:", error);
      throw error;
    }

    return data;
  }

  static async getByMandatId(mandatId: string): Promise<Candidature[]> {
    const { data, error } = await supabase
      .from("candidatures")
      .select("*")
      .eq("mandat_id", mandatId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Erreur lors de la récupération des candidatures par mandat:",
        error
      );
      throw error;
    }

    return data || [];
  }

  static async getByProfilId(profilId: string): Promise<Candidature[]> {
    const { data, error } = await supabase
      .from("candidatures")
      .select("*")
      .eq("profil_id", profilId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Erreur lors de la récupération des candidatures par profil:",
        error
      );
      throw error;
    }

    return data || [];
  }

  static async create(
    candidatureData: CreateCandidatureData
  ): Promise<Candidature> {
    console.log("Tentative de création de candidature:", candidatureData);

    // Vérifier si la candidature existe déjà
    const { data: existing, error: checkError } = await supabase
      .from("candidatures")
      .select("id")
      .eq("profil_id", candidatureData.profil_id)
      .eq("mandat_id", candidatureData.mandat_id)
      .maybeSingle();

    console.log("Résultat vérification existence:", { existing, checkError });

    // Si il y a une erreur autre que "pas de résultat", on la lance
    if (checkError && checkError.code !== "PGRST116") {
      console.error(
        "Erreur lors de la vérification de candidature existante:",
        checkError
      );
      throw checkError;
    }

    if (existing) {
      throw new Error("Ce candidat a déjà postulé pour ce mandat");
    }

    const insertData = {
      ...candidatureData,
      statut: candidatureData.statut || "postule",
    };

    console.log("Données à insérer:", insertData);

    const { data, error } = await supabase
      .from("candidatures")
      .insert([insertData])
      .select("*")
      .single();

    console.log("Résultat insertion:", { data, error });

    if (error) {
      console.error("Erreur lors de la création de la candidature:", error);
      throw error;
    }

    return data;
  }

  static async update(updateData: UpdateCandidatureData): Promise<Candidature> {
    const { id, ...updates } = updateData;

    const { data, error } = await supabase
      .from("candidatures")
      .update({
        ...updates,
        date_derniere_action: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        *,
        profils:profil_id(nom, prenom, email, specialisation),
        mandats:mandat_id(titre, entreprise_id)
      `
      )
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour de la candidature:", error);
      throw error;
    }

    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("candidatures").delete().eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression de la candidature:", error);
      throw error;
    }
  }

  static async updateStatut(
    id: string,
    statut: Candidature["statut"]
  ): Promise<Candidature> {
    return this.update({ id, statut });
  }

  static async getCandidatureStats(mandatId?: string) {
    let query = supabase.from("candidatures").select("statut");

    if (mandatId) {
      query = query.eq("mandat_id", mandatId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }

    const stats = {
      total: data?.length || 0,
      postule: 0,
      preselectionne: 0,
      entretien: 0,
      retenu: 0,
      refuse: 0,
      retire: 0,
    };

    data?.forEach((candidature) => {
      stats[candidature.statut as keyof typeof stats]++;
    });

    return stats;
  }
}
