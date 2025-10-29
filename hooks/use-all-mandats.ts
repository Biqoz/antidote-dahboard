import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Mandat } from "@/types/mandat";

export function useAllMandats() {
  const [mandats, setMandats] = useState<Mandat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllMandats = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("mandats")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setMandats(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Erreur lors du chargement des mandats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMandats();
  }, []);

  const refresh = () => {
    fetchAllMandats();
  };

  return { mandats, loading, error, refresh };
}
