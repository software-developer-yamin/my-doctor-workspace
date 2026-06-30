import { NextFunction, Request, Response } from "express";
import AmbulanceBookingService from "./AmbulanceBookings.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const CreateBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // customer_id from JWT payload (aud is usually used for userId in this project)
    const payload = {
      ...req.body,
      customer: (req as any).payload?.aud
    };
    const data = await AmbulanceBookingService.Create(payload);
    return sendResponse(res, data, "Booking request submitted successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await AmbulanceBookingService.GetAll(req.query as Record<string, unknown>);
    return sendResponse(res, data, "Bookings fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = (req as any).payload?.aud;
    const { data, meta } = await AmbulanceBookingService.GetAll({ ...req.query, customer: customerId });
    return sendResponse(res, data, "Your bookings fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const UpdateBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AmbulanceBookingService.Update(req.params.id as string, req.body);
    return sendResponse(res, data, "Booking updated successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AmbulanceBookingService.Delete(req.params.id as string);
    return sendResponse(res, data, "Booking deleted successfully");
  } catch (e) {
    next(e);
  }
};
