import { Request, Response, NextFunction } from 'express';
import DoctorLiveQueueService from './DoctorLiveQueues.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { ErrorUtils } from '../../utils/errorResponse.js';

export const SetupLiveQueue = async (req: any, res: Response, next: NextFunction) => {
  try {
    const helperId = req.payload?.aud; // Fetched from JWT verifyAccessToken
    const data = await DoctorLiveQueueService.SetupQueue(req.body, helperId);
    return sendResponse(res, data, 'Live queue initialized successfully', 201);
  } catch (e: any) {
    if (e.message.includes('Helper is not assigned')) {
      return ErrorUtils.forbidden(res, e.message);
    }
    next(e);
  }
};

export const SetupLiveQueueByDoctor = async (req: any, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.payload?.aud;
    const data = await DoctorLiveQueueService.SetupQueueByDoctor(req.body, doctorId);
    return sendResponse(res, data, 'Live queue initialized successfully', 201);
  } catch (e) {
    next(e);
  }
};

export const UpdateCurrentSerial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { current_serial } = req.body;
    const data = await DoctorLiveQueueService.UpdateCurrentSerial(id, current_serial);
    return sendResponse(res, data, 'Current serial updated successfully');
  } catch (e) {
    next(e);
  }
};

export const GetLiveQueueForHospital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hospitalId = req.params.hospitalId as string;
    const data = await DoctorLiveQueueService.GetLiveQueueByHospital(hospitalId);
    return sendResponse(res, data, 'Hospital live queues fetched successfully');
  } catch (e) {
    next(e);
  }
};

export const GetLiveQueueForDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.params.doctorId as string;
    const data = await DoctorLiveQueueService.GetLiveQueueByDoctor(doctorId);
    return sendResponse(res, data, 'Doctor live queue fetched successfully');
  } catch (e) {
    next(e);
  }
};

export const EndLiveQueue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const data = await DoctorLiveQueueService.EndQueue(id);
    return sendResponse(res, data, 'Live queue ended for today');
  } catch (e) {
    next(e);
  }
};

export const GetAllQueues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await DoctorLiveQueueService.GetAllActiveQueues(req.query);
    return sendResponse(res, data, 'All active queues fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};
