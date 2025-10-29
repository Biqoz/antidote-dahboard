"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { MandatView } from "@/components/mandat/mandat-view";
import { MandatDetailView } from "@/components/mandat/mandat-detail-view";
import { MandatForm } from "@/components/mandat/mandat-form";
import { Mandat } from "@/types/mandat";
import { MandatService } from "@/services/mandat-service";

// Component that uses useSearchParams wrapped in Suspense
function MandatsPageContent() {
  const [selectedMandat, setSelectedMandat] = useState<Mandat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const mandatId = searchParams.get("mandatId");
  const clientId = searchParams.get("clientId");
  const action = searchParams.get("action");

  const breadcrumbs = [
    { label: "CLIENTS", href: "/dashboard/clients" },
    { label: "Mandats", href: "/dashboard/clients/mandats" },
  ];

  // Charger automatiquement un mandat si l'ID est dans l'URL
  useEffect(() => {
    const loadMandatFromUrl = async () => {
      if (mandatId && !selectedMandat) {
        setIsLoading(true);
        try {
          const mandat = await MandatService.getById(mandatId);
          if (mandat) {
            setSelectedMandat(mandat);
          }
        } catch (error) {
          console.error("Erreur lors du chargement du mandat:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMandatFromUrl();
  }, [mandatId, selectedMandat]);

  const handleMandatSelect = (mandat: Mandat) => {
    setSelectedMandat(mandat);
  };

  const handleNavigateToClient = (clientId: string) => {
    // Naviguer vers la page des contacts avec le client sélectionné
    router.push(`/dashboard/clients/contacts?clientId=${clientId}`);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du mandat...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (selectedMandat) {
    if (isEditing) {
      return (
        <PageLayout breadcrumbs={breadcrumbs}>
          <MandatForm
            mandat={selectedMandat}
            mode="edit"
            onSubmit={async (updatedMandat) => {
              try {
                await MandatService.update(selectedMandat.id, updatedMandat);
                setSelectedMandat({ ...selectedMandat, ...updatedMandat });
                setIsEditing(false);
              } catch (error) {
                console.error("Erreur lors de la mise à jour du mandat:", error);
              }
            }}
            onCancel={() => setIsEditing(false)}
          />
        </PageLayout>
      );
    }

    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <MandatDetailView
          mandat={selectedMandat}
          onBack={() => setSelectedMandat(null)}
          onNavigateToClient={handleNavigateToClient}
          onEdit={handleEdit}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <MandatView
        onMandatSelect={handleMandatSelect}
        initialFormOpen={action === "create"}
        preSelectedClientId={clientId || undefined}
      />
    </PageLayout>
  );
}

// Loading component for Suspense fallback
function MandatsPageLoading() {
  const breadcrumbs = [
    { label: "CLIENTS", href: "/dashboard/clients" },
    { label: "Mandats", href: "/dashboard/clients/mandats" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    </PageLayout>
  );
}

// Main page component with Suspense boundary
export default function MandatsPage() {
  return (
    <Suspense fallback={<MandatsPageLoading />}>
      <MandatsPageContent />
    </Suspense>
  );
}
