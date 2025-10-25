import React from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Mail, Phone, ArrowLeft } from "lucide-react";

interface CandidatDetailHeaderProps {
  candidat: Candidat;
  onBack: () => void;
  onEdit?: (candidat: Candidat) => void;
}

export function CandidatDetailHeader({
  candidat,
  onBack,
  onEdit,
}: CandidatDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {candidat.prenom} {candidat.nom}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            {candidat.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{candidat.email}</span>
              </div>
            )}
            {candidat.telephone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{candidat.telephone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button onClick={() => onEdit?.(candidat)}>Modifier</Button>
    </div>
  );
}