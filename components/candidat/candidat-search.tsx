import { useState, useMemo, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Candidat } from "@/types/candidat";

interface CandidatSearchProps {
  candidats: Candidat[];
  onFilteredCandidats: (candidats: Candidat[]) => void;
  onSearchStateChange?: (isActive: boolean) => void;
}

export function CandidatSearch({
  candidats,
  onFilteredCandidats,
  onSearchStateChange,
}: CandidatSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fonction de recherche globale dans tous les champs
  const searchInCandidat = (candidat: Candidat, term: string): boolean => {
    if (!term || term.trim() === "") return true;

    // Diviser le terme de recherche en mots individuels
    const searchWords = term.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
    
    // Fonction pour vérifier si un mot est présent dans un texte
    const containsWord = (text: string | undefined | null, word: string): boolean => {
      if (!text) return false;
      return text.toLowerCase().includes(word);
    };
    
    // Fonction pour vérifier si un mot est présent dans un tableau de chaînes
    const containsWordInArray = (array: string[] | undefined | null, word: string): boolean => {
      if (!array) return false;
      return array.some(item => containsWord(item, word));
    };

    // Pour chaque mot de recherche, vérifier qu'il est présent quelque part dans les données du candidat
    return searchWords.every(searchWord => {
      // Recherche dans les champs principaux
      const mainFields = [
        candidat.nom,
        candidat.prenom,
        candidat.email,
        candidat.telephone,
        candidat.adresse,
        candidat.ville,
        candidat.code_postal,
        candidat.pays,
        candidat.specialisation,
        candidat.niveau_experience,
        candidat.disponibilite,
        candidat.statut,
        candidat.source_recrutement,
      ];

      // Vérifier dans les champs principaux
      if (mainFields.some(field => containsWord(field, searchWord))) {
        return true;
      }

      // Recherche dans les compétences
      if (containsWordInArray(candidat.competences, searchWord) ||
          containsWordInArray(candidat.competences_techniques, searchWord)) {
        return true;
      }

      // Recherche dans les compétences linguistiques
      if (candidat.competences_linguistiques?.some(langue =>
        containsWord(langue.langue, searchWord) ||
        containsWord(langue.niveau, searchWord)
      )) {
        return true;
      }

      // Recherche dans les expériences
      if (candidat.experiences?.some(exp =>
        containsWord(exp.entreprise, searchWord) ||
        containsWord(exp.poste, searchWord) ||
        containsWord(exp.description, searchWord) ||
        containsWord(exp.lieu, searchWord) ||
        containsWord(exp.secteur, searchWord) ||
        containsWordInArray(exp.competences_acquises, searchWord)
      )) {
        return true;
      }

      // Recherche dans les formations
      if (candidat.formations?.some(form =>
        containsWord(form.etablissement, searchWord) ||
        containsWord(form.diplome, searchWord) ||
        containsWord(form.niveau, searchWord) ||
        containsWord(form.specialite, searchWord) ||
        containsWord(form.lieu, searchWord) ||
        containsWord(form.mention, searchWord)
      )) {
        return true;
      }

      // Recherche dans les notes
      if (candidat.profil_notes?.some((note: { contenu: string; type?: string }) =>
        containsWord(note.contenu, searchWord) ||
        containsWord(note.type, searchWord)
      )) {
        return true;
      }

      // Recherche dans l'analyse IA
      if (candidat.analyse_ia) {
        const analyse = candidat.analyse_ia;
        if (containsWordInArray(analyse.points_forts, searchWord) ||
            containsWordInArray(analyse.points_amelioration, searchWord) ||
            containsWordInArray(analyse.recommandations, searchWord)) {
          return true;
        }
      }

      // Recherche dans les reconnaissances diplômes
      if (candidat.reconnaissances_diplomes && candidat.reconnaissances_diplomes.length > 0) {
        for (const recoDiplome of candidat.reconnaissances_diplomes) {
          if (containsWord(recoDiplome.pays_origine, searchWord) ||
              containsWord(recoDiplome.organisme_reconnaissance, searchWord) ||
              containsWord(recoDiplome.numero_autorisation, searchWord)) {
            return true;
          }
        }
      }

      // Recherche dans la source de motivation
      if (candidat.source_motivation) {
        const motivation = candidat.source_motivation;
        if (containsWordInArray(motivation.motivations_principales, searchWord) ||
            (typeof motivation.objectifs_carriere === 'string' 
              ? containsWord(motivation.objectifs_carriere, searchWord)
              : containsWordInArray(motivation.objectifs_carriere, searchWord)) ||
            containsWordInArray(motivation.preferences_travail, searchWord) ||
            containsWordInArray(motivation.zones_mobilite, searchWord)) {
          return true;
        }
      }

      return false;
    });
  };

  // Filtrage des candidats
  const filteredCandidats = useMemo(() => {
    let filtered = candidats.filter((candidat) =>
      searchInCandidat(candidat, searchTerm)
    );

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (candidat) => candidat.statut === statusFilter
      );
    }

    // Filtre par niveau d'expérience
    if (experienceFilter !== "all") {
      filtered = filtered.filter(
        (candidat) => candidat.niveau_experience === experienceFilter
      );
    }

    return filtered;
  }, [candidats, searchTerm, statusFilter, experienceFilter]);

  // Mettre à jour les candidats filtrés
  useEffect(() => {
    onFilteredCandidats(filteredCandidats);
    
    // Signaler si une recherche est active
    const isActive = searchTerm.trim() !== "" || statusFilter !== "all" || experienceFilter !== "all";
    onSearchStateChange?.(isActive);
  }, [filteredCandidats, onFilteredCandidats, searchTerm, statusFilter, experienceFilter, onSearchStateChange]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setExperienceFilter("all");
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== "all" ? statusFilter : null,
    experienceFilter !== "all" ? experienceFilter : null,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans tous les champs (nom, compétences, expériences...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtre par statut */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Statut
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="en_recherche">En recherche</SelectItem>
                  <SelectItem value="place">Placé</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre par niveau d'expérience */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Niveau d&apos;expérience
              </label>
              <Select
                value={experienceFilter}
                onValueChange={setExperienceFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="junior">Junior (0-2 ans)</SelectItem>
                  <SelectItem value="intermediaire">
                    Intermédiaire (3-5 ans)
                  </SelectItem>
                  <SelectItem value="senior">Senior (6-10 ans)</SelectItem>
                  <SelectItem value="expert">Expert (10+ ans)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Résultats de recherche */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredCandidats.length} candidat
          {filteredCandidats.length > 1 ? "s" : ""} trouvé
          {filteredCandidats.length > 1 ? "s" : ""}
          {candidats.length !== filteredCandidats.length && (
            <span> sur {candidats.length} au total</span>
          )}
        </span>
        {searchTerm && (
          <span>
            Recherche : <strong>&quot;{searchTerm}&quot;</strong>
          </span>
        )}
      </div>
    </div>
  );
}
