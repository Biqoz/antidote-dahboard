"use client";

import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Euro,
  ChevronDown,
  ChevronUp,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Mandat } from "@/types/mandat";
import { MandatStatus } from "./mandat-status";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MandatAccordionCardProps {
  mandat: Mandat;
  onMandatSelect?: (mandat: Mandat) => void;
}

export function MandatAccordionCard({
  mandat,
  onMandatSelect,
}: MandatAccordionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatSalaire = (min?: number, max?: number) => {
    if (!min && !max) return "Non spécifié";
    if (min && max) return `${min}k - ${max}k €`;
    if (min) return `À partir de ${min}k €`;
    if (max) return `Jusqu'à ${max}k €`;
    return "Non spécifié";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 leading-tight">
                {mandat.titre}
              </h3>
              {mandat.type_contrat && (
                <p className="text-sm text-gray-500">
                  {mandat.type_contrat === "determine"
                    ? "Déterminé"
                    : "Indéterminé"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MandatStatus statut={mandat.statut} />
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Description */}
            {mandat.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                  {mandat.description}
                </p>
              </div>
            )}

            {/* Informations détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Salaire:</span>
                  <span className="font-medium">
                    {formatSalaire(mandat.salaire_min, mandat.salaire_max)}
                  </span>
                </div>

                {mandat.localisation && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Lieu:</span>
                    <span className="font-medium">{mandat.localisation}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Créé le:</span>
                  <span className="font-medium">
                    {new Date(mandat.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                {mandat.updated_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Modifié le:</span>
                    <span className="font-medium">
                      {new Date(mandat.updated_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton pour voir les détails */}
            {onMandatSelect && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMandatSelect(mandat);
                  }}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir les détails complets
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
