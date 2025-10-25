import { LucideIcon } from "lucide-react";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";;

export interface BadgeConfig {
  text: string;
  variant?: BadgeVariant;
  count?: number;
  showCount?: boolean;
  pulse?: boolean; // Animation pour notifications importantes
}

export interface NavigationItem {
  title: string;
  url: string;
  disabled?: boolean;
  icon?: LucideIcon;
  badge?: string | number | BadgeConfig;
  description?: string;
  isActive?: boolean;
  notification?: boolean; // Point rouge pour nouvelles notifications
}

export interface NavigationGroup {
  title: string;
  url: string;
  items: NavigationItem[];
  icon?: LucideIcon;
  isActive?: boolean;
  badge?: string | number | BadgeConfig;
  isClickable?: boolean;
}

export interface NavigationData {
  navMain: NavigationGroup[];
}