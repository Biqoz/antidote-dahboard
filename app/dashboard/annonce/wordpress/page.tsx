import { PageLayout } from "@/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WordPressPage() {
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
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Interface de gestion des annonces WordPress sera implémentée
                  ici.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
