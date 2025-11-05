"use client";

import { useEffect, useRef } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WordPressPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Prevent infinite reload loop from WordPress/LiteSpeed
    let reloadAttempts = 0;
    const maxReloads = 2;
    const reloadTimeWindow = 5000; // 5 seconds
    let lastReloadTime = 0;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const now = Date.now();

      // Reset counter if enough time has passed
      if (now - lastReloadTime > reloadTimeWindow) {
        reloadAttempts = 0;
      }

      reloadAttempts++;
      lastReloadTime = now;

      // Block reload if too many attempts in short time
      if (reloadAttempts > maxReloads) {
        e.preventDefault();
        e.returnValue = "";
        console.warn("[WordPress] Blocked infinite reload loop");
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const breadcrumbs = [
    { label: "Dashboard RH", href: "/dashboard" },
    { label: "Annonce", href: "/dashboard/annonce" },
    { label: "WordPress" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Annonces WordPress</CardTitle>
            <CardDescription>
              Créez et gérez vos annonces d&apos;emploi sur WordPress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full h-[calc(100vh-280px)] min-h-[600px]">
                <iframe
                  ref={iframeRef}
                  src="https://group-optimal.com/dashboard-agents-ia/?LSCWP_CTRL=before_optm"
                  className="w-full h-full border-0 rounded-lg"
                  title="Dashboard Agents IA WordPress"
                  allow="fullscreen"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
