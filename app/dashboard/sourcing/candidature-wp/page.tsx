import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CandidatureWPPage() {
  const breadcrumbs = [
    { label: "Dashboard RH", href: "/dashboard" },
    { label: "Sourcing", href: "/dashboard/sourcing" },
    { label: "Candidature WP" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Candidatures WordPress</CardTitle>
            <CardDescription>
              Gérez les candidatures reçues via WordPress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Interface de gestion des candidatures WordPress sera implémentée ici.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}