"use client";

import { useState } from "react";
import { useCandidaturesWP } from "@/hooks/use-candidatures-wp";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/formatters";
import { CandidatureWPSearch } from "./candidature-wp-search";
import { CandidatureWP } from "@/types/candidat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Trash2,
  FileText,
  Mail,
  Phone,
  Heart,
  X,
} from "lucide-react";

export function CandidatureWPList() {
  const {
    candidatures,
    loading,
    error,
    deleteCandidature,
    refetch,
    updateCandidatureStatus,
    createProfileFromCandidature,
  } = useCandidaturesWP();
  const [filteredCandidatures, setFilteredCandidatures] = useState<
    CandidatureWP[]
  >([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Utiliser les candidatures filtrées si la recherche est active, sinon toutes les candidatures
  const displayedCandidatures = isSearchActive
    ? filteredCandidatures
    : candidatures;

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
      return;
    }

    try {
      await deleteCandidature(id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir rejeter cette candidature ?")) {
      return;
    }

    try {
      await updateCandidatureStatus(id, false);
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      alert("Erreur lors du rejet de la candidature");
    }
  };

  const handleValidate = async (candidature: CandidatureWP) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir valider cette candidature et l'ajouter aux profils ?"
      )
    ) {
      return;
    }

    try {
      // Mettre à jour is_selected à TRUE
      await updateCandidatureStatus(candidature.id, true);

      // Créer le profil depuis la candidature
      await createProfileFromCandidature(candidature);

      alert("Candidature validée et profil créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      alert("Erreur lors de la validation de la candidature");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-gray-600">
            Chargement des candidatures WordPress...
          </p>
        </div>
        <LoadingState count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Candidatures WordPress ({displayedCandidatures.length}
          {isSearchActive &&
            candidatures.length > 0 &&
            ` sur ${candidatures.length}`}
          )
        </h2>
      </div>

      <CandidatureWPSearch
        candidatures={candidatures}
        onFilteredCandidatures={setFilteredCandidatures}
        onSearchStateChange={setIsSearchActive}
      />

      {/* Tableau des candidatures */}
      {displayedCandidatures.length === 0 ? (
        <EmptyState
          title={
            isSearchActive ? "Aucun résultat" : "Aucune candidature trouvée"
          }
          description={
            isSearchActive
              ? "Aucune candidature ne correspond à vos critères de recherche."
              : "Aucune candidature WordPress n'a été trouvée."
          }
          icon={<FileText className="h-12 w-12 text-gray-400" />}
        />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Commentaire</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedCandidatures.map((candidature: CandidatureWP) => (
                <TableRow key={candidature.id}>
                  <TableCell>
                    <div className="font-medium">
                      {candidature["Prénom"]} {candidature["Nom"]}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {candidature["Job Title"] || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {candidature["Email"] && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <a
                            href={`mailto:${candidature["Email"]}`}
                            className="hover:text-blue-600 transition-colors truncate max-w-[200px]"
                          >
                            {candidature["Email"]}
                          </a>
                        </div>
                      )}
                      {candidature["Numéro de téléphone"] && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <a
                            href={`tel:${candidature["Numéro de téléphone"]}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {candidature["Numéro de téléphone"]}
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {candidature["Created At"]
                        ? formatDate(candidature["Created At"])
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 max-w-[200px] truncate">
                      {candidature["Commentaire"] || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {candidature["Votre CV"] && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(candidature["Votre CV"], "_blank")
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleValidate(candidature)}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Valider et ajouter aux profils"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(candidature.id)}
                        className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        title="Rejeter la candidature"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(candidature.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
