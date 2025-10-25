export interface Mandat {
  id: string;
  entreprise_id: string;
  titre: string;
  description?: string;
  type_contrat?: "cdi" | "cdd" | "stage" | "freelance" | "interim" | "apprentissage" | "alternance";
  type_poste?: "temps_plein" | "temps_partiel" | "contrat" | "stage" | "benevolat";
  niveau_experience?: "debutant" | "intermediaire" | "senior" | "directeur" | "cadre_dirigeant";
  secteur_activite?: string;
  taille_entreprise?: "startup" | "pme" | "eti" | "grande_entreprise" | "administration";
  mode_travail?: "sur_site" | "hybride" | "teletravail";
  niveau_etudes?: "sans_diplome" | "cap_bep" | "bac" | "bac_2" | "bac_3" | "bac_5" | "doctorat";
  langues_requises?: string[];
  avantages?: string[];
  salaire_min?: number;
  salaire_max?: number;
  localisation?: string;
  competences_requises?: string[];
  date_debut?: string;
  statut: "ouvert" | "en_cours" | "ferme" | "suspendu";
  priorite?: "basse" | "normale" | "haute";
  nombre_postes?: number;
  created_at: string;
  updated_at: string;
}

export interface MandatNote {
  id: string;
  mandat_id: string;
  titre?: string;
  contenu: string;
  type?: "generale" | "commercial" | "technique" | "suivi" | "candidature";
  priorite?: "basse" | "normale" | "haute";
  created_at: string;
  updated_at: string;
}

export interface CreateMandatNoteData {
  mandat_id: string;
  titre?: string;
  contenu: string;
  type?: "generale" | "commercial" | "technique" | "suivi" | "candidature";
  priorite?: "basse" | "normale" | "haute";
}

export interface UpdateMandatNoteData extends Partial<CreateMandatNoteData> {
  id: string;
}