import {
  MessageSquare,
  Bot,
  Building2,
  FileText,
  Users,
  Search,
  Target,
  Megaphone,
  Globe,
  Linkedin,
  Eye,
  Database,
  UserCheck,
} from "lucide-react";
import { NavigationData } from "@/types/navigation";

export const navigationConfig: NavigationData = {
  navMain: [
    {
      title: "CHAT",
      url: "/dashboard/chat",
      icon: MessageSquare,
      items: [
        {
          title: "Assistant RH",
          url: "/dashboard/chat/assistant-rh",
          icon: Bot,
          disabled: true,
          description: "Assistant IA pour les tâches RH",
          badge: {
            text: "Bientôt",
            variant: "outline",
          },
        },
      ],
    },
    {
      title: "CLIENTS",
      url: "/dashboard/clients",
      icon: Building2,
      items: [
        {
          title: "Mandats",
          url: "/dashboard/clients/mandats",
          icon: FileText,
          description: "Gestion des mandats de recrutement",
        },
        {
          title: "Contacts",
          url: "/dashboard/clients/contacts",
          icon: Users,
          description: "Base de données contacts",
        },
      ],
    },
    {
      title: "Vivier de talents",
      url: "/dashboard/vivier",
      icon: Database,
      items: [
        {
          title: "Profils",
          url: "/dashboard/vivier/candidats",
          icon: UserCheck,
          description: "Base de données profils",
        },
      ],
    },
    {
      title: "Sourcing",
      url: "/dashboard/sourcing",
      icon: Search,
      items: [
        {
          title: "Chasse",
          url: "/dashboard/sourcing/chasse",
          icon: Target,
          disabled: true,
          description: "Chasse de têtes active",
          badge: {
            text: "Bientôt",
            variant: "outline",
          },
        },
        {
          title: "Candidatures",
          url: "/dashboard/sourcing/candidature-wp",
          icon: Globe,
          description: "Candidatures via WordPress",
        },
      ],
    },
    {
      title: "Annonces",
      url: "/dashboard/annonces",
      icon: Megaphone,
      items: [
        {
          title: "WordPress",
          url: "/dashboard/annonces/wordpress",
          icon: Globe,
          description: "Annonces sur site WordPress",
        },
        {
          title: "LinkedIn",
          url: "/dashboard/annonce/linkedin",
          icon: Linkedin,
          disabled: true,
          description: "Annonces sur LinkedIn",
          badge: {
            text: "Bientôt",
            variant: "outline",
          },
        },
      ],
    },
    {
      title: "Veille",
      url: "/dashboard/veille",
      icon: Eye,
      items: [
        {
          title: "Candidats",
          url: "/dashboard/veille/candidats",
          icon: Building2,
          disabled: true,
          description: "Veille candidats et prospects",
          badge: {
            text: "Bientôt",
            variant: "outline",
          },
        },
        {
          title: "Talents",
          url: "/dashboard/veille/talents",
          icon: Users,
          disabled: true,
          description: "Veille marché des talents",
          badge: {
            text: "Bientôt",
            variant: "outline",
          },
        },
        {
          title: "Concurrents",
          url: "/dashboard/veille/concurrents",
          icon: Target,
          disabled: true,
          description: "Veille concurrentielle",
          badge: {
            text: "Bientôt",
            variant: "outline",
          },
        },
      ],
    },
  ],
};
