/**
 * Standard API Response wrapper used across the application
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: ApiMeta;
}

/**
 * Pagination and metadata structure
 */
export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Generic Error Response
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
