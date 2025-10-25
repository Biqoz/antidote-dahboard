import { supabase } from "@/lib/supabase";
import {
  Client,
  CreateClientData,
  UpdateClientData,
  ClientFilters,
} from "@/types/client";

export class ClientService {
  private static readonly TABLE_NAME = "contacts";

  static async getAll(filters?: ClientFilters): Promise<Client[]> {
    try {
      let query = supabase
        .from(this.TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.search) {
        query = query.ilike("nom", `%${filters.search}%`);
      }

      if (filters?.secteur_activite) {
        query = query.eq("secteur_activite", filters.secteur_activite);
      }

      if (filters?.statut) {
        query = query.eq("statut", filters.statut);
      }

      if (filters?.ville) {
        query = query.eq("ville", filters.ville);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        throw new Error("Impossible de récupérer les clients");
      }

      return data || [];
    } catch (error) {
      console.error("Erreur ClientService.getAll:", error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du client:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erreur ClientService.getById:", error);
      return null;
    }
  }

  static async create(clientData: CreateClientData): Promise<Client> {
    try {
      console.log("Données à insérer:", clientData);

      const insertData = {
        ...clientData,
        statut: clientData.statut || "prospect",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Données formatées pour insertion:", insertData);

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("Erreur Supabase détaillée:", error);
        console.error("Code d'erreur:", error.code);
        console.error("Message d'erreur:", error.message);
        console.error("Détails:", error.details);
        throw new Error(`Impossible de créer le client: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur ClientService.create:", error);
      throw error;
    }
  }

  static async update(updateData: UpdateClientData): Promise<Client> {
    try {
      const { id, ...dataToUpdate } = updateData;

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update({
          ...dataToUpdate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour du client:", error);
        throw new Error("Impossible de mettre à jour le client");
      }

      return data;
    } catch (error) {
      console.error("Erreur ClientService.update:", error);
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
        console.error("Erreur lors de la suppression du client:", error);
        throw new Error("Impossible de supprimer le client");
      }
    } catch (error) {
      console.error("Erreur ClientService.delete:", error);
      throw error;
    }
  }

  static async getStats(): Promise<{
    total: number;
    actifs: number;
    prospects: number;
    inactifs: number;
  }> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select("statut");

      if (error) {
        console.error("Erreur lors de la récupération des stats:", error);
        return { total: 0, actifs: 0, prospects: 0, inactifs: 0 };
      }

      const stats = data.reduce(
        (acc, client) => {
          acc.total++;
          if (client.statut === "actif") acc.actifs++;
          else if (client.statut === "prospect") acc.prospects++;
          else if (client.statut === "inactif") acc.inactifs++;
          return acc;
        },
        { total: 0, actifs: 0, prospects: 0, inactifs: 0 }
      );

      return stats;
    } catch (error) {
      console.error("Erreur ClientService.getStats:", error);
      return { total: 0, actifs: 0, prospects: 0, inactifs: 0 };
    }
  }
}
