import { User, MapPin, Briefcase, Eye } from "lucide-react";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CandidatListProps {
  candidats: Candidat[];
  loading: boolean;
  onCandidatSelect?: (candidat: Candidat) => void;
}

export function CandidatList({
  candidats,
  loading,
  onCandidatSelect,
}: CandidatListProps) {
  if (loading) {
    return <LoadingState count={3} className="h-32" />;
  }

  if (candidats.length === 0) {
    return (
      <EmptyState
        title="Aucun candidat"
        description="Aucun candidat n'a été ajouté au vivier"
        actionLabel="Ajouter le premier candidat"
        onAction={() => {
          /* TODO: Implement create candidat */
        }}
        icon={
          <div className="p-4 bg-gray-100 rounded-full">
            <User className="h-8 w-8 text-gray-400" />
          </div>
        }
      />
    );
  }

  const getStatusColor = (statut?: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "en_recherche":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "place":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "inactif":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (statut?: string) => {
    switch (statut) {
      case "actif":
        return "Actif";
      case "en_recherche":
        return "En recherche";
      case "place":
        return "Placé";
      case "inactif":
        return "Inactif";
      default:
        return "Non défini";
    }
  };

  return (
    <div className="space-y-4">
      {candidats.map((candidat) => (
        <div
          key={candidat.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {candidat.prenom} {candidat.nom}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    {candidat.adresse && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{candidat.adresse}</span>
                      </div>
                    )}
                    {candidat.specialisation && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{candidat.specialisation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={getStatusColor(candidat.statut)}
                >
                  {getStatusLabel(candidat.statut)}
                </Badge>

                {candidat.niveau_experience && (
                  <Badge variant="secondary">
                    {candidat.niveau_experience}
                  </Badge>
                )}

                {candidat.salaire_souhaite && (
                  <Badge variant="outline">
                    {candidat.salaire_souhaite.toLocaleString()}€
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCandidatSelect?.(candidat)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Voir détails
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
