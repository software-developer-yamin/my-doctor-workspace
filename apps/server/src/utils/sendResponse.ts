import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponseShape<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: ApiMeta;
}

/**
 * Sends a standardized successful API response.
 * @param res - Express Response object
 * @param data - The payload to send (object, array, etc.)
 * @param message - Optional human-readable message
 * @param statusCode - HTTP status code (default: 200)
 * @param meta - Optional pagination metadata
 */
export const sendResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = StatusCodes.OK,
  meta?: ApiMeta
): Response => {
  const responseBody: ApiResponseShape<T> = {
    success: true,
    data,
  };

  if (message) {
    responseBody.message = message;
  }

  if (meta) {
    responseBody.meta = meta;
  }

  return res.status(statusCode).json(responseBody);
};

/**
 * Helper to calculate pagination metadata.
 */
export const buildMeta = (
  total: number,
  page: number,
  limit: number
): ApiMeta => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

/**
 * Parses and validates pagination query parameters with safe defaults.
 */
export const parsePagination = (
  query: Record<string, unknown>
): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(1000, Math.max(1, parseInt(query.limit as string) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
