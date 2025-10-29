import { Clock, Euro, MapPin, Calendar } from "lucide-react";
import { Mandat } from "@/types/mandat";
import { MandatActions } from "./mandat-actions";
import { formatSalary, formatDate } from "@/lib/formatters";

interface MandatDetailsProps {
  mandat: Mandat;
}

export function MandatDetails({ mandat }: MandatDetailsProps) {
  const createdDate = formatDate(mandat.created_at);

  return (
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
                {formatSalary(mandat.salaire_min, mandat.salaire_max)}
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

          {mandat.nombre_postes && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Postes:</span>
              <span className="font-medium text-gray-900">
                {mandat.nombre_postes}
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
        </div>
      </div>

      {/* Compétences requises */}
      {mandat.competences_requises && mandat.competences_requises.trim() && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            🎯 Compétences requises
          </h5>
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
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
          <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-md border border-blue-200 whitespace-pre-wrap">
            {mandat.competences_souhaitees}
          </div>
        </div>
      )}

      <MandatActions />
    </div>
  );
}
