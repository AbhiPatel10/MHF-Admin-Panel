import axiosInstance from "@/utils/axiosInstance";

// ------------------- Types -------------------

export interface TContact {
    _id: string;
    name: string;
    email: string;
    phoneNo: string;
    subject: string;
    message: string;
    isContacted: boolean;
    createdAt: string;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

// ------------------- Contact APIs -------------------

// Get all Contacts with pagination + search
export const getAllContactsApi = async (
    offset: number = 0,
    limit: number = 10,
    search: string = "",
    isContacted: boolean = false
): Promise<ApiResponse<{ contacts: TContact[]; totalCount: number }>> => {
    const { data } = await axiosInstance.get<
        ApiResponse<{ contacts: TContact[]; totalCount: number }>
    >("/admin/contact/getAllContacts", {
        params: { offset, limit, search, isContacted },
    });
    return data;
};

// Update contact status (isContacted = true/false)
export const updateContactStatusApi = async (
    contactId: string,
    isContacted: boolean
): Promise<ApiResponse<TContact>> => {
    const { data } = await axiosInstance.put<ApiResponse<TContact>>(
        `/admin/contact/updateStatus/${contactId}`,
        { isContacted }
    );
    return data;
};

// Delete contact
export const deleteContactApi = async (
    contactId: string
): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete<ApiResponse<null>>(
        `/admin/contact/deleteContact/${contactId}`
    );
    return data;
};
