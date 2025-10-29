"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { ClientView } from "@/components/client/client-view";
import { ClientDetailView } from "@/components/client/client-detail-view";
import { ClientForm } from "@/components/client/client-form";
import { Client } from "@/types/client";
import { Mandat } from "@/types/mandat";
import { useMandats } from "@/hooks/use-mandats";
import { ClientService } from "@/services/client-service";

// Component that uses useSearchParams wrapped in Suspense
function ClientsPageContent() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get("clientId");

  const { mandats, loading: mandatsLoading } = useMandats(
    selectedClient?.id || ""
  );

  const handleNavigateToMandat = (mandat: Mandat) => {
    router.push(`/dashboard/clients/mandats?mandatId=${mandat.id}`);
  };

  const handleNavigateToHome = () => {
    router.push("/dashboard/clients");
  };

  const handleNavigateToClients = () => {
    router.push("/dashboard/clients/contacts");
  };

  const handleNavigateToMandats = () => {
    router.push("/dashboard/clients/mandats");
  };

  const handleCreateMandat = () => {
    // Naviguer vers la page des mandats avec le client pré-sélectionné
    router.push(
      `/dashboard/clients/mandats?clientId=${selectedClient?.id}&action=create`
    );
  };

  const breadcrumbs = [
    { label: "CLIENTS", href: "/dashboard/clients" },
    { label: "Contacts", href: "/dashboard/clients/contacts" },
  ];

  // Charger automatiquement un client si l'ID est dans l'URL
  useEffect(() => {
    const loadClientFromUrl = async () => {
      if (clientId && !selectedClient) {
        setIsLoading(true);
        try {
          const client = await ClientService.getById(clientId);
          if (client) {
            setSelectedClient(client);
          }
        } catch (error) {
          console.error("Erreur lors du chargement du client:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadClientFromUrl();
  }, [clientId, selectedClient]);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du client...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (selectedClient) {
    if (isEditing) {
      return (
        <PageLayout breadcrumbs={breadcrumbs}>
          <ClientForm
            isOpen={true}
            onToggle={() => setIsEditing(false)}
            client={selectedClient}
            mode="edit"
            onSubmit={async (updatedClient) => {
              try {
                await ClientService.update({ id: selectedClient.id, ...updatedClient });
                setSelectedClient({ ...selectedClient, ...updatedClient });
                setIsEditing(false);
              } catch (error) {
                console.error("Erreur lors de la mise à jour du client:", error);
              }
            }}
          />
        </PageLayout>
      );
    }

    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <ClientDetailView
          client={selectedClient}
          mandats={mandats}
          mandatsLoading={mandatsLoading}
          onBack={() => setSelectedClient(null)}
          onMandatSelect={handleNavigateToMandat}
          onCreateMandat={handleCreateMandat}
          onNavigateToHome={handleNavigateToHome}
          onNavigateToCandidats={handleNavigateToClients}
          onNavigateToMandats={handleNavigateToMandats}
          onEdit={handleEdit}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <ClientView onClientSelect={handleClientSelect} />
    </PageLayout>
  );
}

// Loading component for Suspense fallback
function ClientsPageLoading() {
  const breadcrumbs = [
    { label: "CLIENTS", href: "/dashboard/clients" },
    { label: "Contacts", href: "/dashboard/clients/contacts" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    </PageLayout>
  );
}

// Main page component with Suspense boundary
export default function ClientsPage() {
  return (
    <Suspense fallback={<ClientsPageLoading />}>
      <ClientsPageContent />
    </Suspense>
  );
}
