"use client";

import * as React from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import { GalleryImageFormDialog } from "./GalleryImageFormDialog";
import { GalleryImageDeleteDialog } from "./GalleryImageDeleteDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  addImageToGalleryApi,
  deleteGalleryImageApi,
  getAllGalleryImagesApi,
  updateGalleryImageApi,
} from "@/services/galleryService";
import { uploadImageApi } from "@/services/image.service";

const IMAGES_PER_PAGE = 8;

export function GalleryClient() {
  const [images, setImages] = React.useState<GalleryImage[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [imageToDelete, setImageToDelete] = React.useState<GalleryImage | null>(
    null
  );
  const [editingImage, setEditingImage] = React.useState<GalleryImage | null>(
    null
  );

  const [formData, setFormData] = React.useState<{
    description: string;
    file: File | null;
  }>({
    description: "",
    file: null,
  });
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil(totalCount / IMAGES_PER_PAGE);

  console.log("---images", images);
  // 🔹 Fetch gallery images with pagination
  const fetchGalleryImages = async (page: number = 1) => {
    try {
      const offset = (page - 1) * IMAGES_PER_PAGE;
      const { data, status } = await getAllGalleryImagesApi(
        offset,
        IMAGES_PER_PAGE
      );
      if (status === 200) {
        setImages(data.galleryImages);
        setTotalCount(data.totalCount);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load gallery images.",
      });
    }
  };

  React.useEffect(() => {
    fetchGalleryImages(currentPage);
  }, [currentPage]);

  const resetForm = () => {
    setEditingImage(null);
    setFormData({ description: "", file: null });
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

  const handleFormSubmit = async () => {
    if (!formData.description || (!formData.file && !editingImage)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image and description are required.",
      });
      return;
    }

    try {
      let imageId: string | undefined;
      let imageUrl: string | undefined;

      if (formData.file) {
        const uploadRes = await uploadImageApi(formData.file);
        imageId = uploadRes.data._id;
        imageUrl = uploadRes.data.url; // assuming backend returns url
      }

      if (editingImage) {
        // call update API
        const payload = {
          imageDescription: formData.description,
          altText: "",
          ...(imageId && { image: imageId }),
        };

        const res = await updateGalleryImageApi(editingImage._id, payload);

        if (res.status === 200) {
          fetchGalleryImages(currentPage);
          toast({ title: "Image Updated", description: res.message });
        }
      } else {
        const payload = {
          imageDescription: formData.description,
          altText: "",
          image: imageId!,
        };

        const res = await addImageToGalleryApi(payload);

        if (res.status === 200) {
          fetchGalleryImages(currentPage);
          toast({ title: "Image Added", description: res.message });
        }
      }

      resetForm();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteGalleryImageApi(imageId);
      setImageToDelete(null);
      toast({
        title: "Image Deleted",
        description: "The image has been removed from the gallery.",
      });
      fetchGalleryImages(currentPage);
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image.",
      });
    }
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
    setFormData({ description: image.imageDescription, file: null });
    setPreviewUrl(image.image.url);
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
        {images?.map((image) => (
          <Card
            key={image._id}
            className="group relative flex cursor-pointer flex-col overflow-hidden"
            onClick={() => openEditDialog(image)}
          >
            <CardContent className="p-0">
              <div className="aspect-video w-full">
                <Image
                  src={image.image?.url}
                  alt={image.imageDescription}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </CardContent>
            <CardHeader className="flex-grow">
              <CardDescription className="line-clamp-3 text-sm">
                {image.imageDescription}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto flex justify-between p-4">
              <p className="text-xs text-muted-foreground">
                {format(new Date(image?.createdAt), "PPP")}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(image);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageToDelete(image);
                  }}
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

      {/* Form Dialog */}
      <GalleryImageFormDialog
        open={isFormOpen}
        onOpenChange={(isOpen) => !isOpen && resetForm()}
        formData={formData}
        previewUrl={previewUrl}
        editingImage={!!editingImage}
        onDescriptionChange={(desc) =>
          setFormData((prev) => ({ ...prev, description: desc }))
        }
        onFileChange={handleFileChange}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Dialog */}
      <GalleryImageDeleteDialog
        open={!!imageToDelete}
        onOpenChange={(open) => !open && setImageToDelete(null)}
        onConfirm={() => handleDelete(imageToDelete!._id)}
      />
    </>
  );
}
