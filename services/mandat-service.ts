import { supabase } from "@/lib/supabase";
import { Mandat } from "@/types/mandat";

export class MandatService {
  private static readonly TABLE_NAME = "mandats";

  // Fonction utilitaire pour nettoyer les données (convertir les chaînes vides en null)
  private static cleanData(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const cleanedData = { ...data };

    console.log("📥 Données avant nettoyage:", JSON.stringify(data, null, 2));

    // Champs obligatoires qui ne doivent pas être null
    const requiredFields = ["titre", "entreprise_id", "statut"];

    // Champs de date spécifiques
    const dateFields = ["date_debut"];

    // Nettoyer tous les champs (sauf les obligatoires)
    Object.keys(cleanedData).forEach((field) => {
      const value = cleanedData[field];

      // Ne pas toucher aux champs obligatoires
      if (requiredFields.includes(field)) {
        console.log(`🔒 Champ obligatoire '${field}' conservé: '${value}'`);
        return;
      }

      // Gestion spéciale des champs de date
      if (dateFields.includes(field)) {
        if (
          value === "" ||
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          console.log(
            `📅 Nettoyage du champ date '${field}': '${value}' -> null`
          );
          cleanedData[field] = null;
        } else {
          console.log(`📅 Champ date '${field}' conservé: '${value}'`);
        }
        return;
      }

      // Convertir les chaînes vides, undefined, ou valeurs falsy en null
      if (value === "" || value === undefined || value === null) {
        console.log(`🧹 Nettoyage du champ '${field}': '${value}' -> null`);
        cleanedData[field] = null;
      }

      // Cas spécial pour les nombres: convertir les chaînes vides en null
      if (
        typeof value === "string" &&
        value.trim() === "" &&
        (field.includes("salaire") ||
          field.includes("nombre") ||
          field.includes("experience"))
      ) {
        console.log(
          `🔢 Nettoyage du champ numérique '${field}': '${value}' -> null`
        );
        cleanedData[field] = null;
      }
    });

    console.log(
      "📤 Données après nettoyage:",
      JSON.stringify(cleanedData, null, 2)
    );
    return cleanedData;
  }

  static async getAll(): Promise<Mandat[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des mandats:", error);
        throw new Error("Impossible de récupérer les mandats");
      }

      return data || [];
    } catch (error) {
      console.error("Erreur MandatService.getAll:", error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Mandat | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du mandat:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erreur MandatService.getById:", error);
      return null;
    }
  }

  static async getByClientId(clientId: string): Promise<Mandat[]> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .eq("entreprise_id", clientId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Erreur lors de la récupération des mandats du client:",
          error
        );
        throw new Error("Impossible de récupérer les mandats du client");
      }

      return data || [];
    } catch (error) {
      console.error("Erreur MandatService.getByClientId:", error);
      throw error;
    }
  }

  static async create(
    mandatData: Omit<Mandat, "id" | "created_at" | "updated_at">
  ): Promise<Mandat> {
    try {
      console.log(
        "🚀 DÉBUT CREATE MANDAT - Données reçues:",
        JSON.stringify(mandatData, null, 2)
      );

      // Nettoyer les données avant insertion
      const cleanedData = this.cleanData(mandatData);
      console.log(
        "✅ Données nettoyées:",
        JSON.stringify(cleanedData, null, 2)
      );

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert([cleanedData])
        .select()
        .single();

      if (error) {
        console.error("Erreur Supabase lors de la création:", error);
        if (error.message?.includes("connection")) {
          throw new Error(
            "Erreur de connexion à la base de données. Vérifiez votre connexion internet."
          );
        }
        throw new Error(`Impossible de créer le mandat: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur MandatService.create:", error);
      throw error;
    }
  }

  static async update(
    id: string,
    mandatData: Partial<Omit<Mandat, "id" | "created_at" | "updated_at">>
  ): Promise<Mandat> {
    try {
      // Nettoyer les données avant mise à jour
      const cleanedData = this.cleanData(mandatData);
      console.log("Données nettoyées:", cleanedData);

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update(cleanedData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour du mandat:", error);
        throw new Error("Impossible de mettre à jour le mandat");
      }

      return data;
    } catch (error) {
      console.error("Erreur MandatService.update:", error);
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
        console.error("Erreur lors de la suppression du mandat:", error);
        throw new Error("Impossible de supprimer le mandat");
      }
    } catch (error) {
      console.error("Erreur MandatService.delete:", error);
      throw error;
    }
  }

  static async getStats(): Promise<{
    total: number;
    ouverts: number;
    en_cours: number;
    fermes: number;
    suspendus: number;
  }> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("statut");

      if (error) {
        console.error(
          "Erreur lors de la récupération des statistiques des mandats:",
          error
        );
        throw new Error("Impossible de récupérer les statistiques des mandats");
      }

      const stats = {
        total: data?.length || 0,
        ouverts: data?.filter((m) => m.statut === "ouvert").length || 0,
        en_cours: data?.filter((m) => m.statut === "en_cours").length || 0,
        fermes: data?.filter((m) => m.statut === "ferme").length || 0,
        suspendus: data?.filter((m) => m.statut === "suspendu").length || 0,
      };

      return stats;
    } catch (error) {
      console.error("Erreur MandatService.getStats:", error);
      throw error;
    }
  }
}
