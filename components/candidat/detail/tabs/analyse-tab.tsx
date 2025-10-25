import React from "react";
import { Candidat } from "@/types/candidat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyseTabProps {
  candidat: Candidat;
}

export function AnalyseTab({ candidat }: AnalyseTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse IA</CardTitle>
      </CardHeader>
      <CardContent>
        {candidat.analyse_ia ? (
          <div className="space-y-4">
            {candidat.analyse_ia.score_global && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium">Score global</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {candidat.analyse_ia.score_global}/100
                </p>
              </div>
            )}

            {candidat.analyse_ia.points_forts && (
              <div>
                <h4 className="font-medium text-green-600 mb-2">
                  Points forts
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {candidat.analyse_ia.points_forts.map(
                    (point, index) => (
                      <li key={index} className="text-sm">
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {candidat.analyse_ia.points_amelioration && (
              <div>
                <h4 className="font-medium text-orange-600 mb-2">
                  Points d&apos;amélioration
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {candidat.analyse_ia.points_amelioration.map(
                    (point, index) => (
                      <li key={index} className="text-sm">
                        {point}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Aucune analyse IA disponible</p>
        )}
      </CardContent>
    </Card>
  );
}