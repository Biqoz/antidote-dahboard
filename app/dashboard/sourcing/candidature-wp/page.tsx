import { PageLayout } from "@/components/layout/page-layout";
import { CandidatureWPList } from "@/components/candidature/candidature-wp-list";

export default function CandidatureWPPage() {
  const breadcrumbs = [
    { label: "Dashboard RH", href: "/dashboard" },
    { label: "Sourcing", href: "/dashboard/sourcing" },
    { label: "Candidature WP" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <CandidatureWPList />
      </div>
    </PageLayout>
  );
}