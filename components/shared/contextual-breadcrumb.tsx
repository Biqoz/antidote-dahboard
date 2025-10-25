"use client";

import { ChevronRight, Building2, FileText, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/client";
import { Mandat } from "@/types/mandat";

interface ContextualBreadcrumbProps {
  client?: Client;
  mandat?: Mandat;
  onNavigateToHome?: () => void;
  onNavigateToCandidats?: () => void;
  onNavigateToMandats?: () => void;
  onNavigateToClient?: (clientId: string) => void;
}

export function ContextualBreadcrumb({
  client,
  mandat,
  onNavigateToHome,
  onNavigateToCandidats,
  onNavigateToMandats,
  onNavigateToClient,
}: ContextualBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
      {/* Accueil */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNavigateToHome}
        className="h-auto p-1 text-gray-600 hover:text-gray-900"
      >
        <Home className="h-4 w-4" />
      </Button>

      <ChevronRight className="h-3 w-3 text-gray-400" />

      {/* CLIENTS */}
      <span className="text-sm text-gray-600">CLIENTS</span>

      {/* Si on a un client ou un mandat */}
      {(client || mandat) && (
        <>
          <ChevronRight className="h-3 w-3 text-gray-400" />

          {/* Navigation vers les candidats ou mandats */}
          {client && !mandat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToCandidats}
              className="h-auto p-1 text-blue-600 hover:text-blue-800"
            >
              <Building2 className="h-3 w-3 mr-1" />
              Candidats
            </Button>
          )}

          {mandat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToMandats}
              className="h-auto p-1 text-green-600 hover:text-green-800"
            >
              <FileText className="h-3 w-3 mr-1" />
              Mandats
            </Button>
          )}
        </>
      )}

      {/* Client spécifique */}
      {client && (
        <>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <div className="flex items-center gap-2">
            {mandat && onNavigateToClient ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateToClient(client.id)}
                className="h-auto p-1 text-blue-600 hover:text-blue-800"
              >
                <Building2 className="h-3 w-3 mr-1" />
                {client.nom}
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {client.nom}
                </span>
              </div>
            )}
            {client.secteur_activite && (
              <Badge variant="outline" className="text-xs">
                {client.secteur_activite}
              </Badge>
            )}
          </div>
        </>
      )}

      {/* Mandat spécifique */}
      {mandat && (
        <>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              {mandat.titre}
            </span>
            <Badge
              variant={mandat.statut === "ouvert" ? "default" : "secondary"}
              className="text-xs"
            >
              {mandat.statut === "ouvert"
                ? "Ouvert"
                : mandat.statut === "en_cours"
                ? "En cours"
                : mandat.statut === "ferme"
                ? "Fermé"
                : "Suspendu"}
            </Badge>
          </div>
        </>
      )}
    </div>
  );
}
