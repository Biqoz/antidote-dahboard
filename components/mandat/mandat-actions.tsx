import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MandatActions() {
  return (
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
  );
}