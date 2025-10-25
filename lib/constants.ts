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
  freelance: "Freelance",
  stage: "Stage",
  interim: "Intérim",
} as const;

export const COMPANY_SIZES = {
  startup: "Startup (1-10)",
  pme: "PME (11-250)",
  eti: "ETI (251-5000)",
  grand_groupe: "Grand groupe (5000+)",
} as const;