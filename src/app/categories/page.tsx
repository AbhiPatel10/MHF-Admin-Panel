import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoriesClient } from './categories-client';

export default function CategoriesPage() {

  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Categories"
          description="Manage your categories for events and blog posts."
        />
        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoriesClient />
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
