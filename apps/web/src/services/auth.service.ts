import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse } from "@/types/api.type";

export interface AuthResponse {
  customer?: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    photo?: string;
    gender?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  doctor?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    photo?: string;
    role?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  // --- Customer/Patient Auth ---
  requestRegistrationOtp: async (phone: string) => {
    const { data: response } = await api.post<ApiResponse<any>>(API.ENDPOINTS.CUSTOMERS.REGISTER_REQUEST_OTP, { phone });
    return response;
  },

  verifyOtpAndRegister: async (payload: { phone: string; otp: string; name: string; password?: string; gender?: string; email?: string }) => {
    const { data: response } = await api.post<ApiResponse<any>>(API.ENDPOINTS.CUSTOMERS.REGISTER_VERIFY_OTP, payload);
    return response;
  },

  customerLogin: async (payload: { phone?: string; email?: string; password: string }) => {
    const { data: response } = await api.post<ApiResponse<AuthResponse>>(API.ENDPOINTS.CUSTOMERS.LOGIN, payload);
    return response;
  },

  requestLoginOtp: async (phone: string) => {
    const { data: response } = await api.post<ApiResponse<any>>(API.ENDPOINTS.CUSTOMERS.LOGIN_REQUEST_OTP, { phone });
    return response;
  },

  verifyLoginOtp: async (payload: { phone: string; otp: string }) => {
    const { data: response } = await api.post<ApiResponse<AuthResponse>>(API.ENDPOINTS.CUSTOMERS.LOGIN_VERIFY_OTP, payload);
    return response;
  },

  customerRefreshToken: async (refreshToken: string) => {
    const { data: response } = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(API.ENDPOINTS.CUSTOMERS.REFRESH_TOKEN, { refreshToken });
    return response;
  },

  customerLogout: async () => {
    const { data: response } = await api.post<ApiResponse<any>>(API.ENDPOINTS.CUSTOMERS.LOGOUT);
    return response;
  },

  getCustomerProfile: async () => {
    const { data: response } = await api.get<ApiResponse<any>>(API.ENDPOINTS.CUSTOMERS.ME);
    return response;
  },

  changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
    const { data: response } = await api.patch<ApiResponse<any>>(API.ENDPOINTS.CUSTOMERS.CHANGE_PASSWORD, payload);
    return response;
  },

  requestPasswordResetOtp: async (phone: string) => {
    const { data: response } = await api.post<ApiResponse<any>>(API.ENDPOINTS.CUSTOMERS.FORGOT_PASSWORD_REQUEST_OTP, { phone });
    return response;
  },

  resetPassword: async (payload: { phone: string; otp: string; newPassword: string }) => {
    const { data: response } = await api.post<ApiResponse<any>>(API.ENDPOINTS.CUSTOMERS.FORGOT_PASSWORD_RESET, payload);
    return response;
  },

  // --- User/Staff Auth ---
  userLogin: async (payload: { email: string; password: string }) => {
    const { data: response } = await api.post<ApiResponse<AuthResponse>>(API.ENDPOINTS.AUTH.LOGIN, payload);
    return response;
  },
  
  doctorLogin: async (payload: { email: string; password: string }) => {
    const { data: response } = await api.post<ApiResponse<AuthResponse>>(API.ENDPOINTS.DOCTORS.LOGIN, payload);
    return response;
  },

  refreshToken: async (token: string) => {
    const { data: response } = await api.post<ApiResponse<{ accessToken: string }>>("/users/refresh-token", { refreshToken: token });
    return response;
  },

  logout: async () => {
    const { data: response } = await api.post<ApiResponse<any>>("/users/logout");
    return response;
  }
};
