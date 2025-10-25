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

  return (
    <div
      className="group bg-white border-b border-gray-200 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Mandat - 5 colonnes */}
        <div className="col-span-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-900 group-hover:text-white transition-colors">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
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

        {/* Statut - 2 colonnes */}
        <div className="col-span-2">
          <Badge
            className={`px-2 py-1 text-xs font-medium border ${getStatusColor(
              mandat.statut
            )}`}
          >
            {getStatusLabel(mandat.statut)}
          </Badge>
        </div>

        {/* Client - 3 colonnes */}
        <div className="col-span-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-3 w-3" />
            <span className="truncate">
              {client?.nom || "Client non trouvé"}
            </span>
          </div>
        </div>

        {/* Actions - 2 colonnes */}
        <div className="col-span-2">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </div>
    </div>
  );
}
