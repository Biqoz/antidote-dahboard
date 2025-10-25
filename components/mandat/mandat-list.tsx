import { Briefcase, MapPin, Euro, Calendar, Eye } from "lucide-react";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Mandat } from "@/types/mandat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MandatListProps {
  mandats: Mandat[];
  loading: boolean;
  onMandatSelect?: (mandat: Mandat) => void;
}

export function MandatList({
  mandats,
  loading,
  onMandatSelect,
}: MandatListProps) {
  if (loading) {
    return <LoadingState count={3} className="h-32" />;
  }

  if (mandats.length === 0) {
    return (
      <EmptyState
        title="Aucun mandat"
        description="Ce client n'a pas encore de mandats actifs"
        actionLabel="Créer le premier mandat"
        onAction={() => {
          /* TODO: Implement create mandat */
        }}
        icon={
          <div className="p-4 bg-gray-100 rounded-full">
            <Briefcase className="h-8 w-8 text-gray-400" />
          </div>
        }
      />
    );
  }

  const getStatusColor = (statut?: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "en_cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "termine":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspendu":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatSalaire = (min?: number, max?: number) => {
    if (!min && !max) return "Non spécifié";
    if (min && max) return `${min}k - ${max}k €`;
    if (min) return `À partir de ${min}k €`;
    if (max) return `Jusqu'à ${max}k €`;
    return "Non spécifié";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* En-tête du tableau */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
          <div className="col-span-4">Mandat</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-2">Localisation</div>
          <div className="col-span-2">Salaire</div>
          <div className="col-span-1">Créé le</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Corps du tableau */}
      <div className="divide-y divide-gray-200">
        {mandats.map((mandat) => (
          <div
            key={mandat.id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Mandat */}
              <div className="col-span-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Briefcase className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {mandat.titre}
                    </h3>
                    {mandat.type_contrat && (
                      <p className="text-sm text-gray-500 truncate">
                        {mandat.type_contrat === "determine" ? "Déterminé" : "Indéterminé"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Statut */}
              <div className="col-span-2">
                <Badge
                  className={`px-2 py-1 text-xs font-medium border ${getStatusColor(
                    mandat.statut
                  )}`}
                >
                  {mandat.statut || "Actif"}
                </Badge>
              </div>

              {/* Localisation */}
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">
                    {mandat.localisation || "Non spécifié"}
                  </span>
                </div>
              </div>

              {/* Salaire */}
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Euro className="h-3 w-3" />
                  <span className="truncate">
                    {formatSalaire(mandat.salaire_min, mandat.salaire_max)}
                  </span>
                </div>
              </div>

              {/* Date de création */}
              <div className="col-span-1">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">
                    {new Date(mandat.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1">
                {onMandatSelect && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMandatSelect(mandat)}
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
