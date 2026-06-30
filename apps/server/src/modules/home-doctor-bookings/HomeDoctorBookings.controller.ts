import { Request, Response, NextFunction } from 'express';
import HomeDoctorBookingService from './HomeDoctorBookings.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

export const CreateBooking = async (req: any, res: Response, next: NextFunction) => {
  try {
    const customerId = req.payload?.aud;
    const payload = {
      ...req.body,
      customer: customerId
    };
    const data = await HomeDoctorBookingService.Create(payload);
    return sendResponse(res, data, 'Home doctor booking created successfully', 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await HomeDoctorBookingService.GetAll(req.query);
    return sendResponse(res, data, 'All home doctor bookings fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetCustomerBookings = async (req: any, res: Response, next: NextFunction) => {
  try {
    const customerId = req.payload?.aud;
    const { data, meta } = await HomeDoctorBookingService.GetByCustomer(customerId, req.query);
    return sendResponse(res, data, 'Your home doctor bookings fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetDoctorBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.params.doctorId as string;
    const { data, meta } = await HomeDoctorBookingService.GetByDoctor(doctorId, req.query);
    return sendResponse(res, data, 'Doctor home bookings fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};

export const UpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const data = await HomeDoctorBookingService.UpdateStatus(id, status);
    return sendResponse(res, data, 'Booking status updated successfully');
  } catch (e) {
    next(e);
  }
};
