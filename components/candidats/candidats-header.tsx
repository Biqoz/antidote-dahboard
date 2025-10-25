import { Building2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Candidatstats } from "@/types/client";

interface CandidatHeaderProps {
  candidatsCount: number;
  stats?: Candidatstats;
  onNewCandidat: () => void;
  isFormOpen?: boolean;
}

export function CandidatHeader({
  candidatsCount,
  stats,
  onNewCandidat,
  isFormOpen = false,
}: CandidatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-xl">
            <Building2 className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">candidats</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {candidatsCount} client{candidatsCount > 1 ? "s" : ""} au total
              </span>
              {stats && (
                <>
                  <span className="text-gray-600">{stats.actifs} actifs</span>
                  <span className="text-gray-600">
                    {stats.prospects} prospects
                  </span>
                  {stats.inactifs > 0 && (
                    <span className="text-gray-500">
                      {stats.inactifs} inactifs
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onNewCandidat}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            {isFormOpen ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau candidat
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
