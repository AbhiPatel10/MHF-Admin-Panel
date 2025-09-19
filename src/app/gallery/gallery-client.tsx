'use client';

import * as React from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Upload, Edit } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const IMAGES_PER_PAGE = 8;

export function GalleryClient({ images: initialImages }: { images: GalleryImage[] }) {
  const [images, setImages] = React.useState<GalleryImage[]>(initialImages);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [imageToDelete, setImageToDelete] = React.useState<GalleryImage | null>(null);
  const [editingImage, setEditingImage] = React.useState<GalleryImage | null>(null);

  const [formData, setFormData] = React.useState<{ description: string; file: File | null }>({
    description: '',
    file: null,
  });
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const paginatedImages = images.slice(
    (currentPage - 1) * IMAGES_PER_PAGE,
    currentPage * IMAGES_PER_PAGE
  );

  const resetForm = () => {
    setEditingImage(null);
    setFormData({ description: '', file: null });
    setPreviewUrl(null);
    setIsFormOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = () => {
    if (!formData.description || (!formData.file && !editingImage)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Image and description are required.',
      });
      return;
    }

    if (editingImage) {
      // Update existing image
      const updatedImages = images.map((img) =>
        img.id === editingImage.id
          ? {
              ...img,
              description: formData.description,
              url: formData.file ? URL.createObjectURL(formData.file) : img.url,
            }
          : img
      );
      setImages(updatedImages);
      toast({
        title: 'Image Updated',
        description: 'The image details have been updated.',
      });
    } else {
      // Add new image
      const newImageObject: GalleryImage = {
        id: (images.length + 1).toString(),
        url: URL.createObjectURL(formData.file!),
        description: formData.description,
        uploaded: new Date().toISOString().split('T')[0],
      };
      setImages([newImageObject, ...images]);
      toast({
        title: 'Image Added',
        description: 'The new image has been added to the gallery.',
      });
    }

    resetForm();
  };

  const handleDelete = (imageId: string) => {
    setImages(images.filter((img) => img.id !== imageId));
    setImageToDelete(null);
    toast({
      title: 'Image Deleted',
      description: 'The image has been removed from the gallery.',
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({ description: image.description, file: null });
    setPreviewUrl(image.url);
    setIsFormOpen(true);
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {paginatedImages.map((image) => (
          <Card
            key={image.id}
            className="group relative flex cursor-pointer flex-col overflow-hidden"
            onClick={() => openEditDialog(image)}
          >
            <CardContent className="p-0">
              <div className="aspect-video w-full">
                <Image
                  src={image.url}
                  alt={image.description}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  data-ai-hint="landscape"
                />
              </div>
            </CardContent>
            <CardHeader className="flex-grow">
              <CardDescription className="line-clamp-3 text-sm">{image.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto flex justify-between p-4">
              <p className="text-xs text-muted-foreground">
                {format(new Date(image.uploaded), 'PPP')}
              </p>
              <div className='flex gap-2'>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); openEditDialog(image); }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); setImageToDelete(image); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

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
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
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
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => !isOpen && resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</DialogTitle>
            <DialogDescription>
              {editingImage ? 'Update the image or its description.' : 'Upload an image to your gallery.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="A brief description of the image."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-file">Image File</Label>
              <Card className="flex h-48 items-center justify-center border-dashed">
                {previewUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={previewUrl}
                      alt="Image preview"
                      fill
                      className="rounded-md object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="mx-auto h-12 w-12" />
                    <p>Image Preview</p>
                  </div>
                )}
              </Card>
              <Input id="image-file" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleFormSubmit}>
              {editingImage ? 'Save Changes' : 'Add to Gallery'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from the
              gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(imageToDelete!.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
