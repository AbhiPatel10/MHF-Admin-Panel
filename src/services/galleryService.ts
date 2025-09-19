import axiosInstance from "@/utils/axiosInstance";
import { GalleryImage } from "@/lib/types";

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// Add image to gallery
export const addImageToGalleryApi = async (
    payload: { image: string; altText?: string; imageDescription: string }
): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post<ApiResponse<null>>(
        "/admin/gallery/addImageToGallery",
        payload
    );
    return data;
};

// Get all gallery images with pagination
export const getAllGalleryImagesApi = async (
    offset: number = 0,
    limit: number = 10
): Promise<ApiResponse<{ images: GalleryImage[]; totalCount: number }>> => {
    const { data } = await axiosInstance.get<
        ApiResponse<{ images: GalleryImage[]; totalCount: number }>
    >("/admin/gallery/getGalleryImages", {
        params: { offset, limit },
    });
    return data;
};

// Update gallery image
export const updateGalleryImageApi = async (
    id: string,
    payload: { image?: string; altText: string; imageDescription: string }
): Promise<ApiResponse<GalleryImage>> => {
    const { data } = await axiosInstance.patch<ApiResponse<GalleryImage>>(
        `/admin/gallery/updateGallery/${id}`,
        payload
    );
    return data;
};

// Delete gallery image
export const deleteGalleryImageApi = async (
    id: string
): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/gallery/deleteImageFromGallery/${id}`
    );
    return data;
};
