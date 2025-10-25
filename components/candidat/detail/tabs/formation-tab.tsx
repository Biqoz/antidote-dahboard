import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormationTabProps {
  candidat: Candidat;
}

export function FormationTab({ candidat }: FormationTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formation</CardTitle>
      </CardHeader>
      <CardContent>
        {candidat.formations && candidat.formations.length > 0 ? (
          <div className="space-y-4">
            {candidat.formations.map((formation, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium">{formation.diplome}</h4>
                <p className="text-sm text-gray-600">
                  {formation.etablissement}
                </p>
                <p className="text-sm text-gray-500">
                  {formation.date_debut} - {formation.date_fin}
                </p>
                {formation.mention && (
                  <Badge variant="secondary" className="mt-2">
                    {formation.mention}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune formation renseignée</p>
        )}
      </CardContent>
    </Card>
  );
}