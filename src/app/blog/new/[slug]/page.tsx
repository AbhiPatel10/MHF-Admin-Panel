"use client";

import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogForm from "../blog-form";

export default async function EditPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Create New Post"
          description="Craft a new article for your organization's blog."
        />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BlogForm id={slug} />
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
