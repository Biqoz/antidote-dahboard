import React, { useState, useRef } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Image as ImageIcon,
  Type,
  Upload,
  Brain,
  Clock,
  Trash2,
  Eye,
  Link,
  Video,
  Plus,
  X,
} from "lucide-react";

interface MemoireIATabProps {
  candidat: Candidat;
}

interface MemoryItem {
  id: string;
  type: "pdf" | "image" | "text" | "url" | "video" | "txt";
  title: string;
  content?: string;
  fileName?: string;
  fileSize?: string;
  url?: string;
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
      type: "url",
      title: "Profil LinkedIn",
      url: "https://linkedin.com/in/exemple",
      createdAt: new Date("2024-01-08"),
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemType, setNewItemType] = useState<
    "pdf" | "image" | "text" | "url" | "video" | "txt" | null
  >(null);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = (
    type: "pdf" | "image" | "text" | "url" | "video" | "txt"
  ) => {
    setNewItemType(type);
    setShowAddForm(true);
    setNewItemTitle("");
    setNewItemContent("");
    setNewItemUrl("");
  };

  const handleDeleteItem = (id: string) => {
    setMemoryItems(memoryItems.filter((item) => item.id !== id));
  };

  const handleSaveItem = () => {
    if (!newItemType) return;

    const newItem: MemoryItem = {
      id: Date.now().toString(),
      type: newItemType,
      title: newItemTitle || `Nouvel élément ${newItemType}`,
      content: newItemContent || undefined,
      url: newItemUrl || undefined,
      createdAt: new Date(),
    };

    setMemoryItems([newItem, ...memoryItems]);
    setShowAddForm(false);
    setNewItemType(null);
    setNewItemTitle("");
    setNewItemContent("");
    setNewItemUrl("");
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.type;
    let itemType: "pdf" | "image" | "txt" = "txt";

    if (fileType.includes("pdf")) {
      itemType = "pdf";
    } else if (fileType.includes("image")) {
      itemType = "image";
    }

    const newItem: MemoryItem = {
      id: Date.now().toString(),
      type: itemType,
      title: file.name,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      createdAt: new Date(),
    };

    setMemoryItems([newItem, ...memoryItems]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
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
    <div className="space-y-6">
      {/* Texte d'introduction comme NotebookLM */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Ajoutez des sources
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Les sources permettent à la mémoire de votre Talent GPT de baser ses
          réponses sur les informations qui vous intéressent le plus.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Exemples :</strong> plans marketing, ressources de cours,
          notes de recherche, transcriptions de réunions, documents commerciaux,
          etc.
        </p>
      </div>

      {/* Zone de glisser-déposer principale */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <Upload className="h-8 w-8 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Glissez-déposez vos fichiers ici
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ou utilisez les boutons ci-dessous pour ajouter du contenu
            </p>
          </div>

          {/* Boutons d'ajout */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 w-full max-w-2xl">
            <Button
              variant="outline"
              className="h-16 flex-col gap-1 border-dashed hover:border-red-400 hover:bg-red-50"
              onClick={() => handleAddItem("pdf")}
            >
              <FileText className="h-5 w-5 text-red-600" />
              <span className="text-xs">PDF</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col gap-1 border-dashed hover:border-green-400 hover:bg-green-50"
              onClick={() => handleAddItem("image")}
            >
              <ImageIcon className="h-5 w-5 text-green-600" />
              <span className="text-xs">Image</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col gap-1 border-dashed hover:border-purple-400 hover:bg-purple-50"
              onClick={() => handleAddItem("txt")}
            >
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="text-xs">TXT</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col gap-1 border-dashed hover:border-blue-400 hover:bg-blue-50"
              onClick={() => handleAddItem("text")}
            >
              <Type className="h-5 w-5 text-blue-600" />
              <span className="text-xs">Texte</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col gap-1 border-dashed hover:border-orange-400 hover:bg-orange-50"
              onClick={() => handleAddItem("url")}
            >
              <Link className="h-5 w-5 text-orange-600" />
              <span className="text-xs">URL</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col gap-1 border-dashed hover:border-pink-400 hover:bg-pink-50"
              onClick={() => handleAddItem("video")}
            >
              <Video className="h-5 w-5 text-pink-600" />
              <span className="text-xs">Vidéo</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt,.jpg,.jpeg,.png,.gif"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && newItemType && (
        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className={`p-2 rounded-lg ${getTypeColor(newItemType)}`}>
                  {getTypeIcon(newItemType)}
                </div>
                Ajouter{" "}
                {newItemType === "pdf"
                  ? "un PDF"
                  : newItemType === "image"
                  ? "une image"
                  : newItemType === "txt"
                  ? "un fichier TXT"
                  : newItemType === "url"
                  ? "une URL"
                  : newItemType === "video"
                  ? "une vidéo"
                  : "du texte"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Titre
              </label>
              <Input
                placeholder="Donnez un titre à cet élément..."
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
              />
            </div>

            {newItemType === "text" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Contenu
                </label>
                <Textarea
                  placeholder="Collez ou saisissez votre texte ici..."
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  rows={6}
                />
              </div>
            )}

            {(newItemType === "url" || newItemType === "video") && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {newItemType === "video"
                    ? "URL de la vidéo"
                    : "URL du site web"}
                </label>
                <Input
                  placeholder={
                    newItemType === "video"
                      ? "https://youtube.com/watch?v=..."
                      : "https://exemple.com"
                  }
                  value={newItemUrl}
                  onChange={(e) => setNewItemUrl(e.target.value)}
                />
              </div>
            )}

            {(newItemType === "pdf" ||
              newItemType === "image" ||
              newItemType === "txt") && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Fichier
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Cliquez pour sélectionner un fichier{" "}
                    {newItemType.toUpperCase()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveItem}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques style NotebookLM */}
      {memoryItems.length > 0 && (
        <div className="space-y-4">
          {/* Carte Total séparée */}
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {memoryItems.length}
                </p>
                <p className="text-lg font-medium text-gray-600 mt-1">
                  Sources totales
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Cartes par type */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Répartition par type
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {memoryItems.filter((item) => item.type === "pdf").length}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">PDF</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {
                        memoryItems.filter((item) => item.type === "image")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Images</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <ImageIcon className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {memoryItems.filter((item) => item.type === "txt").length}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">TXT</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {
                        memoryItems.filter((item) => item.type === "text")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Texte</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Type className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {memoryItems.filter((item) => item.type === "url").length}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">URL</p>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Link className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {
                        memoryItems.filter((item) => item.type === "video")
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Vidéo</p>
                  </div>
                  <div className="p-2 bg-pink-50 rounded-lg">
                    <Video className="h-5 w-5 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des éléments */}
      {memoryItems.length > 0 && (
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-lg">Sources ajoutées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {memoryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${getTypeColor(item.type)}`}
                    >
                      {getTypeIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {item.title}
                      </h4>
                      {item.content && (
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {item.content}
                        </p>
                      )}
                      {item.url && (
                        <p className="text-xs text-blue-600 truncate mt-1">
                          {item.url}
                        </p>
                      )}
                      {item.fileName && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.fileName} • {item.fileSize}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {item.createdAt.toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-4">
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
          </CardContent>
        </Card>
      )}

      {/* État vide */}
      {memoryItems.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Votre mémoire IA est vide
          </h3>
          <p className="text-sm text-gray-600">
            Commencez par ajouter des sources pour alimenter l&apos;IA avec des
            informations sur {candidat.prenom} {candidat.nom}
          </p>
        </div>
      )}
    </div>
  );
}
