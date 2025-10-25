export const MANDAT_STATUS = {
  ouvert: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "🔵",
    label: "Ouvert",
  },
  en_cours: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "🟡",
    label: "En cours",
  },
  ferme: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "🟢",
    label: "Fermé",
  },
  suspendu: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "🔴",
    label: "Suspendu",
  },
} as const;

export const CONTRACT_TYPES = {
  cdi: "CDI",
  cdd: "CDD",
  stage: "Stage",
  freelance: "Freelance",
  interim: "Intérim",
  apprentissage: "Apprentissage",
  alternance: "Alternance",
} as const;

export const JOB_TYPES = {
  temps_plein: "Temps plein",
  temps_partiel: "Temps partiel",
  contrat: "Contrat",
  stage: "Stage",
  benevolat: "Bénévolat",
} as const;

export const EXPERIENCE_LEVELS = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  senior: "Senior",
  directeur: "Directeur",
  cadre_dirigeant: "Cadre dirigeant",
} as const;

export const COMPANY_SIZES = {
  startup: "Startup (1-10 employés)",
  pme: "PME (11-250 employés)",
  eti: "ETI (251-5000 employés)",
  grande_entreprise: "Grande entreprise (5000+ employés)",
  administration: "Administration publique",
} as const;

export const WORK_MODES = {
  sur_site: "Sur site",
  hybride: "Hybride",
  teletravail: "Télétravail",
} as const;

export const EDUCATION_LEVELS = {
  sans_diplome: "Sans diplôme",
  cap_bep: "CAP/BEP",
  bac: "Baccalauréat",
  bac_2: "Bac+2",
  bac_3: "Bac+3",
  bac_5: "Bac+5",
  doctorat: "Doctorat",
} as const;

export const PRIORITY_LEVELS = {
  basse: "Basse",
  normale: "Normale",
  haute: "Haute",
} as const;

export const SECTORS = [
  "Technologie",
  "Finance",
  "Santé",
  "Éducation",
  "Commerce",
  "Industrie",
  "Services",
  "Immobilier",
  "Transport",
  "Énergie",
  "Médias",
  "Tourisme",
  "Agriculture",
  "Construction",
  "Conseil",
  "Automobile",
  "Aéronautique",
  "Pharmaceutique",
  "Télécommunications",
  "Assurance",
] as const;

export const LANGUAGES = [
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Italien",
  "Portugais",
  "Chinois",
  "Japonais",
  "Arabe",
  "Russe",
  "Néerlandais",
  "Suédois",
  "Norvégien",
  "Danois",
  "Polonais",
  "Tchèque",
  "Hongrois",
  "Grec",
  "Turc",
  "Hindi",
] as const;

export const BENEFITS = [
  "Assurance santé",
  "Tickets restaurant",
  "Télétravail",
  "Horaires flexibles",
  "Formation continue",
  "Plan d'épargne entreprise",
  "Primes de performance",
  "Congés supplémentaires",
  "Salle de sport",
  "Véhicule de fonction",
  "Ordinateur portable",
  "Téléphone professionnel",
  "Mutuelle famille",
  "Crèche d'entreprise",
  "Participation aux bénéfices",
  "Stock-options",
  "Retraite supplémentaire",
  "Comité d'entreprise",
  "Conciergerie",
  "Transport en commun",
] as const;