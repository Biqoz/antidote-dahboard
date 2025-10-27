import React, { useState } from "react";
import { Candidat } from "@/types/candidat";
import { TabType } from "@/hooks/use-candidat-tabs";
import { useCandidatData } from "@/hooks/use-candidat-data";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import {
  VueEnsembleTab,
  CvTab,
  ExperienceTab,
  FormationTab,
  CompetencesTab,
  SpecialisationTab,
  JobsCiblesTab,
  ReconnaissancesTab,
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
  CompetencesEditForm,
  SpecialisationEditForm,
  JobsCiblesEditForm,
  ReconnaissancesEditForm,
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
  const { candidat, updateField, refreshCandidat, isLoading } = useCandidatData(initialCandidat);

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

  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    // Définir l'ID d'édition selon l'onglet actif
    if (activeTab === 'specialisation') {
      setEditingItemId('specialisation-new');
    } else if (activeTab === 'experience') {
      setEditingItemId('experience-new');
    } else if (activeTab === 'formation') {
      setEditingItemId('formation-new');
    } else if (activeTab === 'competences') {
      setEditingItemId('competences-new');
    } else if (activeTab === 'jobs-cibles') {
      setEditingItemId('jobs-cibles-new');
    } else if (activeTab === 'reconnaissances') {
      setEditingItemId('reconnaissances-new');
    } else if (activeTab === 'motivation') {
      setEditingItemId('motivation-new');
    } else {
      setEditingItemId(null);
    }
    setIsEditing(true);
  };

  // Détermine si l'onglet supporte l'ajout multiple
  const isMultiAddTab = () => {
    return ['experience', 'formation', 'competences', 'specialisation', 'jobs-cibles', 'reconnaissances', 'candidatures', 'analyse-ia'].includes(activeTab);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "vue-ensemble":
        return "Informations générales";
      case "cv":
        return "CV";
      case "experience":
        return "Expériences";
      case "formation":
        return "Formations";
      case "competences":
        return "Compétences";
      case "specialisation":
        return "Spécialisations";
      case "jobs-cibles":
        return "Jobs ciblés";
      case "reconnaissances":
        return "Reconnaissances";
      case "motivation":
        return "Motivation";
      case "candidatures":
        return "Candidatures";
      case "notes":
        return "Notes";
      case "analyse-ia":
        return "Analyse IA";
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
        return <CvTab candidat={candidat} />;
      case "experience":
        return <ExperienceTab {...commonProps} />;
      case "formation":
        return <FormationTab {...commonProps} />;
      case "competences":
        return <CompetencesTab {...commonProps} />;
      case "specialisation":
        return <SpecialisationTab {...commonProps} />;
      case "jobs-cibles":
        return <JobsCiblesTab {...commonProps} />;
      case "reconnaissances":
        return <ReconnaissancesTab {...commonProps} />;
      case "motivation":
        return <MotivationTab candidat={candidat} />;
      case "candidatures":
        return <CandidaturesTab {...commonProps} />;
      case "notes":
        return <NotesTab candidat={candidat} />;
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
        return (
          <CvEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
          />
        );
      case "experience":
        return (
          <ExperienceEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
            editingItemId={editingItemId}
          />
        );
      case "formation":
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
          />
        );
      case "reconnaissances":
        return (
          <ReconnaissancesEditForm
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
          />
        );
      case "notes":
        return (
          <NotesEditForm
            candidat={candidat}
            onSuccess={handleEditSuccess}
            onCancel={handleCancelEdit}
            updateField={updateField}
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
      {/* Bouton modifier/ajouter spécifique à l'onglet */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{getTabTitle()}</h2>
        <Button
          onClick={() => isEditing ? handleCancelEdit() : (isMultiAddTab() ? handleAddNew() : setIsEditing(true))}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {isMultiAddTab() ? (
            <>
              <Plus className="h-4 w-4" />
              {isEditing ? "Annuler" : `Ajouter ${getTabTitle().toLowerCase()}`}
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              {isEditing ? "Annuler" : "Modifier"}
            </>
          )}
        </Button>
      </div>

      {/* Formulaire d'édition spécifique à l'onglet */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            {editingItemId 
              ? `Modifier ${getTabTitle().toLowerCase().slice(0, -1)}` // Enlever le 's' final pour le singulier
              : `Ajouter ${getTabTitle().toLowerCase().slice(0, -1)}`
            }
          </h3>
          {renderEditForm()}
        </div>
      )}

      {/* Contenu de l'onglet */}
      {renderTabContent()}
    </div>
  );
}
