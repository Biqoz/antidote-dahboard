import { Building2, Edit, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/client";
import { useState, useEffect } from "react";
import { MandatService } from "@/services/mandat-service";

interface ClientCardProps {
  client: Client;
  onClick: () => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

export function ClientCard({
  client,
  onClick,
  onEdit,
  onDelete,
}: ClientCardProps) {
  const [mandatsCount, setMandatsCount] = useState<number>(0);

  useEffect(() => {
    const fetchMandatsCount = async () => {
      try {
        const mandats = await MandatService.getByClientId(client.id);
        setMandatsCount(mandats.length);
      } catch (error) {
        console.error("Erreur lors de la récupération des mandats:", error);
        setMandatsCount(0);
      }
    };

    fetchMandatsCount();
  }, [client.id]);
  const getStatusColor = (statut?: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "prospect":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "inactif":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (statut?: string) => {
    switch (statut) {
      case "actif":
        return "Client actif";
      case "prospect":
        return "Prospect";
      case "inactif":
        return "Inactif";
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
            <Building2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {client.nom}
            </h3>
            {client.secteur_activite && (
              <p className="text-sm text-gray-500 truncate mt-1">
                {client.secteur_activite}
              </p>
            )}
          </div>
        </div>

        <Badge
          className={`px-2 py-1 text-xs font-medium border ${getStatusColor(
            client.statut
          )} ml-3`}
        >
          {getStatusLabel(client.statut)}
        </Badge>
      </div>

      {/* Informations mandats */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-500">Mandats:</span>
          <span className="text-gray-900">
            {mandatsCount} mandat{mandatsCount !== 1 ? "s" : ""}
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
              onEdit(client);
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
              onDelete(client);
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
