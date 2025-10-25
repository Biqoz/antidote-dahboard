import { Briefcase, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MandatHeaderProps {
  mandatsCount: number;
  onNewMandat: () => void;
  isFormOpen?: boolean;
}

export function MandatHeader({ 
  mandatsCount, 
  onNewMandat, 
  isFormOpen = false
}: MandatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-xl">
            <Briefcase className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mandats</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {mandatsCount} mandat{mandatsCount > 1 ? "s" : ""} au total
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onNewMandat}
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
                Nouveau mandat
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}