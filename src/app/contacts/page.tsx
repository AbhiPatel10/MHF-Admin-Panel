import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contacts } from "@/lib/data";
import { ContactsClient } from "./contacts-client";

export default function ContactsPage() {
  // In a real app, you would fetch this data from a database
  const contactData = contacts;

  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Contacts"
          description="View messages from people who have contacted your organization."
        />
        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactsClient />
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
