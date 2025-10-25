"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { CandidatList } from "@/components/candidat/candidat-list";
import { CandidatDetailView } from "@/components/candidat/candidat-detail-view";
import { useCandidats } from "@/hooks/use-candidats";
import { Candidat } from "@/types/candidat";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CandidatsPage() {
  const { candidats, loading, error } = useCandidats();
  const [selectedCandidat, setSelectedCandidat] = useState<Candidat | null>(
    null
  );

  const breadcrumbs = [
    { label: "Dashboard RH", href: "/dashboard" },
    { label: "Vivier de talents", href: "/dashboard/vivier" },
    { label: "Candidats" },
  ];

  if (selectedCandidat) {
    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="flex flex-1 flex-col p-4">
          <CandidatDetailView
            candidat={selectedCandidat}
            onBack={() => setSelectedCandidat(null)}
            onEdit={(candidat) => {
              // TODO: Implement edit functionality
              console.log("Edit candidat:", candidat);
            }}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidats</h1>
            <p className="text-gray-600">
              Gérez votre vivier de talents et candidats
            </p>
          </div>
          <Button onClick={() => console.log("Ajouter candidat - à implémenter")}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un candidat
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Erreur: {error}</p>
          </div>
        )}

        <CandidatList
          candidats={candidats}
          loading={loading}
          onCandidatSelect={setSelectedCandidat}
        />
      </div>
    </PageLayout>
  );
}
