import { useState } from "react";
import { ContextNavigation } from "@/components/shared/context-navigation";
import { MandatList } from "@/components/mandat/mandat-list";
import { ContactNotes } from "@/components/contact/contact-notes";
import { Client } from "@/types/client";
import { Mandat } from "@/types/mandat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  FileText,
  Plus,
  MessageSquare,
  Edit,
} from "lucide-react";

interface ClientDetailViewProps {
  client: Client;
  mandats: Mandat[];
  mandatsLoading: boolean;
  onBack: () => void;
  onMandatSelect?: (mandat: Mandat) => void;
  onCreateMandat?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToCandidats?: () => void;
  onNavigateToMandats?: () => void;
  onEdit?: () => void;
}

type TabType = "overview" | "mandats" | "notes";

export function ClientDetailView({
  client,
  mandats,
  mandatsLoading,
  onBack,
  onMandatSelect,
  onCreateMandat,
  onEdit,
}: ClientDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const activeMandats = mandats.filter(
    (m) => m.statut === "ouvert" || m.statut === "en_cours"
  );
  const completedMandats = mandats.filter((m) => m.statut === "ferme");
  const pausedMandats = mandats.filter((m) => m.statut === "suspendu");

  const getStatusColor = (statut?: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800";
      case "inactif":
        return "bg-gray-100 text-gray-800";
      case "suspendu":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Informations principales */}
      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Contact administratif</span>
            </div>
            <p className="text-sm text-gray-900">
              {client.contact_administratif || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Email</span>
            </div>
            <p className="text-sm text-gray-900">{client.email || "N/A"}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">
                Tél fixe
              </span>
            </div>
            <p className="text-sm text-gray-900">
              {client.tel_fixe || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">
                Tél portable
              </span>
            </div>
            <p className="text-sm text-gray-900">
              {client.tel_portable || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Ville</span>
            </div>
            <p className="text-sm text-gray-900">{client.ville || "N/A"}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">
                Site web
              </span>
            </div>
            <p className="text-sm text-gray-900">{client.site_web || "N/A"}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Secteur</span>
            </div>
            <p className="text-sm text-gray-900">
              {client.secteur_activite || "N/A"}
            </p>
          </div>
        </div>

        {/* Adresse complète */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Adresse</h3>
          <p className="text-sm text-gray-700">
            {client.adresse || "Adresse non renseignée"}
          </p>
        </div>
      </div>

      {/* Sidebar mandats */}
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Mandats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Total</span>
              <span className="text-sm font-medium text-gray-900">
                {mandats.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Actifs</span>
              <span className="text-sm font-medium text-green-700">
                {activeMandats.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Terminés</span>
              <span className="text-sm font-medium text-gray-700">
                {completedMandats.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">En pause</span>
              <span className="text-sm font-medium text-orange-700">
                {pausedMandats.length}
              </span>
            </div>
          </div>
          <Button
            className="w-full mt-3 bg-gray-900 hover:bg-gray-800 text-white"
            size="sm"
            onClick={onCreateMandat}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau mandat
          </Button>
        </div>

        {/* Informations système */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Informations
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-600">Créé le</span>
              <p className="text-sm text-gray-700">
                {new Date(client.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-600">Modifié le</span>
              <p className="text-sm text-gray-700">
                {new Date(client.updated_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-600">Statut</span>
              <Badge
                className={`${getStatusColor(client.statut)} text-xs  m-1`}
              >
                {client.statut || "Actif"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMandats = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mandats</h3>
          <p className="text-sm text-gray-600">
            Tous les mandats pour {client.nom}
          </p>
        </div>
        <Button
          onClick={onCreateMandat}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau mandat
        </Button>
      </div>

      <MandatList
        mandats={mandats}
        loading={mandatsLoading}
        onMandatSelect={onMandatSelect}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header ultra-compact */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {client.nom}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="text-gray-600 hover:text-gray-900"
              >
                <Edit className="h-4 w-4 mr-2" />
                Éditer
              </Button>
            )}
            <Badge className={`${getStatusColor(client.statut)} text-xs`}>
              {client.statut || "Actif"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation contextuelle */}
      <ContextNavigation
        type="client-to-mandats"
        client={client}
        mandatsCount={mandats.length}
      />

      {/* Contenu principal */}
      <div className="px-6 py-4">
        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Informations
            </button>
            <button
              onClick={() => setActiveTab("mandats")}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "mandats"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="h-4 w-4" />
              Mandats
              <Badge variant="secondary" className="ml-1 text-xs">
                {mandats.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "notes"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Notes
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="max-w-7xl mx-auto">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "mandats" && renderMandats()}
          {activeTab === "notes" && (
            <ContactNotes 
              contactId={client.id} 
              contactName={client.nom} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
