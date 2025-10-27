import React from "react";
import { Candidat } from "@/types/candidat";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotesTabProps {
  candidat: Candidat;
}

export function NotesTab({ candidat }: NotesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {candidat.profil_notes && candidat.profil_notes.length > 0 ? (
          <div className="space-y-4">
            {candidat.profil_notes.map((note, index) => (
              <div key={note.id || index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {note.type && (
                      <Badge variant="outline" className="text-xs">
                        {note.type}
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(note.created_at).toLocaleDateString('fr-FR')} à {new Date(note.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm whitespace-pre-wrap">{note.contenu}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucune note disponible</p>
            <p className="text-sm text-gray-400">
              Les notes permettent de garder une trace des interactions et observations concernant ce candidat.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}