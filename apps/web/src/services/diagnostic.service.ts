import {
  diagnosticTestAdapter,
  diagnosticTestsAdapter,
  labAdapter,
  labsAdapter,
} from "@/adapters/diagnostic.adapter";
import { API } from "@/config/api";
import api from "@/lib/api";
import { ApiMeta, ApiResponse } from "@/types/api.type";
import {
  BackendDiagnosticTest,
  BackendLab,
  DiagnosticBookingPayload,
  DiagnosticTest,
  DiagnosticTestFilters,
  Lab,
  LabFilters,
} from "@/types/diagnostic.type";

export const diagnosticService = {
  getAllTests: async (
    params?: Record<string, unknown>,
  ): Promise<{ data: DiagnosticTest[]; meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendDiagnosticTest[]>>(
      API.ENDPOINTS.DIAGNOSTIC_TESTS.LIST,
      { params },
    );
    return {
      data: diagnosticTestsAdapter(response.data || []),
      meta: response.meta,
    };
  },

  getAllLabs: async (
    params?: Record<string, unknown>,
  ): Promise<{ data: Lab[]; meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendLab[]>>(
      API.ENDPOINTS.LABS.LIST,
      { params },
    );
    return {
      data: labsAdapter(response.data || []),
      meta: response.meta,
    };
  },

  getTestFilters: async (): Promise<DiagnosticTestFilters> => {
    const { data: response } = await api.get<ApiResponse<DiagnosticTestFilters>>(
      API.ENDPOINTS.DIAGNOSTIC_TESTS.FILTERS,
    );
    return response.data ?? { categories: [] };
  },

  getLabFilters: async (): Promise<LabFilters> => {
    const { data: response } = await api.get<ApiResponse<LabFilters>>(
      API.ENDPOINTS.LABS.FILTERS,
    );
    return response.data ?? { types: [] };
  },

  getTestById: async (id: string): Promise<DiagnosticTest> => {
    const { data: response } = await api.get<ApiResponse<BackendDiagnosticTest>>(
      API.ENDPOINTS.DIAGNOSTIC_TESTS.DETAILS(id),
    );
    return diagnosticTestAdapter(response.data);
  },

  getLabById: async (id: string): Promise<Lab> => {
    const { data: response } = await api.get<ApiResponse<BackendLab>>(
      API.ENDPOINTS.LABS.DETAILS(id),
    );
    return labAdapter(response.data);
  },

  bookTest: async (payload: DiagnosticBookingPayload): Promise<void> => {
    await api.post(API.ENDPOINTS.DIAGNOSTIC_TESTS.BOOK, payload);
  },

  getMyBookings: async (): Promise<any[]> => {
    const { data: response } = await api.get<ApiResponse<any[]>>(
      API.ENDPOINTS.DIAGNOSTIC_TESTS.MY_BOOKINGS,
    );
    return response.data || [];
  },

  cancelBooking: async (id: string): Promise<void> => {
    await api.patch(`/diagnostic-bookings/${id}`, { status: "Cancelled" });
  },

  rescheduleBooking: async (id: string, preferred_date_time: string): Promise<void> => {
    await api.patch(`/diagnostic-bookings/${id}`, { preferred_date_time });
  },
};
