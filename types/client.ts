export interface Client {
  id: string;
  nom: string;
  secteur_activite?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  prefixe?: string;
  pays?: string;
  tel_fixe?: string;
  tel_portable?: string;
  email?: string;
  site_web?: string;
  contact_administratif?: string;
  statut?: "actif" | "inactif" | "prospect";
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  nom: string;
  statut: "actif" | "inactif" | "prospect";
  secteur_activite?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  prefixe?: string;
  pays?: string;
  tel_fixe?: string;
  tel_portable?: string;
  email?: string;
  site_web?: string;
  contact_administratif?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string;
}

export interface ClientFormData {
  nom: string;
  secteur_activite?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  prefixe?: string;
  pays?: string;
  tel_fixe?: string;
  tel_portable?: string;
  email?: string;
  site_web?: string;
  contact_administratif?: string;
  statut?: "actif" | "inactif" | "prospect";
}

export interface ClientFilters {
  search?: string;
  secteur_activite?: string;
  statut?: string;
  ville?: string;
}

export interface ContactNote {
  id: string;
  contact_id: string;
  titre?: string;
  contenu: string;
  type?: "generale" | "commercial" | "technique" | "suivi";
  auteur?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactNoteData {
  contact_id: string;
  titre?: string;
  contenu: string;
  type?: "generale" | "commercial" | "technique" | "suivi";
  auteur?: string;
}

export interface UpdateContactNoteData extends Partial<CreateContactNoteData> {
  id: string;
}

export interface ClientStats {
  total: number;
  actifs: number;
  prospects: number;
  inactifs: number;
}
