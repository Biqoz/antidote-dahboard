import React, { useState, useRef } from "react";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Trash2, Edit, Plus } from "lucide-react";
// Simple toast function to replace sonner
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`),
};

interface CvTabProps {
  candidat: Candidat;
  onEditItem?: (itemId: string) => void;
  isEditing?: boolean;
  editingItemId?: string | null;
  updateField?: (field: string, value: unknown) => Promise<void>;
}

export function CvTab({
  candidat,
  onEditItem,
  isEditing = false,
  editingItemId,
  updateField,
}: CvTabProps): React.JSX.Element {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    if (file.type !== "application/pdf") {
      toast.error("Seuls les fichiers PDF sont acceptés");
      return;
    }

    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);

    // Convertir en base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;

        if (updateField) {
          await updateField("cv_text", base64);
          toast.success("CV uploadé avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        toast.error("Erreur lors de l'upload du CV");
      } finally {
        setIsUploading(false);
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      console.error("Erreur lors de la lecture du fichier");
      toast.error("Erreur lors de la lecture du fichier");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDownloadCV = () => {
    if (!candidat.cv_text) return;

    try {
      // Créer un lien de téléchargement depuis le base64
      const link = document.createElement("a");
      link.href = candidat.cv_text;
      link.download = `CV_${candidat.prenom}_${candidat.nom}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du CV");
    }
  };

  const handleDeleteCV = async () => {
    if (updateField) {
      try {
        await updateField("cv_text", null);
        toast.success("CV supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Erreur lors de la suppression du CV");
      }
    }
  };

  return (
    <Tabs defaultValue="cv" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="cv">CV</TabsTrigger>
        <TabsTrigger value="experience">Expérience</TabsTrigger>
      </TabsList>

      <TabsContent value="cv" className="space-y-4">
        <div className="space-y-4">
          {/* Section CV uploadé */}
          {candidat.cv_text && candidat.cv_text.trim().length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleDownloadCV}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </Button>
                <Button
                  onClick={handleDeleteCV}
                  size="sm"
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>

              {/* Visualiseur PDF */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800">Aperçu du CV</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      Taille: {Math.round(candidat.cv_text.length / 1024)} KB
                    </span>
                  </div>
                </div>

                {/* PDF Viewer */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <iframe
                    src={candidat.cv_text}
                    className="w-full h-96"
                    title="Aperçu du CV"
                    style={{ minHeight: "600px" }}
                  />
                </div>

                {/* Fallback pour les navigateurs qui ne supportent pas l'iframe PDF */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    💡 Si le PDF ne s&apos;affiche pas correctement ci-dessus :
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownloadCV}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger le PDF
                    </Button>
                    <Button
                      onClick={() => window.open(candidat.cv_text, "_blank")}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      📄 Ouvrir dans un nouvel onglet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Glissez-déposez votre CV ici ou cliquez pour sélectionner
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="outline"
              >
                {isUploading ? "Upload en cours..." : "Sélectionner un fichier"}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Format accepté: PDF (max 5MB)
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="experience" className="space-y-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Expériences professionnelles (Sélection)
          </h2>
          {onEditItem && (
            <Button
              onClick={() => onEditItem("experience-new")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une expérience
            </Button>
          )}
        </div>

        {candidat.experiences && candidat.experiences.length > 0 ? (
          candidat.experiences.map((exp, index) => {
            const itemId = `experience-${index}`;
            const isCurrentlyEditing = isEditing && editingItemId === itemId;

            return (
              <div
                key={index}
                className={`p-4 border-b border-gray-100 ${
                  isCurrentlyEditing ? "ring-2 ring-blue-500 rounded" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{exp.poste}</h3>
                  {onEditItem && !isEditing && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEditItem(itemId)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </Button>
                      <Button
                        onClick={() => {
                          /* TODO: Implement delete */
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2 mt-2">
                  <p className="text-sm text-gray-600">{exp.entreprise}</p>
                  <p className="text-sm text-gray-500">
                    {exp.date_debut} - {exp.date_fin || "Présent"}
                  </p>
                  {exp.description && (
                    <p className="text-sm mt-2">{exp.description}</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-gray-500">
            Aucune expérience renseignée
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
