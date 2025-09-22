import axiosInstance from "@/utils/axiosInstance";
import { TCreateVolunteerPayload, TGetAllVolunteers } from "@/utils/types/volunteers.types";

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// Create volunteer
export const createVolunteerApi = async (
    payload: TCreateVolunteerPayload
): Promise<ApiResponse<TGetAllVolunteers>> => {
    const { data } = await axiosInstance.post<ApiResponse<TGetAllVolunteers>>(
        "/admin/volunteer/createVolunteer",
        payload
    );
    return data;
};

// Get volunteers with pagination
export const getVolunteersApi = async (
    offset: number = 0,
    limit: number = 0,
    search: string = ""
): Promise<ApiResponse<{ volunteers: TGetAllVolunteers[]; totalCount: number }>> => {
    const { data } = await axiosInstance.get<
        ApiResponse<{ volunteers: TGetAllVolunteers[]; totalCount: number }>
    >("/admin/volunteer/getAllVolunteers", {
        params: { offset, limit, search },
    });
    return data;
};

// Delete volunteer
export const deleteVolunteerApi = async (
    volunteerId: string
): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/volunteer/deleteVolunteer/${volunteerId}`
    );
    return data;
};


// Get single volunteer details
export const getVolunteerByIdApi = async (
    volunteerId: string
): Promise<ApiResponse<TGetAllVolunteers>> => {
    const { data } = await axiosInstance.get<ApiResponse<TGetAllVolunteers>>(
        `/admin/volunteer/getVolunteerDetails/${volunteerId}`
    );
    return data;
};

// Update volunteer
export const updateVolunteerApi = async (
    volunteerId: string,
    payload: TCreateVolunteerPayload
): Promise<ApiResponse<TGetAllVolunteers>> => {
    const { data } = await axiosInstance.put<ApiResponse<TGetAllVolunteers>>(
        `/admin/volunteer/updateVolunteer/${volunteerId}`,
        payload
    );
    return data;
};