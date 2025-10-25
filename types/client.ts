export interface Client {
  id: string;
  nom: string;
  secteur_activite?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  contact_principal?: string;
  notes?: string;
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
  pays?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  contact_principal?: string;
  notes?: string;
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
  pays?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  contact_principal?: string;
  notes?: string;
  statut?: "actif" | "inactif" | "prospect";
}

export interface ClientFilters {
  search?: string;
  secteur_activite?: string;
  statut?: string;
  ville?: string;
}

export interface ClientStats {
  total: number;
  actifs: number;
  prospects: number;
  inactifs: number;
}
