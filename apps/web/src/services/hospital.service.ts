import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse, ApiMeta } from "@/types/api.type";
import { BackendHospital, Hospital, HospitalReview } from "@/types/hospital.type";
import { hospitalAdapter, hospitalsAdapter } from "@/adapters/hospital.adapter";

export const hospitalService = {
  /**
   * Fetch all hospitals with robust transformation and pagination support
   */
  getAll: async (params?: Record<string, unknown>): Promise<{ data: Hospital[], meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendHospital[]>>(
      API.ENDPOINTS.HOSPITALS.LIST, 
      { params }
    );
    
    // Validating data before transformation to avoid runtime crashes
    return {
      data: hospitalsAdapter(response.data || []),
      meta: response.meta
    };
  },

  /**
   * Fetch a single hospital detail by slug or ID
   */
  getBySlug: async (slug: string): Promise<Hospital> => {
    const { data: response } = await api.get<ApiResponse<BackendHospital>>(
      API.ENDPOINTS.HOSPITALS.DETAILS(slug)
    );

    if (!response.data) {
      throw new Error(`Hospital with slug ${slug} not found`);
    }

    return hospitalAdapter(response.data);
  },

  /**
   * Fetch approved reviews for a hospital by ID or slug
   */
  getReviews: async (
    hospitalId: string,
    params?: Record<string, unknown>
  ): Promise<{ data: HospitalReview[]; meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<HospitalReview[]>>(
      API.ENDPOINTS.HOSPITALS.REVIEWS(hospitalId),
      { params }
    );
    return { data: response.data || [], meta: response.meta };
  },

  /**
   * Submit a patient review for a hospital
   */
  createReview: async (
    hospitalId: string,
    payload: { patientName: string; rating: number; text: string }
  ): Promise<HospitalReview> => {
    const { data: response } = await api.post<ApiResponse<HospitalReview>>(
      API.ENDPOINTS.HOSPITALS.REVIEWS(hospitalId),
      payload
    );
    return response.data;
  },
};
