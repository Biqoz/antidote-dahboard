import { Edit, Trash2, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mandat } from "@/types/mandat";
import { useState, useEffect } from "react";
import { ClientService } from "@/services/client-service";
import { Client } from "@/types/client";

interface MandatCardProps {
  mandat: Mandat;
  onClick: () => void;
  onEdit?: (mandat: Mandat) => void;
  onDelete?: (mandat: Mandat) => void;
}

export function MandatCard({
  mandat,
  onClick,
  onEdit,
  onDelete,
}: MandatCardProps) {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (mandat.entreprise_id) {
        try {
          const clientData = await ClientService.getById(mandat.entreprise_id);
          setClient(clientData);
        } catch (error) {
          console.error("Erreur lors de la récupération du client:", error);
        }
      }
    };

    fetchClient();
  }, [mandat.entreprise_id]);

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
        return "Non défini";
    }
  };

  const getTypeContratLabel = (type?: string) => {
    switch (type) {
      case "determine":
        return "Déterminé";
      case "indetermine":
        return "Indéterminé";
      default:
        return "Non défini";
    }
  };

  return (
    <div
      className="group bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
      onClick={onClick}
    >
      {/* Header avec icône, nom et statut */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-900 group-hover:text-white transition-colors">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {mandat.titre}
            </h3>
            <p className="text-sm text-gray-500 truncate mt-1">
              {getTypeContratLabel(mandat.type_contrat)}
            </p>
          </div>
        </div>

        <Badge
          className={`px-2 py-1 text-xs font-medium border ${getStatusColor(
            mandat.statut
          )} ml-3`}
        >
          {getStatusLabel(mandat.statut)}
        </Badge>
      </div>

      {/* Informations client */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-500">Client:</span>
          <span className="text-gray-900">
            {client?.nom || "Non assigné"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(mandat);
            }}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(mandat);
            }}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
