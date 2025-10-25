import { useMemo } from "react";
import { useAllMandats } from "./use-all-mandats";

export function useMandatsCount() {
  // Récupérer tous les mandats
  const { mandats } = useAllMandats();

  const getMandatsCount = useMemo(() => {
    return (entrepriseId: string): number => {
      return mandats.filter((mandat) => mandat.entreprise_id === entrepriseId)
        .length;
    };
  }, [mandats]);

  return { getMandatsCount };
}
