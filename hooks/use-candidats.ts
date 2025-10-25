import { useState, useEffect } from "react";
import { Candidat } from "@/types/candidat";
import { CandidatService } from "@/services/profils-service";

export function useCandidats() {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats calculées à partir des candidats
  const stats = {
    total: candidats.length,
    actifs: candidats.filter((c) => c.statut === "actif").length,
    en_recherche: candidats.filter((c) => c.statut === "en_recherche").length,
    places: candidats.filter((c) => c.statut === "place").length,
  };

  const fetchCandidats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CandidatService.getAll();
      setCandidats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidats();
  }, []);

  const createCandidat = async (
    candidat: Omit<Candidat, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const newCandidat = await CandidatService.create(candidat);
      setCandidats((prev) => [newCandidat, ...prev]);
      return newCandidat;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
      );
      throw err;
    }
  };

  const updateCandidat = async (id: string, candidat: Partial<Candidat>) => {
    try {
      const updatedCandidat = await CandidatService.update(id, candidat);
      setCandidats((prev) =>
        prev.map((c) => (c.id === id ? updatedCandidat : c))
      );
      return updatedCandidat;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour"
      );
      throw err;
    }
  };

  const deleteCandidat = async (id: string) => {
    try {
      await CandidatService.delete(id);
      setCandidats((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
      throw err;
    }
  };

  // Alias pour refreshCandidats
  const refreshCandidats = fetchCandidats;

  return {
    candidats,
    stats,
    loading,
    error,
    fetchCandidats,
    refreshCandidats,
    createCandidat,
    updateCandidat,
    deleteCandidat,
  };
}
