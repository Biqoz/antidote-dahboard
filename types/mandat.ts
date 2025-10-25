export interface Mandat {
  id: string;
  entreprise_id: string;
  titre: string;
  description?: string;
  type_contrat?: "determine" | "indetermine";
  niveau_experience?: string;
  salaire_min?: number;
  salaire_max?: number;
  localisation?: string;
  competences_requises?: string[];
  date_debut?: string;
  statut: "ouvert" | "en_cours" | "ferme" | "suspendu";
  priorite?: "basse" | "normale" | "haute";
  nombre_postes?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}