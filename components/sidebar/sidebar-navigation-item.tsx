import React from "react";
import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { NavigationItem, BadgeConfig } from "@/types/navigation";
import { cn } from "@/lib/utils";

interface SidebarNavigationItemProps {
  item: NavigationItem;
}

export const SidebarNavigationItem = React.memo(function SidebarNavigationItem({ item }: SidebarNavigationItemProps) {
  const IconComponent = item.icon;

  // Fonction pour rendre le badge intelligent
  const renderBadge = (badge: string | number | BadgeConfig | undefined, isDisabled: boolean = false) => {
    if (!badge) return null;

    if (typeof badge === "string" || typeof badge === "number") {
      return (
        <Badge 
          variant={item.isActive ? "default" : "secondary"}
          className={cn("text-xs", isDisabled && "opacity-50")}
        >
          {badge}
        </Badge>
      );
    }

    // Badge configuré avec options avancées
    const badgeConfig = badge as BadgeConfig;
    return (
      <Badge 
        variant={badgeConfig.variant || (item.isActive ? "default" : "secondary")}
        className={cn(
          "text-xs ml-auto transition-all duration-200",
          badgeConfig.pulse && "animate-pulse",
          isDisabled && "opacity-50"
        )}
      >
        {badgeConfig.showCount && badgeConfig.count ? badgeConfig.count : badgeConfig.text}
      </Badge>
    );
  };

  // Point de notification rouge
  const renderNotification = () => {
    if (!item.notification) return null;
    
    return (
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
    );
  };

  if (item.disabled) {
    return (
      <SidebarMenuItem className="relative">
        <div title={item.description || "Module non disponible"} className="w-full">
          <SidebarMenuButton
            disabled
            className="opacity-50 cursor-not-allowed w-full"
          >
            <div className="flex items-center gap-2 w-full">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span className="flex-1">{item.title}</span>
              {renderBadge(item.badge, true)}
            </div>
          </SidebarMenuButton>
        </div>
        {renderNotification()}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem className="relative">
      <SidebarMenuButton 
        asChild 
        isActive={item.isActive}
        className={cn(
          "w-full transition-all duration-200 hover:bg-accent/50",
          item.isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
        )}
      >
        <Link href={item.url} title={item.description}>
          <div className="flex items-center gap-2 w-full">
            {IconComponent && (
              <IconComponent 
                className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  item.isActive && "text-sidebar-accent-foreground"
                )} 
              />
            )}
            <span className="flex-1">{item.title}</span>
            {renderBadge(item.badge)}
          </div>
        </Link>
      </SidebarMenuButton>
      {renderNotification()}
    </SidebarMenuItem>
  );
});