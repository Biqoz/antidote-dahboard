import React from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CvTabProps {
  candidat: Candidat;
}

export function CvTab({ candidat }: CvTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CV et Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {candidat.cv_url ? (
          <div className="space-y-4">
            <Button variant="outline">Télécharger CV</Button>
            {candidat.cv_text && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Contenu du CV</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {candidat.cv_text}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Aucun CV téléchargé</p>
        )}
      </CardContent>
    </Card>
  );
}