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
  // Anciens champs simples (gardés pour compatibilité)
  specialisation?: string;
  
  // Nouveaux champs multi-éléments
  specialisations?: SpecialisationItem[];
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

  // Compétences (JSONB dans la DB)
  competences?: string[]; // JSONB array
  competences_techniques?: string[]; // JSONB array
  competences_linguistiques?: LangueCompetence[]; // JSONB array

  // Analyse IA (JSONB dans la DB)
  analyse_ia?: AnalyseIA;

  // Reconnaissances diplômes / Autorisations (JSONB dans la DB)
  reconnaissances_diplomes?: ReconnaissanceDiplome[];

  // Source et motivation (JSONB dans la DB)
  source_motivation?: SourceMotivation;
  motivations?: MotivationItem[];

  // Jobs ciblés (JSONB dans la DB)
  jobs_cibles?: JobCible[];

  // Mémoire IA (JSONB dans la DB)
  memoire_ia?: MemoireIA;
  interactions_ia?: InteractionIA[];
  notes_profil?: NoteItem[];

  // Notes (relation avec profil_notes)
  profil_notes?: Note[];

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
  id: string;
  profil_id: string;
  contenu: string;
  type?: string; // 'remarque' par défaut
  created_at: string;
}

export interface Candidature {
  id: string;
  profil_id: string;
  mandat_id: string;
  statut: 'postule' | 'preselectionne' | 'entretien' | 'retenu' | 'refuse' | 'retire';
  date_candidature: string;
  date_derniere_action?: string;
  score_adequation?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  etapes_recrutement?: EtapeRecrutement[];
  // Relations
  profils?: {
    nom: string;
    prenom: string;
    email?: string;
    specialisation?: string;
    telephone?: string;
  };
  mandat?: {
    id: string;
    titre: string;
    entreprise_id: string;
    statut?: string;
  };
  mandats?: {
    titre: string;
    entreprise_id: string;
    statut?: string;
  };
}

export interface CreateCandidatureData {
  profil_id: string;
  mandat_id: string;
  statut?: 'postule' | 'preselectionne' | 'entretien' | 'retenu' | 'refuse' | 'retire';
  score_adequation?: number;
  notes?: string;
}

export interface UpdateCandidatureData {
  id: string;
  statut?: 'postule' | 'preselectionne' | 'entretien' | 'retenu' | 'refuse' | 'retire';
  score_adequation?: number;
  notes?: string;
  date_derniere_action?: string;
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

// Interfaces pour les champs JSONB
export interface AnalyseIA {
  score_global?: number;
  competences_detectees?: string[];
  points_forts?: string[];
  points_amelioration?: string[];
  recommandations?: string[];
  derniere_analyse?: string;
}

export interface ReconnaissanceDiplome {
  statut?: 'reconnu' | 'en_cours' | 'non_reconnu' | 'non_applicable';
  organisme?: string;
  organisme_reconnaissance?: string;
  date_reconnaissance?: string;
  equivalence?: string;
  documents_requis?: string[];
  notes?: string;
  pays_origine?: string;
  numero_autorisation?: string;
}

export interface SourceMotivation {
  source?: string;
  canal_acquisition?: string;
  motivation_principale?: string;
  motivations_principales?: string[];
  objectifs_carriere?: string | string[];
  preferences_poste?: {
    type_contrat?: string;
    localisation?: string[];
    secteur_prefere?: string[];
    salaire_min?: number;
    salaire_max?: number;
  };
  preferences_travail?: string[];
  zones_mobilite?: string[];
}

export interface MemoireIA {
  contenu?: string;
  interactions?: {
    date: string;
    type: string;
    description: string;
  }[];
  preferences_utilisateur?: Record<string, unknown>;
  historique_modifications?: {
    date: string;
    champ: string;
    ancienne_valeur?: unknown;
    nouvelle_valeur?: unknown;
  }[];
  notes_ia?: string[];
  derniere_mise_a_jour?: string;
}

// Nouvelles interfaces pour les structures multi-éléments
export interface MotivationItem {
  id: string;
  titre: string;
  description: string;
  priorite?: 'haute' | 'moyenne' | 'basse';
  date_creation: string;
  updated_at: string;
}

export interface SpecialisationItem {
  id: string;
  nom: string;
  niveau: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  domaine: string;
  certifie: boolean;
  organisme_certification?: string;
  date_obtention?: string;
  date_expiration?: string;
  created_at: string;
  updated_at: string;
}

export interface ReconnaissanceItem {
  id: string;
  diplome: string;
  organisme_delivrance: string;
  organisme_reconnaissance: string;
  statut: 'en_cours' | 'reconnu' | 'refuse' | 'partiel';
  date_obtention?: string;
  date_reconnaissance?: string;
  pays_obtention: string;
  equivalence?: string;
  date_creation: string;
}

export interface NoteItem {
  id: string;
  titre: string;
  contenu: string;
  categorie: 'general' | 'entretien' | 'competences' | 'suivi' | 'motivation' | 'administratif';
  priorite: 'haute' | 'normale' | 'basse' | 'urgente';
  date_creation: string;
  date_modification: string;
}

export interface InteractionIA {
  id: string;
  type: 'conversation' | 'analyse' | 'recommandation' | 'evaluation' | 'formation';
  contenu: string;
  reponse_ia: string;
  contexte?: string;
  score_pertinence: number;
  date_interaction: string;
}

export interface JobCible {
  id: string;
  titre: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Interface pour les candidatures WordPress
export interface CandidatureWP {
  id: string;
  "Job Title"?: string;
  "Nom"?: string;
  "Prénom"?: string;
  "Email"?: string;
  "Numéro de téléphone"?: number;
  "Votre CV"?: string;
  "Commentaire"?: string;
  "GDPR"?: string;
  "Created At"?: string;
  "Referrer"?: string;
}
