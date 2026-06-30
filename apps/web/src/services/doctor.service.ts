import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse, ApiMeta } from "@/types/api.type";
import { BackendDoctor, BackendDoctorReview, Doctor } from "@/types/doctor.type";
import { BackendSpecialty, Specialty } from "@/types/specialty.type";
import { doctorAdapter, doctorsAdapter } from "@/adapters/doctor.adapter";
import { specialtiesAdapter } from "@/adapters/specialty.adapter";

export const doctorService = {
  /**
   * Fetch all doctors with pagination and filters
   */
  getAll: async (params?: Record<string, unknown>): Promise<{ data: Doctor[], meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendDoctor[]>>(
      API.ENDPOINTS.DOCTORS.LIST, 
      { params }
    );
    
    return {
      data: doctorsAdapter(response.data || []),
      meta: response.meta
    };
  },

  /**
   * Fetch a single doctor detail by ID or Slug
   * Note: Replace with proper slug resolution if backend supports slugs for doctors
   */
  getById: async (id: string): Promise<Doctor> => {
    const { data: response } = await api.get<ApiResponse<BackendDoctor>>(
      API.ENDPOINTS.DOCTORS.DETAILS(id)
    );
    
    if (!response.data) throw new Error("Doctor not found");
    
    return doctorAdapter(response.data);
  },

  /**
   * Fetch reviews for a doctor by ID or slug
   */
  getReviews: async (doctorId: string, params?: Record<string, unknown>): Promise<{ data: BackendDoctorReview[], meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendDoctorReview[]>>(
      API.ENDPOINTS.DOCTORS.REVIEWS(doctorId),
      { params }
    );
    return {
      data: response.data || [],
      meta: response.meta,
    };
  },

  /**
   * Fetch related doctors
   */
  getRelated: async (doctorId: string, limit = 4): Promise<{ data: Doctor[] }> => {
    const { data: response } = await api.get<ApiResponse<BackendDoctor[]>>(
      API.ENDPOINTS.DOCTORS.RELATED(doctorId),
      { params: { limit } }
    );
    return { data: doctorsAdapter(response.data || []) };
  },

  /**
   * Fetch available appointment slots for a doctor on a given date
   */
  getAvailableSlots: async (doctorId: string, scheduleId: string, date: string): Promise<{ slots: string[]; available: number; booked: number; total: number }> => {
    const { data: response } = await api.get(
      API.ENDPOINTS.DOCTORS.AVAILABLE_SLOTS(doctorId),
      { params: { scheduleId, date } }
    );
    return response.data || { slots: [], available: 0, booked: 0, total: 0 };
  },

  /**
   * Fetch all Specializations
   */
  getSpecializations: async (): Promise<{ data: Specialty[], meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendSpecialty[]>>(
      API.ENDPOINTS.DOCTORS.SPECIALIZATIONS
    );
    
    return {
      data: specialtiesAdapter(response.data || []),
      meta: response.meta
    };
  }
};
