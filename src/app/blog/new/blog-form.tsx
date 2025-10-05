"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditorClientProps } from "./editor-client";
import {
  createBlogApi,
  updateBlogApi,
  getBlogByIdApi,
  TCreateBlogPayload,
} from "@/services/blog.service";
import { getAllActiveCategoriesApi } from "@/services/categoryService";
import { OutputData } from "@editorjs/editorjs";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { uploadImageApi } from "@/services/image.service";
import dynamic from "next/dynamic";

const blogFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  content: z.any().optional(),
  image: z.any().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

type Category = {
  _id: string;
  name: string;
};

interface BlogFormProps {
  id?: string;
}

export default function BlogForm({ id }: BlogFormProps) {
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [fetching, setFetching] = React.useState(false);
  const [loading, setLoading] = React.useState<"draft" | "publish" | null>(
    null
  );
  const [isEdited, setIsEdited] = React.useState(false);

  const isEdit = !!id;
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      category: "",
      content: undefined,
    },
  });

  const { control, handleSubmit, setValue, reset, watch } = form;
  const content = watch("content");

  const EditorClient = dynamic<EditorClientProps>(
    () => import("./editor-client").then((mod) => mod.EditorClient), // Extract named export
    {
      ssr: false, // Disable SSR
      loading: () => (
        <div className="p-4 text-center text-muted-foreground">
          Loading editor...
        </div>
      ), // Fallback UI (React component or function returning one)
    }
  );

  // Fetch categories
  React.useEffect(() => {
    setIsEdited(false);
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

  // Fetch blog details if editing
  React.useEffect(() => {
    if (!isEdit) return;
    const fetchBlog = async () => {
      try {
        const res = await getBlogByIdApi(id!);
        const blog = res.data;
        form.setValue("title", blog.title);
        form.setValue("content", blog.content);
        form.setValue("category", blog.category._id);
        if (blog.image?.url) setPhotoPreview(blog.image?.url);
        setTimeout(() => setIsEdited(true), 300);
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
  }, [id, isEdit, reset, toast, categories, form]);

  const onSubmit = async (values: BlogFormValues, isDraft: boolean) => {
    if (!values.title || !values.category || !values.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(isDraft ? "draft" : "publish");
      let imageId: string | undefined;

      // upload image if file selected
      if (values.image instanceof File) {
        const uploadRes = await uploadImageApi(values.image);
        imageId = uploadRes.data._id;
      }
      if (isEdit) {
        const payload = {
          ...(imageId && { image: imageId }),
          title: values.title,
          category: values.category,
          content: values.content,
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
        const payload: TCreateBlogPayload = {
          ...(imageId && { image: imageId }),
          title: values.title,
          category: values.category,
          content: values.content,
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
          reset();
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a catchy title"
                      {...field}
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="content"
              render={() => (
                <FormItem>
                  <FormLabel>Post Content</FormLabel>
                  <EditorClient
                    value={content}
                    isEdited={isEdited}
                    onChange={(data: OutputData) => setValue("content", data)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Featured Image</FormLabel>
                  <Card className="flex h-48 items-center justify-center border-dashed">
                    {photoPreview ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={photoPreview}
                          alt="Featured image preview"
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="mx-auto h-12 w-12" />
                        <p>Image Preview</p>
                      </div>
                    )}
                  </Card>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={fetching}
                    >
                      <SelectTrigger>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            disabled={loading === "draft"}
            onClick={() => handleSubmit((data) => onSubmit(data, true))()}
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
            type="button"
            disabled={loading === "publish"}
            onClick={() => handleSubmit((data) => onSubmit(data, false))()}
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
      </form>
    </Form>
  );
}
