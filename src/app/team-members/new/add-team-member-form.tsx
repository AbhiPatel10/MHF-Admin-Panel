"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Upload, CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  createTeamMemberApi,
  getTeamMemberByIdApi,
  updateTeamMemberApi,
} from "@/services/teamMemberService";
import { uploadImageApi } from "@/services/image.service";
import {
  TCreateTeamMemberPayload,
  TeamMemberTypes,
} from "@/utils/types/teamMemberTypes";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNo: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
  role: z.string().min(2, { message: "Role is required." }),
  type: z.enum([TeamMemberTypes.ASSET, TeamMemberTypes.KEY_MEMBER]),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  postalCode: z.string().min(6, { message: "Postal code is required." }),
  bloodGroup: z.string().optional(),
  birthdate: z.date().optional(),
  skills: z.string().optional(),
  photo: z.any().optional(),
  occupation: z.string().min(2, { message: "Occupation is required." }),
});

export function AddTeamMemberForm({ id }: { id?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!id;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNo: "",
      role: "",
      type: TeamMemberTypes.ASSET,
      city: "",
      state: "",
      postalCode: "",
      bloodGroup: "",
      birthdate: undefined,
      skills: "",
    },
  });

  React.useEffect(() => {
    if (!isEdit) return;

    const fetchVolunteer = async () => {
      setIsLoading(true);
      try {
        const res = await getTeamMemberByIdApi(id!);
        if (res.status === 200) {
          const data = res.data;
          form.setValue("name", data.name);
          form.setValue("city", data.address?.city || "");
          form.setValue("state", data.address?.state || "");
          form.setValue("postalCode", data.address?.postalCode || "");
          form.setValue("phoneNo", data.phoneNo);
          form.setValue(
            "birthdate",
            data.birthdate ? new Date(data.birthdate) : undefined
          );
          form.setValue("bloodGroup", data.bloodGroup || "");
          form.setValue("occupation", data.occupation);
          form.setValue("role", data.role);
          form.setValue("skills", data.skills?.[0] || "");
          if (data.image?.url) setPhotoPreview(data.image.url);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to fetch volunteer",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteer();
  }, [id, isEdit, form, toast]);

  // On form submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    let imageId: string | undefined;

    // Upload photo if a file was selected
    if (values.photo instanceof File) {
      try {
        const uploadRes = await uploadImageApi(values.photo);
        imageId = uploadRes.data._id;
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message || "Image upload failed",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // Build payload
    const payload: TCreateTeamMemberPayload = {
      ...(imageId && { image: imageId }),
      name: values.name,
      phoneNo: values.phoneNo,
      role: values.role,
      memberType: values.type,
      address: {
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
      },
      bloodGroup: values.bloodGroup ?? "",
      birthdate: values.birthdate,
      skills: values.skills ? [values.skills] : [],
      occupation: values.occupation,
    };
    try {
      const res = isEdit
        ? await updateTeamMemberApi(id!, payload)
        : await createTeamMemberApi(payload);

      toast({
        title: isEdit ? "Team Member Updated!" : "Team Member Added!",
        description:
          res.message ||
          `${values.name} has been ${isEdit ? "updated" : "added"}.`,
      });

      if (!isEdit) {
        form.reset();
        setPhotoPreview(null);
      }
      router.push("/team-members");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
      form.setValue("photo", file); // store file in form state
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left: Photo */}
          <div className="space-y-8 md:col-span-1">
            <FormField
              control={form.control}
              name="photo"
              render={() => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <Card className="flex h-48 items-center justify-center border-dashed">
                    {photoPreview ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={photoPreview}
                          alt="Member photo preview"
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
                    Upload a profile picture for the team member.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right: Form Fields */}
          <div className="space-y-8 md:col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone*</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter occupation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Coordinator, Volunteer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Type*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a member type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Asset">Asset</SelectItem>
                        <SelectItem value="Key Member">Key Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Blood Group + Birthdate */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <Select
                      value={field.value || ""} // ✅ Controlled value
                      onValueChange={(val) => field.onChange(val)} // ✅ Update form state
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthdate</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          {/* <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Member
          </Button> */}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Saving..." : isEdit ? "Update Member" : "Save Member"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
