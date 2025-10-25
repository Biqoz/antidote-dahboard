import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompetencesTabProps {
  candidat: Candidat;
}

export function CompetencesTab({ candidat }: CompetencesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compétences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {candidat.competences && candidat.competences.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Compétences générales</h4>
              <div className="flex flex-wrap gap-2">
                {candidat.competences.map((comp, index) => (
                  <Badge key={index} variant="secondary">
                    {comp}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {candidat.competences_techniques &&
            candidat.competences_techniques.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">
                  Compétences techniques
                </h4>
                <div className="flex flex-wrap gap-2">
                  {candidat.competences_techniques.map((comp, index) => (
                    <Badge key={index} variant="outline">
                      {comp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          {candidat.competences_linguistiques &&
            candidat.competences_linguistiques.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Langues</h4>
                <div className="space-y-2">
                  {candidat.competences_linguistiques.map(
                    (langue, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span>{langue.langue}</span>
                        <Badge variant="outline">{langue.niveau}</Badge>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}