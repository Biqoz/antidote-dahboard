import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContextNavigation } from "@/components/shared/context-navigation";
import { ArrowLeft, MapPin, Euro, Users, Briefcase } from "lucide-react";
import { Mandat } from "@/types/mandat";
import { Client } from "@/types/client";
import { ClientService } from "@/services/client-service";

interface MandatDetailViewProps {
  mandat: Mandat;
  onBack: () => void;
  onNavigateToClient?: (clientId: string) => void;
}

export function MandatDetailView({
  mandat,
  onBack,
  onNavigateToClient,
}: MandatDetailViewProps) {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (mandat.entreprise_id) {
        try {
          const clientData = await ClientService.getById(
            mandat.entreprise_id
          );
          setClient(clientData);
        } catch (error) {
          console.error("Erreur lors de la récupération du client:", error);
        }
      }
    };

    fetchClient();
  }, [mandat.entreprise_id]);

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

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "ouvert":
        return "bg-green-100 text-green-800 border-green-200";
      case "en_cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ferme":
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
    <div className="min-h-screen bg-white">
      {/* Header ultra-compact */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {mandat.titre}
              </h1>
            </div>
          </div>
          <Badge className={`${getStatusColor(mandat.statut)} text-xs`}>
            {getStatusLabel(mandat.statut)}
          </Badge>
        </div>
      </div>

      {/* Navigation contextuelle */}
      {client && (
        <ContextNavigation
          type="mandat-to-client"
          mandat={mandat}
          client={client}
          onNavigateToClient={onNavigateToClient}
        />
      )}

      {/* Contenu principal - Layout compact */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {/* Informations principales - Compact */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Type de contrat
                  </span>
                </div>
                <p className="text-sm text-gray-900">
                  {mandat.type_contrat ? (mandat.type_contrat === "determine" ? "Déterminé" : "Indéterminé") : "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Lieu
                  </span>
                </div>
                <p className="text-sm text-gray-900">
                  {mandat.localisation || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Postes
                  </span>
                </div>
                <p className="text-sm text-gray-900">
                  {mandat.nombre_postes || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Euro className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Salaire
                  </span>
                </div>
                <p className="text-sm text-gray-900">
                  {formatSalaire(mandat.salaire_min, mandat.salaire_max)}
                </p>
              </div>
            </div>

            {/* Description compacte */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <div className="text-sm text-gray-700 max-h-24 overflow-y-auto">
                {mandat.description || "Aucune description disponible"}
              </div>
            </div>

            {/* Compétences compactes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Compétences
              </h3>
              {mandat.competences_requises &&
              mandat.competences_requises.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {mandat.competences_requises.map((competence, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-white text-gray-700 border"
                    >
                      {competence}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Aucune compétence spécifiée
                </p>
              )}
            </div>
          </div>

          {/* Sidebar informations */}
          <div className="space-y-4">
            {/* Informations client */}
            {client && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Client
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-600">Nom</span>
                    <p className="text-sm font-medium text-gray-900">
                      {client.nom}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600">Secteur</span>
                    <p className="text-sm text-gray-700">
                      {client.secteur_activite || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600">Contact</span>
                    <p className="text-sm text-gray-700">
                      {client.contact_principal || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Détails techniques */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Détails
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-600">Postes</span>
                  <p className="text-sm text-gray-700">
                    {mandat.nombre_postes || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Créé le</span>
                  <p className="text-sm text-gray-700">
                    {new Date(mandat.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">Modifié le</span>
                  <p className="text-sm text-gray-700">
                    {new Date(mandat.updated_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
