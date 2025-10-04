import axiosInstance from "@/utils/axiosInstance";
import { TCreateTeamMemberPayload, TGetAllTeamMembers } from "@/utils/types/teamMemberTypes";

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// Create team member
export const createTeamMemberApi = async (
    payload: TCreateTeamMemberPayload
): Promise<ApiResponse<TGetAllTeamMembers>> => {
    const { data } = await axiosInstance.post<ApiResponse<TGetAllTeamMembers>>(
        "/admin/team/createTeamMember",
        payload
    );
    return data;
};

// Get all team members with pagination & search
export const getAllTeamMembersApi = async (
    offset: number = 0,
    limit: number = 0,
    search: string = "",
    memberType: string = ""
): Promise<ApiResponse<{ teamMembers: TGetAllTeamMembers[]; totalCount: number }>> => {
    const { data } = await axiosInstance.get<
        ApiResponse<{ teamMembers: TGetAllTeamMembers[]; totalCount: number }>
    >("/admin/team/getAllTeamMembers", {
        params: { offset, limit, search, memberType },
    });
    return data;
};

// Delete team member
export const deleteTeamMemberApi = async (
    teamMemberId: string
): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/team/deleteTeamMember/${teamMemberId}`
    );
    return data;
};

// Get single team member details
export const getTeamMemberByIdApi = async (
    teamMemberId: string
): Promise<ApiResponse<TGetAllTeamMembers>> => {
    const { data } = await axiosInstance.get<ApiResponse<TGetAllTeamMembers>>(
        `/admin/team/getTeamMemberDetails/${teamMemberId}`
    );
    return data;
};

// Update team member
export const updateTeamMemberApi = async (
    teamMemberId: string,
    payload: TCreateTeamMemberPayload
): Promise<ApiResponse<TGetAllTeamMembers>> => {
    const { data } = await axiosInstance.put<ApiResponse<TGetAllTeamMembers>>(
        `/admin/team/updateTeamMember/${teamMemberId}`,
        payload
    );
    return data;
};
