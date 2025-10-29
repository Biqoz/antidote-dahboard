"use client";

import { useState } from "react";
import {
  Briefcase,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  Euro,
  Edit,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Mandat } from "@/types/mandat";

interface MandatItemProps {
  mandat: Mandat;
}

export function MandatItem({ mandat }: MandatItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    ouvert: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: "🔵",
      label: "Ouvert",
    },
    en_cours: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: "🟡",
      label: "En cours",
    },
    ferme: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "🟢",
      label: "Fermé",
    },
    suspendu: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: "🔴",
      label: "Suspendu",
    },
  };

  const status =
    statusConfig[mandat.statut as keyof typeof statusConfig] ||
    statusConfig.ouvert;
  const createdDate = new Date(mandat.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200">
      {/* Header - Cliquable */}
      <div className="p-4 cursor-pointer select-none" onClick={toggleExpanded}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Briefcase className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 leading-tight">
                {mandat.titre}
              </h4>
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
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}
            >
              {status.icon} {status.label}
            </span>
            <div className="p-1 hover:bg-gray-100 rounded transition-colors">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </div>
        </div>

        {/* Aperçu description quand fermé */}
        {!isExpanded && mandat.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
            {mandat.description}
          </p>
        )}
      </div>

      {/* Contenu déployable */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Description complète */}
          {mandat.description && (
            <div className="mb-4 pt-4">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                📋 Description du poste
              </h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                {mandat.description}
              </p>
            </div>
          )}

          {/* Détails techniques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                💼 Informations contractuelles
              </h5>

              {mandat.type_contrat && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Type de contrat:</span>
                  <span className="font-medium text-gray-900">
                    {mandat.type_contrat === "determine"
                      ? "Déterminé"
                      : "Indéterminé"}
                  </span>
                </div>
              )}

              {(mandat.salaire_min || mandat.salaire_max) && (
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Salaire:</span>
                  <span className="font-medium text-gray-900">
                    {mandat.salaire_min && mandat.salaire_max
                      ? `${mandat.salaire_min}k - ${mandat.salaire_max}k €`
                      : mandat.salaire_min
                      ? `À partir de ${mandat.salaire_min}k €`
                      : `Jusqu'à ${mandat.salaire_max}k €`}
                  </span>
                </div>
              )}

              {mandat.localisation && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Lieu:</span>
                  <span className="font-medium text-gray-900">
                    {mandat.localisation}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                📊 Suivi du mandat
              </h5>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Créé le:</span>
                <span className="font-medium text-gray-900">{createdDate}</span>
              </div>

              {mandat.nombre_postes && (
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Postes:</span>
                  <span className="font-medium text-gray-900">
                    {mandat.nombre_postes}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    mandat.statut === "ouvert"
                      ? "bg-blue-500"
                      : mandat.statut === "en_cours"
                      ? "bg-yellow-500"
                      : mandat.statut === "ferme"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-gray-600">Statut:</span>
                <span className="font-medium text-gray-900">
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* Compétences requises */}
          {mandat.competences_requises && mandat.competences_requises.trim() && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                🎯 Compétences requises
              </h5>
              <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">
                {mandat.competences_requises}
              </div>
            </div>
          )}

          {/* Compétences souhaitées */}
          {mandat.competences_souhaitees && mandat.competences_souhaitees.trim() && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                💡 Compétences souhaitées
              </h5>
              <div className="text-sm text-blue-700 bg-blue-50 p-2 rounded-md border border-blue-200 whitespace-pre-wrap">
                {mandat.competences_souhaitees}
              </div>
            </div>
          )}

          {/* Actions - Seulement Éditer */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <Button
              size="sm"
              variant="outline"
              className="text-gray-600 hover:text-gray-900"
            >
              <Edit className="h-3 w-3 mr-1" />
              Éditer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
