import { useState, useEffect, useCallback } from "react";
import { CandidatureService } from "@/services/candidature-service";
import { Candidature, CreateCandidatureData, UpdateCandidatureData } from "@/types/candidat";

export function useCandidatures(mandatId?: string, profilId?: string) {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidatures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Candidature[];
      
      if (mandatId) {
        data = await CandidatureService.getByMandatId(mandatId);
      } else if (profilId) {
        data = await CandidatureService.getByProfilId(profilId);
      } else {
        data = await CandidatureService.getAll();
      }
      
      setCandidatures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [mandatId, profilId]);

  useEffect(() => {
    fetchCandidatures();
  }, [fetchCandidatures]);

  const createCandidature = async (candidatureData: CreateCandidatureData) => {
    try {
      const newCandidature = await CandidatureService.create(candidatureData);
      setCandidatures(prev => [newCandidature, ...prev]);
      return newCandidature;
    } catch (err) {
      throw err;
    }
  };

  const updateCandidature = async (updateData: UpdateCandidatureData) => {
    try {
      const updatedCandidature = await CandidatureService.update(updateData);
      setCandidatures(prev => 
        prev.map(c => c.id === updateData.id ? updatedCandidature : c)
      );
      return updatedCandidature;
    } catch (err) {
      throw err;
    }
  };

  const deleteCandidature = async (id: string) => {
    try {
      await CandidatureService.delete(id);
      setCandidatures(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const updateStatut = async (id: string, statut: Candidature['statut']) => {
    try {
      const updatedCandidature = await CandidatureService.updateStatut(id, statut);
      setCandidatures(prev => 
        prev.map(c => c.id === id ? updatedCandidature : c)
      );
      return updatedCandidature;
    } catch (err) {
      throw err;
    }
  };

  return {
    candidatures,
    loading,
    error,
    refetch: fetchCandidatures,
    createCandidature,
    updateCandidature,
    deleteCandidature,
    updateStatut
  };
}

export function useCandidatureStats(mandatId?: string) {
  const [stats, setStats] = useState({
    total: 0,
    postule: 0,
    preselectionne: 0,
    entretien: 0,
    retenu: 0,
    refuse: 0,
    retire: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await CandidatureService.getCandidatureStats(mandatId);
        setStats(data);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [mandatId]);

  return { stats, loading };
}