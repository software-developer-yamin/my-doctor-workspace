import { useAuthStore } from '@/stores/auth-store';
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const SERVER_URL = API_BASE_URL && API_BASE_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to unwrap the standardized data structure
api.interceptors.response.use(
  (response) => {
    // If the backend returned a standardized response with success: true
    // we unwrap the 'data' property so components receive the actual payload directly
    if (response.data && response.data.success === true && Object.prototype.hasOwnProperty.call(response.data, 'data')) {
      // We keep meta if it exists, attaching it to the data array/object if possible
      // but primarily we want res.data to be the actual content
      const unwrappedData = response.data.data;
      
      // If there's metadata, we can attach it to the data object if it's an array/object
      if (response.data.meta && typeof unwrappedData === 'object' && unwrappedData !== null) {
        (unwrappedData as any)._meta = response.data.meta;
      }
      
      response.data = unwrappedData;
    }
    return response;
  },
  (error) => {
    // Handle unauthorized or other global errors here if needed
    if (error.response?.status === 401) {
      // Optional: Clear auth store or redirect to login
    }
    return Promise.reject(error);
  }
);

export default api
