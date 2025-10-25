import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";

interface ClientDetailHeaderProps {
  client: Client;
  mandatsCount: number;
  onBack: () => void;
}

export function ClientDetailHeader({
  client,
  mandatsCount,
  onBack,
}: ClientDetailHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ← Retour
          </Button>

          <div className="p-3 bg-gray-100 rounded-xl">
            <Building2 className="h-6 w-6 text-gray-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.nom}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {mandatsCount} mandat{mandatsCount > 1 ? "s" : ""} actif
                {mandatsCount > 1 ? "s" : ""}
              </span>
              {client.secteur_activite && (
                <>
                  <span>•</span>
                  <span>{client.secteur_activite}</span>
                </>
              )}
              {client.statut && (
                <>
                  <span>•</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.statut === "actif"
                        ? "bg-green-100 text-green-800"
                        : client.statut === "prospect"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {client.statut}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
