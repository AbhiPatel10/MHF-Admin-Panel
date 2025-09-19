"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";

interface GalleryImageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: { description: string; file: File | null };
  previewUrl: string | null;
  editingImage: boolean;
  onDescriptionChange: (desc: string) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>; // make async for API calls
}

export function GalleryImageFormDialog({
  open,
  onOpenChange,
  formData,
  previewUrl,
  editingImage,
  onDescriptionChange,
  onFileChange,
  onSubmit,
}: GalleryImageFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await onSubmit(); // wait for API call
      onOpenChange(false); // close dialog on success
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingImage ? "Edit Image" : "Add New Image"}
          </DialogTitle>
          <DialogDescription>
            {editingImage
              ? "Update the image or its description."
              : "Upload an image to your gallery."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
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
            <Input
              id="image-file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editingImage ? "Saving..." : "Adding..."}
              </>
            ) : (
              <>{editingImage ? "Save Changes" : "Add to Gallery"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
