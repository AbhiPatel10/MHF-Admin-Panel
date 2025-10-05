import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddEventForm } from "../add-event-form";

export default async function EventEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Edit New Event"
          description="Fill out the form below to add a new event to the calendar."
        />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <AddEventForm id={slug} />
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
