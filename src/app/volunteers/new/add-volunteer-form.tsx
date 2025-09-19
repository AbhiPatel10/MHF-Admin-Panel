'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Loader2, Save, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { createVolunteerApi, getVolunteerByIdApi, updateVolunteerApi } from '@/services/volunteerService';
import { uploadImageApi } from '@/services/image.service';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  bloodGroup: z.string().optional(),
  city: z.string().min(2, { message: 'City is required.' }),
  state: z.string().min(2, { message: 'State is required.' }),
  postalCode: z.string().min(6, { message: 'Postal code is required.' }),
  phoneNo: z.string().min(10, { message: 'Phone number is required.' }),
  birthdate: z.date().optional(),
  occupation: z
    .string()
    .min(2, { message: 'Occupation must be at least 2 characters.' }),
  skills: z.string().optional(),
  photo: z.any().optional(),
});

interface AddVolunteerFormProps {
  id?: string;
}

export function AddVolunteerForm({ id }: AddVolunteerFormProps) {
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      city: '',
      state: '',
      postalCode: '',
      phoneNo: '',
      birthdate: undefined,
      bloodGroup: '',
      occupation: '',
      skills: '',
      photo: undefined,
    },
  });

  // Prefill form if editing
  React.useEffect(() => {
    if (!isEdit) return;

    const fetchVolunteer = async () => {
      setIsLoading(true);
      try {
        const res = await getVolunteerByIdApi(id!);
        if (res.status === 200) {
          const data = res.data;
          form.setValue('name', data.name);
          form.setValue('city', data.address?.city || '');
          form.setValue('state', data.address?.state || '');
          form.setValue('postalCode', data.address?.postalCode || '');
          form.setValue('phoneNo', data.phoneNo);
          form.setValue('birthdate', data.birthdate ? new Date(data.birthdate) : undefined);
          form.setValue('bloodGroup', data.bloodGroup || '');
          form.setValue('occupation', data.occupation);
          form.setValue('skills', data.skills?.[0] || '');
          if (data.image?.url) setPhotoPreview(data.image.url);
        }
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to fetch volunteer',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteer();
  }, [id, isEdit, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    let imageId: string | undefined;

    if (values.photo instanceof File) {
      const uploadRes = await uploadImageApi(values.photo);
      imageId = uploadRes.data._id;
    }

    const payload = {
      ...(imageId && { image: imageId }),
      name: values.name,
      address: {
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
      },
      phoneNo: values.phoneNo,
      bloodGroup: values.bloodGroup ?? '',
      birthdate: values.birthdate,
      occupation: values.occupation,
      skills: [values.skills ?? ''],
    };

    try {
      const res = isEdit
        ? await updateVolunteerApi(id!, payload)
        : await createVolunteerApi(payload);

      if (res.status === 200) {
        toast({
          title: isEdit ? 'Volunteer Updated!' : 'Volunteer Added!',
          description: res.message || `${values.name} has been ${isEdit ? 'updated' : 'added'}.`,
        });
        if (!isEdit) {
          form.reset();
          setPhotoPreview(null);
        }
      } else {
        toast({
          title: 'Error',
          description: res.message || 'Operation failed',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
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
      form.setValue('photo', file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter volunteer's full name"
                        {...field}
                      />
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
                      <Input
                        placeholder="e.g., Software Engineer, Teacher"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>City*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem>
                  <FormLabel>State*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="postalCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
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
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP')
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
                            date > new Date() || date < new Date('1900-01-01')
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
            <FormField
              control={form.control}
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <Card className="flex h-64 items-center justify-center border-dashed">
                    {photoPreview ? (
                      <div className="relative h-56 w-56">
                        <Image
                          src={photoPreview}
                          alt="Volunteer photo preview"
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
                    Upload a profile picture for the volunteer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any relevant skills (e.g., fundraising, graphic design, CPR certified)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This helps us match the volunteer to suitable opportunities.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Saving...' : isEdit ? 'Update Volunteer' : 'Save Volunteer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
