"use client";

import * as React from "react";
import dayjs from "dayjs";

import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getAllBlogsApi, deleteBlogApi, TBlog } from "@/services/blog.service";
import { useToast } from "@/hooks/use-toast";

export default function BlogPage() {
  const { toast } = useToast();
  const [posts, setPosts] = React.useState<TBlog[]>([]);
  const [loading, setLoading] = React.useState(false);

  // ✅ Fetch all blogs on mount
  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await getAllBlogsApi();
        setPosts(res.data.blogs || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Failed to load blogs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [toast]);

  // ✅ Delete blog
  const handleDelete = async (postId: string) => {
    try {
      await deleteBlogApi(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      toast({
        title: "Deleted",
        description: "Blog post deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Blog Posts"
          description="Manage your organization's articles and news."
        >
          <Button asChild>
            <Link href="/blog/new">
              <PlusCircle className="mr-2" />
              New Post
            </Link>
          </Button>
        </PageHeader>
        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  {/* <TableHead>Author</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : posts.length > 0 ? (
                  posts.map((post: TBlog) => (
                    <TableRow key={post._id}>
                      <TableCell className="font-medium">
                        {post.title}
                      </TableCell>
                      {/* <TableCell>{post.author}</TableCell> */}
                      <TableCell>
                        <Badge
                          variant={post.isActive ? "default" : "secondary"}
                          className={post.isDraft ? "" : "bg-green-600"}
                        >
                          {post.isDraft ? "Draft" : "Published"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {dayjs(post.createdAt).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/new/${post._id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the blog post.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(post._id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No posts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
