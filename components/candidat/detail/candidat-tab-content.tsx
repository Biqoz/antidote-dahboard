import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { TabType } from "@/hooks/use-candidat-tabs";
import { useCandidatData } from "@/hooks/use-candidat-data";

import {
  VueEnsembleTab,
  CvTab,
  FormationTab,
  CompetencesTab,
  SpecialisationTab,
  JobsCiblesTab,
  MotivationTab,
  CandidaturesTab,
  NotesTab,
  AnalyseTab,
  MemoireIATab,
} from "./tabs";
import {
  VueEnsembleEditForm,
  CvEditForm,
  ExperienceEditForm,
  FormationEditForm,
  ReconnaissancesEditForm,
  CompetencesEditForm,
  SpecialisationEditForm,
  JobsCiblesEditForm,
  MotivationEditForm,
  CandidaturesEditForm,
  NotesEditForm,
  AnalyseEditForm,
  MemoireIAEditForm,
} from "./edit-forms";

interface CandidatTabContentProps {
  candidat: Candidat;
  activeTab: TabType;
}

export function CandidatTabContent({
  candidat: initialCandidat,
  activeTab,
}: CandidatTabContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const { candidat, updateField, refreshCandidat } =
    useCandidatData(initialCandidat);

  const handleEditSuccess = async () => {
    setIsEditing(false);
    setEditingItemId(null);
    // Refresh pour s'assurer que les données sont synchronisées
    await refreshCandidat();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingItemId(null);
  };

  const handleEditItem = (itemId: string | null) => {
    setEditingItemId(itemId);
    setIsEditing(true);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "vue-ensemble":
        return "Informations générales";
      case "cv":
        return "CV & Expériences";
      case "formation":
        return "Formation";
      case "competences":
        return "Compétences";
      case "specialisation":
        return "Spécialisations";
      case "jobs-cibles":
        return "Jobs ciblés";
      case "motivation":
        return "Motivations";
      case "candidatures":
        return "Candidatures";
      case "notes":
        return "Notes";
      case "analyse-ia":
        return "Talents GPT";
      case "memoire-ia":
        return "Mémoire IA";
      default:
        return "Contenu";
    }
  };

  const renderTabContent = () => {
    const commonProps = {
      candidat,
      onEditItem: handleEditItem,
      isEditing: isEditing && editingItemId !== null,
      editingItemId,
      updateField,
    };

    switch (activeTab) {
      case "vue-ensemble":
        return <VueEnsembleTab candidat={candidat} />;
      case "cv":
        return <CvTab {...commonProps} />;
      case "formation":
        return <FormationTab {...commonProps} />;
      case "competences":
        return <CompetencesTab {...commonProps} />;
      case "specialisation":
        return <SpecialisationTab {...commonProps} />;
      case "jobs-cibles":
        return <JobsCiblesTab {...commonProps} />;

      case "motivation":
        return <MotivationTab {...commonProps} />;
      case "candidatures":
        return <CandidaturesTab {...commonProps} />;
      case "notes":
        return (
          <NotesTab 
            candidat={candidat} 
            onEdit={handleEditItem}
            onAdd={() => handleEditItem(null)}
            onRefresh={refreshCandidat}
          />
        );
      case "analyse-ia":
        return <AnalyseTab {...commonProps} />;
      case "memoire-ia":
        return <MemoireIATab candidat={candidat} />;
      default:
        return <div>Contenu à venir</div>;
    }
  };

  const renderEditForm = () => {
    switch (activeTab) {
      case "vue-ensemble":
        return (
          <VueEnsembleEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
          />
        );
      case "cv":
        // Si on édite une expérience dans l'onglet CV, afficher le formulaire d'expérience
        if (editingItemId && editingItemId.startsWith("experience-")) {
          return (
            <ExperienceEditForm
              candidat={candidat}
              onSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
              updateField={updateField}
              editingItemId={editingItemId}
            />
          );
        }
        // Sinon, afficher le formulaire CV normal
        return (
          <CvEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
          />
        );

      case "formation":
        // Si on édite une reconnaissance dans l'onglet formation, afficher le formulaire de reconnaissance
        if (editingItemId && editingItemId.startsWith("reconnaissance-")) {
          return (
            <ReconnaissancesEditForm
              candidat={candidat}
              onSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
              updateField={updateField}
              editingItemId={editingItemId}
            />
          );
        }
        // Sinon, afficher le formulaire de formation
        return (
          <FormationEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
            editingItemId={editingItemId}
          />
        );
      case "competences":
        return (
          <CompetencesEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
            editingItemId={editingItemId}
          />
        );
      case "specialisation":
        return (
          <SpecialisationEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
            editingItemId={editingItemId}
          />
        );
      case "jobs-cibles":
        return (
          <JobsCiblesEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
            editingItemId={editingItemId}
          />
        );

      case "motivation":
        return (
          <MotivationEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
          />
        );
      case "candidatures":
        return (
          <CandidaturesEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
            editingItemId={editingItemId}
          />
        );
      case "notes":
        return (
          <NotesEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            editingItemId={editingItemId || undefined}
          />
        );
      case "analyse-ia":
        return (
          <AnalyseEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
          />
        );
      case "memoire-ia":
        return (
          <MemoireIAEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
          />
        );
      default:
        return <div>Formulaire d&apos;édition à venir</div>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{getTabTitle()}</h2>
      </div>

      {/* Formulaire d'édition spécifique à l'onglet */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            {(() => {
              // Cas spécial pour les expériences dans l'onglet CV
              if (
                activeTab === "cv" &&
                editingItemId &&
                editingItemId.startsWith("experience-")
              ) {
                return editingItemId === "experience-new"
                  ? "Ajouter une expérience"
                  : "Modifier l'expérience";
              }
              // Cas spécial pour les formations dans l'onglet formation
              if (
                activeTab === "formation" &&
                editingItemId &&
                editingItemId.startsWith("formation-")
              ) {
                return editingItemId === "formation-new"
                  ? "Ajouter une formation"
                  : "Modifier la formation";
              }
              // Cas spécial pour les reconnaissances dans l'onglet formation
              if (
                activeTab === "formation" &&
                editingItemId &&
                editingItemId.startsWith("reconnaissance-")
              ) {
                return editingItemId === "reconnaissance-new"
                  ? "Ajouter une reconnaissance"
                  : "Modifier la reconnaissance";
              }
              // Cas spécial pour les jobs ciblés
              if (
                activeTab === "jobs-cibles" &&
                editingItemId &&
                editingItemId.startsWith("job-cible-")
              ) {
                return editingItemId === "job-cible-new"
                  ? "Ajouter un job ciblé"
                  : "Modifier le job ciblé";
              }
              // Cas spécial pour les candidatures
              if (
                activeTab === "candidatures" &&
                editingItemId &&
                editingItemId.startsWith("candidature-")
              ) {
                return editingItemId === "candidature-new"
                  ? "Ajouter une candidature"
                  : "Modifier la candidature";
              }
              // Cas spécial pour les notes
              if (activeTab === "notes") {
                return editingItemId === null
                  ? "Ajouter une note"
                  : "Modifier la note";
              }
              // Logique normale pour les autres cas
              return editingItemId
                ? `Modifier ${getTabTitle().toLowerCase().slice(0, -1)}`
                : `Ajouter ${getTabTitle().toLowerCase().slice(0, -1)}`;
            })()}
          </h3>
          {renderEditForm()}
        </div>
      )}

      {/* Contenu de l'onglet */}
      {renderTabContent()}
    </div>
  );
}
