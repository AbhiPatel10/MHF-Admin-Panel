// services/authService.ts
import axiosInstance from "@/utils/axiosInstance";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        access_token: string;
        refreshToken?: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }
}

export const loginApi = async (
    payload: LoginPayload
): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>("/admin/login", payload);
    return data;
};
