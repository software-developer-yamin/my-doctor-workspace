import { ENV } from "./env";

export const API = {
  BASE_URL: ENV.NEXT_PUBLIC_API_URL,
  ASSETS_URL: ENV.NEXT_PUBLIC_ASSETS_URL,
  TIMEOUT: 30000, // 30 seconds
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      ME: "/auth/me",
    },
    CUSTOMERS: {
      LOGIN: "/customers/login",
      LOGIN_REQUEST_OTP: "/customers/login/request-otp",
      LOGIN_VERIFY_OTP: "/customers/login/verify-otp",
      REGISTER_REQUEST_OTP: "/customers/register/request-otp",
      REGISTER_VERIFY_OTP: "/customers/register/verify-otp",
      REFRESH_TOKEN: "/customers/refresh-token",
      LOGOUT: "/customers/logout",
      ME: "/customers/me",
      CHANGE_PASSWORD: "/customers/me/password",
      FORGOT_PASSWORD_REQUEST_OTP: "/customers/forgot-password/request-otp",
      FORGOT_PASSWORD_RESET: "/customers/forgot-password/reset",
    },
    DOCTORS: {
      LOGIN: "/doctors/login",
      ME: "/doctors/me",
      LIST: "/doctors/public",
      LIST_AUTHED: "/doctors",
      DETAILS: (id: string) => `/doctors/${id}`,
      REVIEWS: (id: string) => `/doctors/${id}/reviews`,
      RELATED: (id: string) => `/doctors/${id}/related`,
      AVAILABLE_SLOTS: (id: string) => `/doctors/${id}/available-slots`,
      APPOINTMENTS: (doctorId: string) => `/appointments/doctor/${doctorId}`,
      FILTERS: "/doctors/filters",
      SPECIALIZATIONS: "/specialities",
    },
    PRESCRIPTIONS: {
      CREATE: "/prescriptions",
      BY_APPOINTMENT: (appointmentId: string) => `/prescriptions/appointment/${appointmentId}`,
      UPDATE: (id: string) => `/prescriptions/${id}`,
      MY_PRESCRIPTIONS: "/prescriptions/my",
    },
    HOSPITALS: {
      LIST: "/hospitals/public",
      LIST_AUTHED: "/hospitals",
      DETAILS: (id: string) => `/hospitals/${id}`,
      REVIEWS: (id: string) => `/hospitals/${id}/reviews`,
    },
    AMBULANCES: {
      LIST: "/ambulances/public",
      FILTERS: "/ambulances/filters",
      BOOK: "/ambulance-bookings",
      MY_BOOKINGS: "/ambulance-bookings/my-bookings",
    },
    DIAGNOSTIC_TESTS: {
      LIST: "/diagnostic-tests/public",
      DETAILS: (id: string) => `/diagnostic-tests/public/${id}`,
      FILTERS: "/diagnostic-tests/public/filters",
      BOOK: "/diagnostic-bookings",
      MY_BOOKINGS: "/diagnostic-bookings/my-bookings",
    },
    LABS: {
      LIST: "/labs/public",
      FILTERS: "/labs/public/filters",
      DETAILS: (id: string) => `/labs/public/${id}`,
    },
    APPOINTMENTS: {
      CREATE: "/appointments",
      MY_APPOINTMENTS: "/appointments/my",
    },
    DIAGNOSTICS: {
      TESTS: "/diagnostics/tests",
      BOOK: "/diagnostics/book",
    },
    LIVE_QUEUE: {
      DOCTOR_SETUP: '/doctor-live-queues/doctor-setup',
      GET_FOR_DOCTOR: (doctorId: string) => `/doctor-live-queues/doctor/${doctorId}`,
      UPDATE_SERIAL: (id: string) => `/doctor-live-queues/${id}/current-serial`,
      END_QUEUE: (id: string) => `/doctor-live-queues/${id}/end`,
    },
    DOCTOR_HOSPITALS: (doctorId: string) => `/doctors/${doctorId}/hospitals`,
    TELEMEDICINE: {
      DOCTORS: "/telemedicine/doctors",
    },
    GUIDES: {
      LIST: "/guides/public",
      DETAILS: (id: string) => `/guides/public/${id}`,
      FILTERS: "/guides/public/filters",
      BOOK: "/guide-bookings",
      MY_BOOKINGS: "/guide-bookings/my",
    },
  },
};
