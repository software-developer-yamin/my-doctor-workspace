import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse } from "@/types/api.type";

export interface BackendPrescription {
  _id: string;
  doctor: {
    _id: string;
    name: string;
    photo?: string;
    BMDC_REG_NO?: string;
  };
  appointment: {
    _id: string;
    appointmentDate: string;
    consultationType: string;
    hospital?: {
      _id: string;
      name: string;
      address?: string;
      logo?: string;
    };
  };
  patient: string;
  diagnosis?: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }>;
  instructions?: string;
  followUpDate?: string;
  attachments: Array<{ url: string; name: string; type: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface MyPrescriptionsParams {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: "newest" | "oldest";
}

export const medicalRecordsService = {
  getMyPrescriptions: async (params?: MyPrescriptionsParams) => {
    const { data: response } = await api.get<ApiResponse<BackendPrescription[]>>(
      API.ENDPOINTS.PRESCRIPTIONS.MY_PRESCRIPTIONS,
      { params },
    );
    return response;
  },
};
