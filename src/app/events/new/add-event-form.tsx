"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { uploadImageApi } from "@/services/image.service";
import { EditorClientProps } from "@/app/blog/new/editor-client";
import {
  createEventApi,
  getEventByIdApi,
  updateEventApi,
} from "@/services/eventService";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  category: z.string().min(2, { message: "Category is required." }),
  date: z.date({ required_error: "Event date is required." }),
  location: z.string().min(3, { message: "Location is required." }),
  image: z.any().optional(),
  description: z.any().optional(), // Editor.js JSON
});

interface AddEventFormProps {
  id?: string;
}

export function AddEventForm({ id }: AddEventFormProps) {
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editorData, setEditorData] = React.useState<any>(null); // store Editor.js data
  const [isEdited, setIsEdited] = React.useState(false);
  const isEdit = !!id;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      location: "",
      date: undefined,
      image: undefined,
      description: undefined,
    },
  });

  const EditorClient = dynamic<EditorClientProps>(
    () =>
      import("../../blog/new/editor-client").then((mod) => mod.EditorClient), // Extract named export
    {
      ssr: false, // Disable SSR
      loading: () => (
        <div className="p-4 text-center text-muted-foreground">
          Loading editor...
        </div>
      ), // Fallback UI (React component or function returning one)
    }
  );

  // Prefill form if editing
  React.useEffect(() => {
    if (!isEdit) return;

    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const res = await getEventByIdApi(id!);
        if (res.status === 200) {
          const data = res.data;
          form.setValue("name", data.name);
          form.setValue("category", data.category);
          form.setValue("location", data.location);
          if (data.date) {
            form.setValue("date", new Date(data.date));
          } else {
            form.resetField("date");
          }
          if (data.image?.url) setPhotoPreview(data.image?.url);
          if (data.description) setEditorData(data.description);
          setInterval(() => {
            setIsEdited(true);
          }, 200);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to fetch event",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, isEdit, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    let imageId: string | undefined;

    // upload image if file selected
    if (values.image instanceof File) {
      const uploadRes = await uploadImageApi(values.image);
      imageId = uploadRes.data._id;
    }

    const payload = {
      ...(imageId && { image: imageId }),
      name: values.name,
      category: values.category,
      location: values.location,
      date: values.date ? values.date.toISOString() : "", // Ensure date is always a string
      description: editorData, // editor js json
    };

    try {
      const res = isEdit
        ? await updateEventApi(id!, payload)
        : await createEventApi(payload);

      if (res.status === 200) {
        toast({
          title: isEdit ? "Event Updated!" : "Event Created!",
          description:
            res.message ||
            `${values.name} has been ${isEdit ? "updated" : "created"}.`,
        });
        if (!isEdit) {
          form.reset();
          setPhotoPreview(null);
          setEditorData(null);
        }
      } else {
        toast({
          title: "Error",
          description: res.message || "Operation failed",
          variant: "destructive",
        });
      }
      router.back();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            {/* Event Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Image</FormLabel>
                  <Card className="flex h-64 items-center justify-center border-dashed">
                    {photoPreview ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={photoPreview}
                          alt="Event image preview"
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
                  <FormDescription>
                    Upload a banner image for your event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Annual Charity Gala" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Description */}
            <div className="space-y-2">
              <FormLabel>Event Description*</FormLabel>
              <EditorClient
                value={editorData}
                onChange={(data) => setEditorData(data)}
                isEdited={isEdited}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fundraising" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Grand Ballroom, City Center"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Saving..." : isEdit ? "Update Event" : "Save Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
