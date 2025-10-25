import { useState } from "react";
import { LoadingState } from "@/components/shared/loading-state";
import { ClientHeader } from "./client-header";
import { ClientList } from "./clients-list";
import { ClientForm } from "./client-form";
import { useClients } from "@/hooks/use-clients";
import { Client, CreateClientData } from "@/types/client";

interface ClientViewProps {
  onClientSelect: (client: Client) => void;
}

export function ClientView({ onClientSelect }: ClientViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const {
    clients,
    stats,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refreshClients,
  } = useClients();

  const handleNewClient = () => {
    setEditingClient(null); // Reset editing client
    setIsFormOpen(!isFormOpen);
  };

  const handleFormSubmit = async (data: CreateClientData) => {
    try {
      if (editingClient) {
        // Mode édition
        await updateClient({ id: editingClient.id, ...data });
      } else {
        // Mode création
        await createClient(data);
      }
      setIsFormOpen(false);
      setEditingClient(null);
      await refreshClients();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du client:", error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = async (client: Client) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le client "${client.nom}" ?`
      )
    ) {
      try {
        await deleteClient(client.id);
        await refreshClients();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du client");
      }
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <ClientHeader
        clientsCount={stats?.total || 0}
        stats={stats}
        onNewClient={handleNewClient}
        isFormOpen={isFormOpen}
      />

      <ClientForm
        isOpen={isFormOpen}
        onToggle={() => setIsFormOpen(!isFormOpen)}
        onSubmit={handleFormSubmit}
        client={editingClient || undefined}
        mode={editingClient ? "edit" : "create"}
      />

      <ClientList
        clients={clients}
        onClientSelect={onClientSelect}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
