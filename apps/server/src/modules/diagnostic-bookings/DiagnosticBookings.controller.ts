import { NextFunction, Request, Response } from "express";
import DiagnosticBookingService from "./DiagnosticBookings.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const CreateBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = {
      ...req.body,
      customer: (req as any).payload?.aud
    };
    const data = await DiagnosticBookingService.Create(payload);
    return sendResponse(res, data, "Diagnostic test booking submitted successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await DiagnosticBookingService.GetAll(req.query as Record<string, unknown>);
    return sendResponse(res, data, "Diagnostic bookings fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = (req as any).payload?.aud;
    const { data, meta } = await DiagnosticBookingService.GetAll({ ...req.query, customer: customerId });
    return sendResponse(res, data, "Your diagnostic bookings fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DiagnosticBookingService.GetById(req.params.id as string);
    return sendResponse(res, data, "Booking fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const UpdateBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DiagnosticBookingService.Update(req.params.id as string, req.body);
    return sendResponse(res, data, "Booking updated successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DiagnosticBookingService.Delete(req.params.id as string);
    return sendResponse(res, data, "Booking deleted successfully");
  } catch (e) {
    next(e);
  }
};
