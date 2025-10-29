"use client";

import * as React from "react";
import Image from "next/image";

import { UserAccount } from "@/components/user-account";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNavigationGroup } from "@/components/sidebar/sidebar-navigation-group";
import { useNavigation } from "@/hooks/use-navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigation = useNavigation();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-start justify-start p-4 space-x-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={35}
            height={20}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Cercle Talents
            </span>
            <span className="text-xs text-muted-foreground">Optimal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.navMain.map((group) => (
          <SidebarNavigationGroup key={group.title} group={group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UserAccount />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
