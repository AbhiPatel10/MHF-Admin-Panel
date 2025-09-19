import axiosInstance from "@/utils/axiosInstance";

export interface CreateEventPayload {
    name: string;
    category: string;
    date: string; // convert Date → string before sending
    location: string;
    image?: string; // Image ID after upload
    description?: any; // Editor.js JSON
}

export interface EventResponse {
    _id: string;
    name: string;
    category: string;
    date: string;
    location: string;
    image?: { _id: string; url: string };
    description?: any;
    isActive: boolean;
    isDelete: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// ✅ Create
export const createEventApi = async (
    payload: CreateEventPayload
): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post<ApiResponse<null>>(
        "/admin/event/createEvent",
        payload
    );
    return data;
};

// ✅ Get by ID
export const getEventByIdApi = async (
    id: string
): Promise<ApiResponse<EventResponse>> => {
    const { data } = await axiosInstance.get<ApiResponse<EventResponse>>(
        `/admin/event/getEventDetails/${id}`
    );
    return data;
};

// ✅ Update
export const updateEventApi = async (
    id: string,
    payload: Partial<CreateEventPayload>
): Promise<ApiResponse<EventResponse>> => {
    const { data } = await axiosInstance.put<ApiResponse<EventResponse>>(
        `/admin/event/updateEvent/${id}`,
        payload
    );
    return data;
};

export const getAllEventsApi = async (): Promise<ApiResponse<any[]>> => {
    const { data } = await axiosInstance.get<ApiResponse<any[]>>(
        "/admin/event/getAllEvents"
    );
    return data;
};

export const deleteEventApi = async (id: string): Promise<{ status: number; message: string; data: any }> => {
    const { data } = await axiosInstance.delete(`/admin/event/deleteEvent/${id}`);
    return data;
};