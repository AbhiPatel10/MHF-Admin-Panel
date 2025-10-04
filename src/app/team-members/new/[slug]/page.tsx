import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddTeamMemberForm } from '../add-team-member-form';

export default async function NewTeamMemberPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Add New Team Member"
          description="Fill out the form below to add a new member to your team."
        />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
            </CardHeader>
            <CardContent>
              <AddTeamMemberForm id={slug} />
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
