import { NextFunction, Request, Response } from 'express';
import AppointmentService from './Appointments.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { ErrorUtils } from '../../utils/errorResponse.js';

class AppointmentController {
  static async Create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AppointmentService.Create(req.body);
      return sendResponse(res, data, 'Appointment created successfully', 201);
    } catch (e) { next(e); }
  }

  static async GetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await AppointmentService.GetAll(req.query as Record<string, unknown>);
      return sendResponse(res, data, 'Appointments fetched successfully', 200, meta);
    } catch (e) { next(e); }
  }

  static async GetByCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await AppointmentService.GetByCustomer(req.params.customerId as string, req.query as Record<string, unknown>);
      return sendResponse(res, data, 'Appointments fetched successfully', 200, meta);
    } catch (e) { next(e); }
  }

  static async GetByDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await AppointmentService.GetByDoctor(req.params.doctorId as string, req.query as Record<string, unknown>);
      return sendResponse(res, data, 'Appointments fetched successfully', 200, meta);
    } catch (e) { next(e); }
  }

  static async Update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AppointmentService.Update(req.params.id as string, req.body);
      if (!data) return ErrorUtils.notFound(res, 'Appointment not found');
      return sendResponse(res, data, 'Appointment updated successfully');
    } catch (e) { next(e); }
  }

  static async GetById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AppointmentService.GetById(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, 'Appointment not found');
      return sendResponse(res, data, 'Appointment fetched successfully');
    } catch (e) { next(e); }
  }

  static async Delete(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AppointmentService.Delete(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, 'Appointment not found');
      return sendResponse(res, null, 'Appointment cancelled successfully');
    } catch (e) { next(e); }
  }
}

export default AppointmentController;
