"use client";

import { usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";
import { navigationConfig } from "@/lib/navigation-config";
import { NavigationData, NavigationGroup, NavigationItem } from "@/types/navigation";

export function useNavigation(): NavigationData {
  const pathname = usePathname();

  // Fonction memoized pour vérifier si un item est actif
  const isItemActive = useCallback((itemUrl: string): boolean => {
    return pathname === itemUrl || pathname.startsWith(itemUrl + "/");
  }, [pathname]);

  // Navigation avec état actif optimisé
  const navigationWithActiveState = useMemo(() => {
    const navMain = navigationConfig.navMain.map((group: NavigationGroup) => {
      const items = group.items.map((item: NavigationItem) => ({
        ...item,
        isActive: isItemActive(item.url),
      }));

      const isGroupActive = items.some(item => item.isActive);

      return {
        ...group,
        items,
        isActive: isGroupActive,
      };
    });

    return { navMain };
  }, [isItemActive]);

  return navigationWithActiveState;
}
