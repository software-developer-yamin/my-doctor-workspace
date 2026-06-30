import { Request, Response, NextFunction } from 'express';
import DoctorHomeScheduleService from './DoctorHomeSchedules.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

export const SaveSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorHomeScheduleService.CreateOrUpdate(req.body);
    return sendResponse(res, data, 'Home schedule saved successfully');
  } catch (e) {
    next(e);
  }
};

export const GetAllSchedules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await DoctorHomeScheduleService.GetAll(req.query as Record<string, unknown>);
    return sendResponse(res, data, 'All home schedules fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetScheduleByDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.params.doctorId as string;
    const data = await DoctorHomeScheduleService.GetByDoctor(doctorId);
    return sendResponse(res, data, 'Doctor home schedule fetched successfully');
  } catch (e) {
    next(e);
  }
};

export const DeleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await DoctorHomeScheduleService.Delete(id);
    return sendResponse(res, null, 'Schedule deleted successfully');
  } catch (e) {
    next(e);
  }
};
