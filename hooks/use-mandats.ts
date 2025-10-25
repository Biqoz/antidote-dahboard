import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Mandat } from "@/types/mandat";

export function useMandats(entrepriseId: string | null) {
  const [mandats, setMandats] = useState<Mandat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entrepriseId) {
      setMandats([]);
      setLoading(false);
      return;
    }

    async function fetchMandats() {
      try {
        setLoading(true);
        setMandats([]);
        setError(null);

        const { data, error } = await supabase
          .from("mandats")
          .select("*")
          .eq("entreprise_id", entrepriseId)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setMandats(data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des mandats:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    fetchMandats();
  }, [entrepriseId]);

  return { mandats, loading, error };
}