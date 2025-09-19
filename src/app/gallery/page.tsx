import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { GalleryClient } from './gallery-client';

export default function GalleryPage() {

  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Gallery"
          description="Manage your organization's image gallery."
        >
        </PageHeader>
        <GalleryClient />
      </main>
    </AppLayout>
  );
}
