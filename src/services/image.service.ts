import axiosInstance from "@/utils/axiosInstance";

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface TUploadImageResponse {
    _id: string;   // or "id" if your API returns it differently
    url: string;
}

// Upload image
export const uploadImageApi = async (
    file: File
): Promise<ApiResponse<TUploadImageResponse>> => {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await axiosInstance.post<ApiResponse<TUploadImageResponse>>(
        "/admin/image/uploadImage",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};
