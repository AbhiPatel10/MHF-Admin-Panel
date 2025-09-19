"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { EditorClient } from "./editor-client";
import {
  createBlogApi,
  updateBlogApi,
  getBlogByIdApi,
  TCreateBlogPayload,
  TUpdateBlogPayload,
} from "@/services/blog.service";
import { useToast } from "@/hooks/use-toast";
import { OutputData } from "@editorjs/editorjs";
import { getAllActiveCategoriesApi } from "@/services/categoryService";

type Category = {
  _id: string;
  name: string;
};

interface EditBlogFormProps {
  id?: string;
}

export default function BlogForm({ id }: EditBlogFormProps) {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState<OutputData>();
  const [loading, setLoading] = useState<"draft" | "publish" | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetching, setFetching] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const isEdit = !!id;

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetching(true);
        const res = await getAllActiveCategoriesApi();
        setCategories(res.data.categories);
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Failed to load categories",
          variant: "destructive",
        });
      } finally {
        setFetching(false);
      }
    };
    fetchCategories();
  }, [toast]);

  // ✅ Fetch blog details in edit mode
  useEffect(() => {
    if (!isEdit) return;
    const fetchBlog = async () => {
      try {
        const res = await getBlogByIdApi(id!);
        const blog = res.data;
        setTitle(blog.title);
        setCategory(blog.category._id);
        setContent(blog.content);
        setTimeout(() => {
          setIsEdited(true);
        }, 200);
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Failed to load blog details",
          variant: "destructive",
        });
      }
    };
    fetchBlog();
  }, [id, isEdit, toast]);

  // ✅ Handle create or update
  const handleSubmit = async (isDraft: boolean) => {
    if (!title || !category || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(isDraft ? "draft" : "publish");

      if (isEdit) {
        // 🔄 Update
        const payload: TUpdateBlogPayload = {
          title,
          category,
          content,
          isDraft,
        };
        const res = await updateBlogApi(id, payload);
        if (res.status === 200) {
          toast({
            title: "Success",
            description: "Blog updated successfully!",
          });
        }
      } else {
        // ➕ Create
        const payload: TCreateBlogPayload = {
          title,
          category,
          content,
          isDraft,
        };
        const res = await createBlogApi(payload);
        if (res.status === 201) {
          toast({
            title: "Success",
            description: isDraft
              ? "Blog saved as draft successfully!"
              : "Blog published successfully!",
          });
          setTitle("");
          setCategory("");
          setContent(undefined);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Post Title</Label>
          <Input
            id="title"
            placeholder="Enter a catchy title"
            className="text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {fetching ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      {console.log("content---", content)}
      <div className="space-y-2">
        <Label>Post Content</Label>
        <EditorClient
          onChange={setContent}
          value={content}
          isEdited={isEdited}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={loading === "draft"}
          onClick={() => handleSubmit(true)}
        >
          {loading === "draft" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Update Draft"
          ) : (
            "Save as Draft"
          )}
        </Button>

        <Button
          disabled={loading === "publish"}
          onClick={() => handleSubmit(false)}
        >
          {loading === "publish" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Publishing..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEdit ? "Update Post" : "Publish Post"}
            </>
          )}
        </Button>
      </div>
    </>
  );
}
