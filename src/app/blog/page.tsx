"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { format } from "date-fns";
import { Edit, PlusCircle, Trash2 } from "lucide-react";

import { AppLayout } from "@/components/app-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getAllBlogsApi, deleteBlogApi, TBlog } from "@/services/blog.service";
import { useToast } from "@/hooks/use-toast";

export default function BlogPage() {
  const { toast } = useToast();
  const [posts, setPosts] = React.useState<TBlog[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("all");
  const [sortOrder, setSortOrder] = React.useState("date-desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postToDelete, setPostToDelete] = React.useState<TBlog | null>(null);

  const pageSize = 6;
  const categories = [
    { id: "tech", name: "Tech" },
    { id: "news", name: "News" },
    { id: "updates", name: "Updates" },
  ];

  // ✅ Fetch all blogs
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
      setPostToDelete(null);
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

  // ✅ Filter + Sort + Paginate
  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" ||
        (post.category && post.category.name === filterCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "date-desc")
        return dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix();
      if (sortOrder === "date-asc")
        return dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix();
      if (sortOrder === "title-asc") return a.title.localeCompare(b.title);
      if (sortOrder === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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

        {/* 🔍 Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="max-w-xs"
              />
              <div className="flex gap-4">
                <Select
                  value={filterCategory}
                  onValueChange={(value) => {
                    setFilterCategory(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 📝 Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex justify-center p-6">
              Loading...
            </div>
          ) : paginatedPosts.length > 0 ? (
            paginatedPosts.map((post) => (
              <Card
                key={post._id}
                className="group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.image?.url || "/placeholder.webp"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-lg font-bold leading-tight">
                    <Link
                      href={`/blog/new/${post._id}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {/* <span>{post.author || "Unknown"}</span> */}
                    <span>•</span>
                    <span>{format(new Date(post.createdAt), "PPP")}</span>
                  </div>
                  <Badge
                    variant={post.isDraft ? "secondary" : "default"}
                    className={!post.isDraft ? "bg-green-600" : ""}
                  >
                    {post.isDraft ? "Draft" : "Published"}
                  </Badge>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Link href={`/blog/new/${post._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>

                    <AlertDialog
                      open={!!postToDelete && postToDelete._id === post._id}
                      onOpenChange={(isOpen) =>
                        !isOpen && setPostToDelete(null)
                      }
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setPostToDelete(post)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the blog post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setPostToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post._id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                No posts found
              </h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* 🔄 Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="p-2 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
