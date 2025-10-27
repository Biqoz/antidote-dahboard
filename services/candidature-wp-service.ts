import { supabase } from "@/lib/supabase";
import { CandidatureWP } from "@/types/candidat";

export class CandidatureWPService {
  static async getAll(): Promise<CandidatureWP[]> {
    try {
      const { data, error } = await supabase
        .from('candidatures_wp')
        .select('*')
        .is('is_selected', null)
        .order('"Created At"', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des candidatures WP:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur dans getAll candidatures WP:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<CandidatureWP | null> {
    try {
      const { data, error } = await supabase
        .from('candidatures_wp')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de la candidature WP:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur dans getById candidature WP:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('candidatures_wp')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression de la candidature WP:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erreur dans delete candidature WP:', error);
      throw error;
    }
  }

  static async search(query: string): Promise<CandidatureWP[]> {
    try {
      const { data, error } = await supabase
        .from('candidatures_wp')
        .select('*')
        .is('is_selected', null)
        .or(`"Nom".ilike.%${query}%,"Prénom".ilike.%${query}%,"Email".ilike.%${query}%,"Job Title".ilike.%${query}%`)
        .order('"Created At"', { ascending: false });

      if (error) {
        console.error('Erreur lors de la recherche des candidatures WP:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur dans search candidatures WP:', error);
      throw error;
    }
  }

  static async updateStatus(id: string, isSelected: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('candidatures_wp')
        .update({ is_selected: isSelected })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erreur dans updateStatus candidature WP:', error);
      throw error;
    }
  }
}