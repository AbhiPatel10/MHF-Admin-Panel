import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddVolunteerForm } from "./add-volunteer-form";

export default function NewVolunteerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Add New Volunteer"
          description="Fill out the form below to add a new member to your team."
        />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <AddVolunteerForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
