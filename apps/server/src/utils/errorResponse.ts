import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "./logger.js";

export interface ErrorResponseData {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export const errorResponse = (
  res: Response,
  status: number,
  message: string,
  code?: string,
  details?: unknown
): Response => {
  const errorData: ErrorResponseData = { status, message };

  if (code) errorData.code = code;
  if (details) errorData.details = details;

  logger.error(
    `Error ${status} [${code ?? "UNKNOWN"}]: ${message}${details ? " - " + JSON.stringify(details) : ""}`
  );

  return res.status(status).json({
    success: false,
    error: errorData,
  });
};

export const ErrorTypes = {
  BAD_REQUEST:       { status: StatusCodes.BAD_REQUEST,            message: "Bad request",            code: "BAD_REQUEST" },
  UNAUTHORIZED:      { status: StatusCodes.UNAUTHORIZED,           message: "Unauthorized access",    code: "UNAUTHORIZED" },
  FORBIDDEN:         { status: StatusCodes.FORBIDDEN,              message: "Forbidden access",       code: "FORBIDDEN" },
  NOT_FOUND:         { status: StatusCodes.NOT_FOUND,              message: "Resource not found",     code: "NOT_FOUND" },
  VALIDATION_ERROR:  { status: StatusCodes.UNPROCESSABLE_ENTITY,  message: "Validation error",       code: "VALIDATION_ERROR" },
  INTERNAL_SERVER:   { status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Internal server error",  code: "INTERNAL_SERVER_ERROR" },
  OTP_EXPIRED:       { status: StatusCodes.BAD_REQUEST,           message: "OTP has expired",        code: "OTP_EXPIRED" },
  OTP_INVALID:       { status: StatusCodes.BAD_REQUEST,           message: "Invalid OTP",            code: "OTP_INVALID" },
  TOKEN_EXPIRED:     { status: StatusCodes.UNAUTHORIZED,          message: "Token has expired",      code: "TOKEN_EXPIRED" },
  TOKEN_INVALID:     { status: StatusCodes.UNAUTHORIZED,          message: "Invalid token",          code: "TOKEN_INVALID" },
  DUPLICATE_ENTRY:   { status: StatusCodes.CONFLICT,              message: "Resource already exists", code: "DUPLICATE_ENTRY" },
};

export const ErrorUtils = {
  badRequest: (res: Response, message = ErrorTypes.BAD_REQUEST.message, code = ErrorTypes.BAD_REQUEST.code, details?: unknown) =>
    errorResponse(res, ErrorTypes.BAD_REQUEST.status, message, code, details),

  unauthorized: (res: Response, message = ErrorTypes.UNAUTHORIZED.message, code = ErrorTypes.UNAUTHORIZED.code, details?: unknown) =>
    errorResponse(res, ErrorTypes.UNAUTHORIZED.status, message, code, details),

  forbidden: (res: Response, message = ErrorTypes.FORBIDDEN.message, code = ErrorTypes.FORBIDDEN.code, details?: unknown) =>
    errorResponse(res, ErrorTypes.FORBIDDEN.status, message, code, details),

  notFound: (res: Response, message = ErrorTypes.NOT_FOUND.message, code = ErrorTypes.NOT_FOUND.code, details?: unknown) =>
    errorResponse(res, ErrorTypes.NOT_FOUND.status, message, code, details),

  validationError: (res: Response, message = ErrorTypes.VALIDATION_ERROR.message, code = ErrorTypes.VALIDATION_ERROR.code, details?: unknown) =>
    errorResponse(res, ErrorTypes.VALIDATION_ERROR.status, message, code, details),

  internal: (res: Response, message = ErrorTypes.INTERNAL_SERVER.message, code = ErrorTypes.INTERNAL_SERVER.code, details?: unknown) =>
    errorResponse(res, ErrorTypes.INTERNAL_SERVER.status, message, code, details),

  otpExpired: (res: Response) =>
    errorResponse(res, ErrorTypes.OTP_EXPIRED.status, ErrorTypes.OTP_EXPIRED.message, ErrorTypes.OTP_EXPIRED.code),

  otpInvalid: (res: Response) =>
    errorResponse(res, ErrorTypes.OTP_INVALID.status, ErrorTypes.OTP_INVALID.message, ErrorTypes.OTP_INVALID.code),

  tokenExpired: (res: Response) =>
    errorResponse(res, ErrorTypes.TOKEN_EXPIRED.status, ErrorTypes.TOKEN_EXPIRED.message, ErrorTypes.TOKEN_EXPIRED.code),
};
