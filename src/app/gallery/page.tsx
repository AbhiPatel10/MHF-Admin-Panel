import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { galleryImages } from '@/lib/data';
import { GalleryClient } from './gallery-client';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function GalleryPage() {
  const images = galleryImages;

  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Gallery"
          description="Manage your organization's image gallery."
        >
        </PageHeader>
        <GalleryClient images={images} />
      </main>
    </AppLayout>
  );
}
