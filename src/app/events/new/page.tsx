import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddEventForm } from './add-event-form';

export default function NewEventPage() {
  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Create New Event"
          description="Fill out the form below to add a new event to the calendar."
        />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <AddEventForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
