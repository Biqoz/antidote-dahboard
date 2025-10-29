import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Image as ImageIcon,
  Type,
  Upload,
  Brain,
  Clock,
  Trash2,
  Eye,
} from "lucide-react";

interface MemoireIATabProps {
  candidat: Candidat;
}

interface MemoryItem {
  id: string;
  type: "pdf" | "image" | "text";
  title: string;
  content?: string;
  fileName?: string;
  fileSize?: string;
  createdAt: Date;
}

export function MemoireIATab({ candidat }: MemoireIATabProps) {
  // Initialize memory items with candidate-specific data
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([
    {
      id: "1",
      type: "text",
      title: "Note compétences techniques",
      content: `Analyse des compétences de ${candidat.prenom} ${candidat.nom}`,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      type: "pdf",
      title: "CV analysé",
      fileName: `cv-${candidat.prenom?.toLowerCase()}-${candidat.nom?.toLowerCase()}.pdf`,
      fileSize: "2.3 MB",
      createdAt: new Date("2024-01-10"),
    },
    {
      id: "3",
      type: "text",
      title: "Profil candidat",
      content: `Email: ${candidat.email} | Téléphone: ${candidat.telephone || 'Non renseigné'}`,
      createdAt: new Date("2024-01-08"),
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemType, setNewItemType] = useState<
    "pdf" | "image" | "text" | null
  >(null);

  const handleAddItem = (type: "pdf" | "image" | "text") => {
    setNewItemType(type);
    setShowAddForm(true);
  };

  const handleDeleteItem = (id: string) => {
    setMemoryItems(memoryItems.filter((item) => item.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "text":
        return <Type className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "text-red-600 bg-red-100";
      case "image":
        return "text-green-600 bg-green-100";
      case "text":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-4">
      {/* Statistiques en haut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Éléments</p>
                <p className="text-xl font-bold text-gray-900">
                  {memoryItems.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-xl font-bold text-gray-900">
                  {memoryItems.filter((item) => item.type === "pdf").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Type className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Notes</p>
                <p className="text-xl font-bold text-gray-900">
                  {memoryItems.filter((item) => item.type === "text").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions d'ajout */}
      {!showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ajouter à la mémoire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-dashed hover:border-red-400 hover:bg-red-50"
                onClick={() => handleAddItem("pdf")}
              >
                <FileText className="h-5 w-5 text-red-600" />
                <span className="text-sm">PDF</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-dashed hover:border-green-400 hover:bg-green-50"
                onClick={() => handleAddItem("image")}
              >
                <ImageIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm">Image</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-dashed hover:border-blue-400 hover:bg-blue-50"
                onClick={() => handleAddItem("text")}
              >
                <Type className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Texte</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire d'ajout compact */}
      {showAddForm && newItemType && (
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className={`p-1.5 rounded ${getTypeColor(newItemType)}`}>
                {getTypeIcon(newItemType)}
              </div>
              Ajouter{" "}
              {newItemType === "pdf"
                ? "un PDF"
                : newItemType === "image"
                ? "une image"
                : "du texte"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {newItemType === "text" ? (
              <textarea
                placeholder="Saisissez votre note..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                rows={3}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">
                  Glisser un fichier {newItemType === "pdf" ? "PDF" : "image"}
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Annuler
              </Button>
              <Button size="sm">Ajouter</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des éléments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Éléments de mémoire</CardTitle>
        </CardHeader>
        <CardContent>
          {memoryItems.length === 0 ? (
            <div className="text-center py-6">
              <Brain className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucun élément ajouté</p>
            </div>
          ) : (
            <div className="space-y-2">
              {memoryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-1.5 rounded ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {item.title}
                      </h4>
                      {item.content && (
                        <p className="text-xs text-gray-600 truncate">
                          {item.content}
                        </p>
                      )}
                      {item.fileName && (
                        <p className="text-xs text-gray-500">
                          {item.fileName} • {item.fileSize}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {item.createdAt.toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
