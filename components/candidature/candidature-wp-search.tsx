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
import { CandidatureWP } from "@/types/candidat";

interface CandidatureWPSearchProps {
  candidatures: CandidatureWP[];
  onFilteredCandidatures: (candidatures: CandidatureWP[]) => void;
  onSearchStateChange?: (isActive: boolean) => void;
}

export function CandidatureWPSearch({
  candidatures,
  onFilteredCandidatures,
  onSearchStateChange,
}: CandidatureWPSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fonction de recherche globale dans tous les champs
  const searchInCandidature = (candidature: CandidatureWP, term: string): boolean => {
    if (!term || term.trim() === "") return true;

    // Diviser le terme de recherche en mots individuels
    const searchWords = term.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
    
    // Fonction pour vérifier si un mot est présent dans un texte
    const containsWord = (text: string | number | undefined | null, word: string): boolean => {
      if (!text) return false;
      return text.toString().toLowerCase().includes(word);
    };

    // Pour chaque mot de recherche, vérifier qu'il est présent quelque part dans les données de la candidature
    return searchWords.every(searchWord => {
      // Recherche dans tous les champs de la candidature
      const fields = [
        candidature["Job Title"],
        candidature["Nom"],
        candidature["Prénom"],
        candidature["Email"],
        candidature["Numéro de téléphone"],
        candidature["Votre CV"],
        candidature["Commentaire"],
        candidature["GDPR"],
        candidature["Referrer"],
      ];

      // Vérifier dans tous les champs
      return fields.some(field => containsWord(field, searchWord));
    });
  };

  // Obtenir la liste unique des postes pour le filtre
  const uniqueJobs = useMemo(() => {
    const jobs = candidatures
      .map(c => c["Job Title"])
      .filter(Boolean)
      .filter((job, index, array) => array.indexOf(job) === index)
      .sort();
    return jobs;
  }, [candidatures]);

  // Filtrage des candidatures
  const filteredCandidatures = useMemo(() => {
    let filtered = candidatures.filter((candidature) =>
      searchInCandidature(candidature, searchTerm)
    );

    // Filtre par poste
    if (jobFilter !== "all") {
      filtered = filtered.filter(
        (candidature) => candidature["Job Title"] === jobFilter
      );
    }

    return filtered;
  }, [candidatures, searchTerm, jobFilter]);

  // Mettre à jour les candidatures filtrées
  useEffect(() => {
    onFilteredCandidatures(filteredCandidatures);
    
    // Signaler si une recherche est active
    const isActive = searchTerm.trim() !== "" || jobFilter !== "all";
    onSearchStateChange?.(isActive);
  }, [filteredCandidatures, onFilteredCandidatures, searchTerm, jobFilter, onSearchStateChange]);

  const clearFilters = () => {
    setSearchTerm("");
    setJobFilter("all");
  };

  const activeFiltersCount = [
    searchTerm,
    jobFilter !== "all" ? jobFilter : null,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans toutes les candidatures (nom, email, poste, commentaire...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
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
            {/* Filtre par poste */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Poste
              </label>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les postes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les postes</SelectItem>
                  {uniqueJobs.map((job) => (
                    <SelectItem key={job} value={job!}>
                      {job}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Résultats de recherche */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredCandidatures.length} candidature
          {filteredCandidatures.length > 1 ? "s" : ""} trouvée
          {filteredCandidatures.length > 1 ? "s" : ""}
          {candidatures.length !== filteredCandidatures.length && (
            <span> sur {candidatures.length} au total</span>
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