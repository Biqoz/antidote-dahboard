import React from "react";
import { Candidat } from "@/types/candidat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExperienceTabProps {
  candidat: Candidat;
}

export function ExperienceTab({ candidat }: ExperienceTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expériences Professionnelles</CardTitle>
      </CardHeader>
      <CardContent>
        {candidat.experiences && candidat.experiences.length > 0 ? (
          <div className="space-y-4">
            {candidat.experiences.map((exp, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium">{exp.poste}</h4>
                <p className="text-sm text-gray-600">{exp.entreprise}</p>
                <p className="text-sm text-gray-500">
                  {exp.date_debut} - {exp.date_fin || "Présent"}
                </p>
                {exp.description && (
                  <p className="text-sm mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune expérience renseignée</p>
        )}
      </CardContent>
    </Card>
  );
}