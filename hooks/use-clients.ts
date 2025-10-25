"use client";

import { useState, useEffect, useCallback } from "react";
import { ClientService } from "@/services/client-service";
import {
  Client,
  CreateClientData,
  UpdateClientData,
  ClientFilters,
  ClientStats,
} from "@/types/client";

export function useClients(filters?: ClientFilters) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ClientStats>({
    total: 0,
    actifs: 0,
    prospects: 0,
    inactifs: 0,
  });

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ClientService.getAll(filters);
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await ClientService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error("Erreur lors de la récupération des stats:", err);
    }
  }, []);

  const createClient = useCallback(
    async (clientData: CreateClientData): Promise<Client> => {
      try {
        const newClient = await ClientService.create(clientData);
        setClients((prev) => [newClient, ...prev]);
        await fetchStats(); // Mettre à jour les stats
        return newClient;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la création";
        setError(errorMessage);
        throw err;
      }
    },
    [fetchStats]
  );

  const updateClient = useCallback(
    async (updateData: UpdateClientData): Promise<Client> => {
      try {
        const updatedClient = await ClientService.update(updateData);
        setClients((prev) =>
          prev.map((client) =>
            client.id === updateData.id ? updatedClient : client
          )
        );
        await fetchStats(); // Mettre à jour les stats
        return updatedClient;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la mise à jour";
        setError(errorMessage);
        throw err;
      }
    },
    [fetchStats]
  );

  const deleteClient = useCallback(
    async (id: string): Promise<void> => {
      try {
        await ClientService.delete(id);
        setClients((prev) => prev.filter((client) => client.id !== id));
        await fetchStats(); // Mettre à jour les stats
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la suppression";
        setError(errorMessage);
        throw err;
      }
    },
    [fetchStats]
  );

  const refreshClients = useCallback(() => {
    fetchClients();
    fetchStats();
  }, [fetchClients, fetchStats]);

  useEffect(() => {
    fetchClients();
    fetchStats();
  }, [fetchClients, fetchStats]);

  return {
    clients,
    loading,
    error,
    stats,
    createClient,
    updateClient,
    deleteClient,
    refreshClients,
  };
}
