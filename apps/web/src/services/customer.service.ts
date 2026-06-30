import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";

export interface UpdateCustomerPayload {
  name?: string;
  email?: string;
  photo?: File | string;
  gender?: string;
  dob?: string;
  bloodGroup?: string;
  nid?: string;
  passport?: string;
  isBloodDonor?: boolean;
  address?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const toFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "boolean") {
      formData.append(key, String(value));
    } else {
      formData.append(key, value as any);
    }
  });
  return formData;
};

export const customerService = {
  getMe: async () => {
    const { data: response } = await api.get<ApiResponse<any>>("/customers/me");
    return response;
  },

  getById: async (id: string) => {
    const { data: response } = await api.get<ApiResponse<any>>(`/customers/${id}`);
    return response;
  },

  updateMe: async (payload: UpdateCustomerPayload) => {
    const hasFile = payload.photo instanceof File;
    const body: any = hasFile ? toFormData(payload) : payload;
    const { data: response } = await api.patch<ApiResponse<any>>(
      "/customers/me",
      body,
      {
        headers: hasFile ? { "Content-Type": "multipart/form-data" } : undefined,
      },
    );
    return response;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const { data: response } = await api.patch<ApiResponse<any>>(
      "/customers/me/password",
      payload,
    );
    return response;
  },

  /**
   * @deprecated Use updateMe() instead. Kept for backward compatibility.
   */
  update: async (id: string, payload: UpdateCustomerPayload) => {
    const hasFile = payload.photo instanceof File;
    const body: any = hasFile ? toFormData(payload) : payload;
    const { data: response } = await api.patch<ApiResponse<any>>(
      `/customers/${id}`,
      body,
      {
        headers: hasFile ? { "Content-Type": "multipart/form-data" } : undefined,
      },
    );
    return response;
  },
};
