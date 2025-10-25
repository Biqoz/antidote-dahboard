import React from "react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { NavigationGroup, BadgeConfig } from "@/types/navigation";
import { SidebarNavigationItem } from "./sidebar-navigation-item";
import { cn } from "@/lib/utils";

interface SidebarNavigationGroupProps {
  group: NavigationGroup;
}

export const SidebarNavigationGroup = React.memo(
  function SidebarNavigationGroup({ group }: SidebarNavigationGroupProps) {
    // Fonction pour rendre le badge du groupe
    const renderGroupBadge = (
      badge: string | number | BadgeConfig | undefined
    ) => {
      if (!badge) return null;

      if (typeof badge === "string" || typeof badge === "number") {
        return (
          <Badge variant="secondary" className="text-xs ml-auto">
            {badge}
          </Badge>
        );
      }

      const badgeConfig = badge as BadgeConfig;
      return (
        <Badge
          variant={badgeConfig.variant || "secondary"}
          className={cn(
            "text-xs ml-auto transition-all duration-200",
            badgeConfig.pulse && "animate-pulse"
          )}
        >
          {badgeConfig.showCount && badgeConfig.count
            ? badgeConfig.count
            : badgeConfig.text}
        </Badge>
      );
    };

    const renderGroupHeader = () => {
      const headerContent = (
        <div className="flex items-center gap-3">
          {/* Indicateur visuel de catégorie au lieu d'une icône */}
          <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
          <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">
            {group.title}
          </span>
        </div>
      );

      if (group.isClickable) {
        return (
          <Link href={group.url}>
            <SidebarGroupLabel
              className={cn(
                "flex items-center justify-between py-2 px-2 mb-2 cursor-pointer transition-colors duration-200",
                // Retirer le shadow sur le hover pour la section CLIENTS
                group.title === "CLIENTS"
                  ? "hover:bg-sidebar-accent/30"
                  : "hover:bg-sidebar-accent/50 hover:shadow-sm"
              )}
            >
              {headerContent}
              {renderGroupBadge(group.badge)}
            </SidebarGroupLabel>
          </Link>
        );
      }

      return (
        <SidebarGroupLabel className="flex items-center justify-between py-2 px-2 mb-2">
          {headerContent}
          {renderGroupBadge(group.badge)}
        </SidebarGroupLabel>
      );
    };

    return (
      <SidebarGroup className="mb-2">
        {/* En-tête de catégorie - Style distinctif sans icône */}
        {renderGroupHeader()}
        <SidebarGroupContent>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarNavigationItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }
);
