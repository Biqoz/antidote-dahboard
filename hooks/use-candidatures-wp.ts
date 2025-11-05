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

  const processCV = async (cvData: string | undefined): Promise<{ cv_url?: string; cv_text?: string }> => {
    if (!cvData) return {};

    // Si c'est déjà du base64 (commence par data:application/pdf)
    if (cvData.startsWith('data:application/pdf')) {
      return { cv_text: cvData };
    }

    // Si c'est une URL, utiliser un proxy Next.js pour éviter CORS
    if (cvData.startsWith('http://') || cvData.startsWith('https://')) {
      try {
        console.log('Téléchargement du CV via proxy depuis:', cvData);

        // Utiliser l'API route Next.js comme proxy
        const response = await fetch('/api/proxy-cv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: cvData }),
        });

        if (!response.ok) {
          console.error('Erreur lors du téléchargement du CV via proxy:', response.status);
          return { cv_url: cvData }; // Fallback: garder l'URL
        }

        const blob = await response.blob();

        // Convertir en base64
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            console.log('CV converti en base64, taille:', Math.round(base64.length / 1024), 'KB');
            resolve({ cv_text: base64 });
          };
          reader.onerror = () => {
            console.error('Erreur lors de la conversion en base64');
            resolve({ cv_url: cvData }); // Fallback: garder l'URL
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Erreur lors du traitement du CV:', error);
        return { cv_url: cvData }; // Fallback: garder l'URL
      }
    }

    // Si c'est du base64 brut (sans prefix)
    if (cvData.length > 100) {
      return { cv_text: `data:application/pdf;base64,${cvData}` };
    }

    return { cv_url: cvData };
  };

  const createProfileFromCandidature = async (candidature: CandidatureWP) => {
    try {
      // Traiter le CV
      const cvData = await processCV(candidature["Votre CV"]);

      // Mapper les champs de CandidatureWP vers Candidat
      const profilData: Omit<Candidat, "id" | "created_at" | "updated_at"> = {
        nom: candidature["Nom"] || "",
        prenom: candidature["Prénom"] || "",
        email: candidature["Email"] || "",
        telephone: candidature["Numéro de téléphone"]?.toString() || "",
        ...cvData, // Ajouter cv_url ou cv_text selon le cas
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