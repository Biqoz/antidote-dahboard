"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BreadcrumbNav } from "./breadcrumb-nav";

interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageLayout({ children, breadcrumbs }: PageLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        {/* Breadcrumb fixe en haut */}
        {breadcrumbs && (
          <div className="sticky top-0 z-10 bg-background border-b">
            <BreadcrumbNav items={breadcrumbs} />
          </div>
        )}
        {/* Contenu scrollable */}
        <div className="flex-1 overflow-auto bg-gray-50/30">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
