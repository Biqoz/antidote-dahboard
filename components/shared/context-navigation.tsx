"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  FileText,
  ArrowRight,
  ExternalLink,
  MapPin,
  Euro,
  Calendar,
} from "lucide-react";
import { Client } from "@/types/client";
import { Mandat } from "@/types/mandat";

interface ContextNavigationProps {
  type: "client-to-mandats" | "mandat-to-client";
  client?: Client;
  mandat?: Mandat;
  mandatsCount?: number;
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToMandats?: (clientId: string) => void;
  onNavigateToMandat?: (mandatId: string) => void;
}

export function ContextNavigation({
  type,
  client,
  mandat,
  mandatsCount = 0,
  onNavigateToClient,
  onNavigateToMandats,
  onNavigateToMandat,
}: ContextNavigationProps) {
  if (type === "client-to-mandats" && client) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <Building2 className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {client.nom}
                </h2>
                <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                  {client.secteur_activite && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {client.secteur_activite}
                    </span>
                  )}
                  {client.ville && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {client.ville}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Client depuis{" "}
                    {new Date(client.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-white text-gray-700 border border-gray-200"
              >
                {mandatsCount} mandat{mandatsCount > 1 ? "s" : ""}
              </Badge>
              {onNavigateToMandats && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onNavigateToMandats(client.id)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-white"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Voir tous les mandats
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "mandat-to-client" && mandat && client) {
    const formatSalaire = (min?: number, max?: number) => {
      if (!min && !max) return "Non spécifié";
      if (min && max) return `${min}k - ${max}k €`;
      if (min) return `À partir de ${min}k €`;
      if (max) return `Jusqu'à ${max}k €`;
      return "Non spécifié";
    };

    const getStatusLabel = (statut: string) => {
      switch (statut) {
        case "ouvert":
          return "Ouvert";
        case "en_cours":
          return "En cours";
        case "ferme":
          return "Fermé";
        case "suspendu":
          return "Suspendu";
        default:
          return statut;
      }
    };

    return (
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <FileText className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {mandat.titre}
                </h2>
                <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {client.nom}
                  </span>
                  {mandat.localisation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {mandat.localisation}
                    </span>
                  )}
                  {(mandat.salaire_min || mandat.salaire_max) && (
                    <span className="flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      {formatSalaire(mandat.salaire_min, mandat.salaire_max)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Créé le{" "}
                    {new Date(mandat.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-white text-gray-700 border border-gray-200"
              >
                {getStatusLabel(mandat.statut)}
              </Badge>
              <div className="flex items-center gap-2">
                {onNavigateToClient && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onNavigateToClient(client.id)}
                    className="text-gray-600 hover:text-gray-900 hover:bg-white"
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    Voir le contact
                  </Button>
                )}
                {onNavigateToMandat && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onNavigateToMandat(mandat.id)}
                    className="text-gray-600 hover:text-gray-900 hover:bg-white"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Détails complets
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
