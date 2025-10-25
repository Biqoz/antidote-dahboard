"use client";

import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { UserAccount } from "@/components/user-account";
import {
  Sidebar,
  SidebarContent,
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
        <UserAccount />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {navigation.navMain.map((group) => (
          <SidebarNavigationGroup key={group.title} group={group} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
