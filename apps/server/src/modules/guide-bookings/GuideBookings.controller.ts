import { Request, Response, NextFunction } from 'express';
import GuideBookingService from './GuideBookings.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

export const CreateBooking = async (req: any, res: Response, next: NextFunction) => {
  try {
    const customerId = req.payload?.aud;
    const payload = {
      ...req.body,
      customer: customerId,
    };
    const data = await GuideBookingService.Create(payload);
    return sendResponse(res, data, 'Booking created successfully', 201);
  } catch (e) {
    next(e);
  }
};

export const GetMyBookings = async (req: any, res: Response, next: NextFunction) => {
  try {
    const customerId = req.payload?.aud;
    const { data, meta } = await GuideBookingService.GetByCustomer(customerId, req.query);
    return sendResponse(res, data, 'Your bookings fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await GuideBookingService.GetAll(req.query);
    return sendResponse(res, data, 'All bookings fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};

export const UpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const data = await GuideBookingService.UpdateStatus(id, status);
    return sendResponse(res, data, 'Booking status updated successfully');
  } catch (e) {
    next(e);
  }
};

export const DeleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await GuideBookingService.Delete(id);
    return sendResponse(res, null, 'Booking deleted successfully');
  } catch (e) {
    next(e);
  }
};
