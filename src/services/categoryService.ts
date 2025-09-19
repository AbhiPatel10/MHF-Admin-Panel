import axiosInstance from "@/utils/axiosInstance";
import { Category } from "@/lib/types";

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// Create category
export const createCategoryApi = async (
    payload: { name: string }
): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.post<ApiResponse<Category>>(
        "/admin/category/createCategory",
        payload
    );
    return data;
};

// Get all categories with pagination + search
export const getAllCategoriesApi = async (
    offset: number = 0,
    limit: number = 10,
    search: string = ""
): Promise<ApiResponse<{ categories: Category[]; totalCount: number }>> => {
    const { data } = await axiosInstance.get<
        ApiResponse<{ categories: Category[]; totalCount: number }>
    >("/admin/category/getAllCategories", {
        params: { offset, limit, search },
    });
    return data;
};

// Get all active categories
export const getAllActiveCategoriesApi = async (
    search: string = ""
): Promise<ApiResponse<{ categories: Category[]; totalCount: number }>> => {
    const { data } = await axiosInstance.get<
        ApiResponse<{ categories: Category[]; totalCount: number }>
    >("/admin/category/getAllActiveCategories", {
        params: { search },
    });
    return data;
};

// Get category details by ID
export const getCategoryByIdApi = async (
    categoryId: string
): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.get<ApiResponse<Category>>(
        `/admin/category/getCategoryDetails/${categoryId}`
    );
    return data;
};

// Update category
export const updateCategoryApi = async (
    categoryId: string,
    payload: { name: string }
): Promise<ApiResponse<Category>> => {
    const { data } = await axiosInstance.put<ApiResponse<Category>>(
        `/admin/category/updateCategory/${categoryId}`,
        payload
    );
    return data;
};

// Soft delete category
export const deleteCategoryApi = async (
    categoryId: string
): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/category/deleteCategory/${categoryId}`
    );
    return data;
};
