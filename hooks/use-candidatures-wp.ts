import { useState, useEffect } from 'react';
import { CandidatureWP, Candidat } from '@/types/candidat';
import { CandidatureWPService } from '@/services/candidature-wp-service';
import { CandidatService } from '@/services/profils-service';

export function useCandidaturesWP() {
  const [candidatures, setCandidatures] = useState<CandidatureWP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidatures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CandidatureWPService.getAll();
      setCandidatures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Erreur lors du chargement des candidatures WP:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidature = async (id: string) => {
    try {
      await CandidatureWPService.delete(id);
      setCandidatures(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  const searchCandidatures = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await CandidatureWPService.search(query);
      setCandidatures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
      console.error('Erreur lors de la recherche des candidatures WP:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCandidatureStatus = async (id: string, isSelected: boolean) => {
    try {
      await CandidatureWPService.updateStatus(id, isSelected);
      // Supprimer la candidature de la liste locale car elle n'est plus is_selected = null
      setCandidatures(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const createProfileFromCandidature = async (candidature: CandidatureWP) => {
    try {
      // Mapper les champs de CandidatureWP vers Candidat
      const profilData: Omit<Candidat, "id" | "created_at" | "updated_at"> = {
        nom: candidature["Nom"] || "",
        prenom: candidature["Prénom"] || "",
        email: candidature["Email"] || "",
        telephone: candidature["Numéro de téléphone"]?.toString() || "",
        cv_url: candidature["Votre CV"] || "",
        specialisations: candidature["Job Title"] ? [{
          id: crypto.randomUUID(),
          nom: candidature["Job Title"],
          niveau: "intermediaire" as const,
          domaine: "general",
          certifie: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }] : [],
        statut: "en_recherche",
        source_recrutement: "site_web",
      };

      const newProfile = await CandidatService.create(profilData);
      
      // Ajouter une note si il y a un commentaire
      if (candidature["Commentaire"]) {
        // La note sera ajoutée via le service de notes
        console.log("Commentaire à ajouter:", candidature["Commentaire"]);
      }

      return newProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du profil');
      throw err;
    }
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  return {
    candidatures,
    loading,
    error,
    refetch: fetchCandidatures,
    deleteCandidature,
    searchCandidatures,
    updateCandidatureStatus,
    createProfileFromCandidature
  };
}