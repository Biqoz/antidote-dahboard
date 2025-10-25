export interface Candidat {
  id: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  specialisation?: string;
  niveau_experience?: string;
  salaire_souhaite?: number;
  disponibilite?: string;
  statut: string; // 'actif', 'inactif', 'en_recherche', 'place'

  // CV et documents
  cv_url?: string;
  cv_text?: string;
  photo_url?: string;

  // Expériences professionnelles
  experiences?: Experience[];

  // Formation
  formations?: Formation[];

  // Compétences
  competences?: string[];
  competences_techniques?: string[];
  competences_linguistiques?: LangueCompetence[];

  // Analyse IA
  analyse_ia?: {
    score_global?: number;
    points_forts?: string[];
    points_amelioration?: string[];
    recommandations?: string[];
    derniere_analyse?: string;
  };

  // Reconnaissance diplôme / Autorisation
  reconnaissance_diplome?: {
    pays_origine?: string;
    diplome_reconnu?: boolean;
    organisme_reconnaissance?: string;
    date_reconnaissance?: string;
    numero_autorisation?: string;
    validite_autorisation?: string;
  };

  // Source de motivation
  source_motivation?: {
    motivations_principales?: string[];
    objectifs_carriere?: string;
    preferences_travail?: string[];
    mobilite_geographique?: boolean;
    zones_mobilite?: string[];
  };

  // Notes et suivi
  notes?: Note[];

  // Candidatures
  candidatures?: Candidature[];

  // Métadonnées
  source_recrutement?: string; // 'site_web', 'linkedin', 'cooptation', 'chasse'
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface Experience {
  id?: string;
  entreprise: string;
  poste: string;
  description?: string;
  date_debut: string;
  date_fin?: string; // null si poste actuel
  lieu?: string;
  secteur?: string;
  competences_acquises?: string[];
}

export interface Formation {
  id?: string;
  etablissement: string;
  diplome: string;
  niveau: string; // 'bac', 'bac+2', 'bac+3', 'bac+5', 'doctorat'
  specialite?: string;
  date_debut: string;
  date_fin: string;
  lieu?: string;
  mention?: string;
}

export interface LangueCompetence {
  langue: string;
  niveau: string; // 'debutant', 'intermediaire', 'avance', 'bilingue', 'natif'
  certification?: string;
}

export interface Note {
  id?: string;
  contenu: string;
  type?: string; // 'entretien', 'suivi', 'remarque'
  date: string;
  auteur?: string;
}

export interface Candidature {
  id?: string;
  mandat_id: string;
  candidat_id: string;
  statut: string; // 'postule', 'preselectionne', 'entretien', 'retenu', 'refuse'
  date_candidature: string;
  date_derniere_action?: string;
  score_adequation?: number;
  etapes_recrutement?: EtapeRecrutement[];
}

export interface EtapeRecrutement {
  id?: string;
  nom: string;
  statut: string; // 'en_attente', 'en_cours', 'termine', 'annule'
  date_prevue?: string;
  date_realisee?: string;
  resultat?: string;
}

// Type pour la création d'un candidat (sans les champs auto-générés)
export type CreateCandidatData = Omit<Candidat, "id" | "created_at" | "updated_at">;

export interface CandidatStats {
  total: number;
  actifs: number;
  en_recherche: number;
  places: number;
  inactifs: number;
}
