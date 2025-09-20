import axiosInstance from "@/utils/axiosInstance";

// Types for Blogs

export interface TBlog {
    _id: string
    title: string
    category: Category
    content: Content
    isDraft: boolean
    isActive: boolean
    isDelete: boolean
    createdAt: string
    updatedAt: string,
    image: image
    __v: number
}

interface image {
    _id: string
    url: string
    publicId: string
    altText: string
    mimeType: string
    createdOn: string
    createdAt: string
    updatedAt: string
    __v: number
}


export interface Category {
    _id: string
    name: string
    isActive: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

export interface Content {
    time: number
    blocks: Block[]
    version: string
}

export interface Block {
    id: string
    type: string
    data: Data
}

export interface Data {
    text: string
    level?: number
}


export interface TCreateBlogPayload {
    title: string;
    category: string;
    image?: string;
    content?: any;
    isDraft?: boolean;
}

export interface TUpdateBlogPayload {
    title: string;
    category: string;
    image?: string;
    content: any;
    isDraft?: boolean;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// ------------------- Blog APIs -------------------

// Create Blog
export const createBlogApi = async (
    payload: TCreateBlogPayload
): Promise<ApiResponse<TBlog>> => {
    const { data } = await axiosInstance.post<ApiResponse<TBlog>>(
        "/admin/blog/createBlog",
        payload
    );
    return data;
};

// Get all Blogs with pagination + search
export const getAllBlogsApi = async (
    offset: number = 0,
    limit: number = 10,
    search: string = ""
): Promise<ApiResponse<{ blogs: TBlog[]; totalCount: number }>> => {
    const { data } = await axiosInstance.get<
        ApiResponse<{ blogs: TBlog[]; totalCount: number }>
    >("/admin/blog/getAllBlogs", {
        params: { offset, limit, search },
    });
    return data;
};

// Get single Blog by ID
export const getBlogByIdApi = async (
    blogId: string
): Promise<ApiResponse<TBlog>> => {
    const { data } = await axiosInstance.get<ApiResponse<TBlog>>(
        `/admin/blog/getBlogDetails/${blogId}`
    );
    return data;
};

// Update Blog
export const updateBlogApi = async (
    blogId: string,
    payload: TCreateBlogPayload
): Promise<ApiResponse<TBlog>> => {
    const { data } = await axiosInstance.put<ApiResponse<TBlog>>(
        `/admin/blog/updateBlog/${blogId}`,
        payload
    );
    return data;
};

// Delete Blog
export const deleteBlogApi = async (
    blogId: string
): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/blog/deleteBlog/${blogId}`
    );
    return data;
};
