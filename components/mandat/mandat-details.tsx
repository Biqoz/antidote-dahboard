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

      {/* Compétences */}
      {mandat.competences_requises &&
        mandat.competences_requises.length > 0 && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              🎯 Compétences requises
            </h5>
            <div className="flex flex-wrap gap-2">
              {mandat.competences_requises.map(
                (competence: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                  >
                    {competence}
                  </span>
                )
              )}
            </div>
          </div>
        )}

      <MandatActions />
    </div>
  );
}
