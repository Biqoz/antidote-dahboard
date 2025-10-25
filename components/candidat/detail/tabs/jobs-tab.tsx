import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobsTabProps {
  candidat: Candidat;
}

export function JobsTab({ candidat }: JobsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs Liés</CardTitle>
      </CardHeader>
      <CardContent>
        {candidat.candidatures && candidat.candidatures.length > 0 ? (
          <div className="space-y-3">
            {candidat.candidatures.map((candidature, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      Mandat ID: {candidature.mandat_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Candidature du{" "}
                      {new Date(
                        candidature.date_candidature
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{candidature.statut}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun job lié</p>
        )}
      </CardContent>
    </Card>
  );
}