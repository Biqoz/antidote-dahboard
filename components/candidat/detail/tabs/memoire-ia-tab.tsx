import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MemoireIATabProps {
  candidat: Candidat;
}

export function MemoireIATab({ candidat }: MemoireIATabProps) {
  const analyseIA = candidat.analyse_ia;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mémoire IA</CardTitle>
      </CardHeader>
      <CardContent>
        {analyseIA ? (
          <div className="space-y-4">
            {analyseIA.score_global && (
              <div>
                <h4 className="font-medium mb-2">Score global</h4>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${analyseIA.score_global}%` }}
                    ></div>
                  </div>
                  <Badge variant="default">{analyseIA.score_global}%</Badge>
                </div>
              </div>
            )}

            {analyseIA.competences_detectees && analyseIA.competences_detectees.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Compétences détectées par l&apos;IA</h4>
                <div className="flex flex-wrap gap-2">
                  {analyseIA.competences_detectees.map((competence, index) => (
                    <Badge key={index} variant="secondary">
                      {competence}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analyseIA.points_forts && analyseIA.points_forts.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Points forts identifiés</h4>
                <div className="space-y-2">
                  {analyseIA.points_forts.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analyseIA.points_amelioration && analyseIA.points_amelioration.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Points d&apos;amélioration</h4>
                <div className="space-y-2">
                  {analyseIA.points_amelioration.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analyseIA.recommandations && analyseIA.recommandations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommandations IA</h4>
                <div className="space-y-2">
                  {analyseIA.recommandations.map((recommandation, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm">{recommandation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analyseIA.derniere_analyse && (
              <div>
                <h4 className="font-medium mb-2">Dernière analyse</h4>
                <p className="text-sm text-gray-600">
                  {new Date(analyseIA.derniere_analyse).toLocaleDateString('fr-FR')} à {new Date(analyseIA.derniere_analyse).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucune analyse IA disponible</p>
            <p className="text-sm text-gray-400">
              L&apos;analyse IA permet d&apos;obtenir des insights automatiques sur le profil du candidat.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}