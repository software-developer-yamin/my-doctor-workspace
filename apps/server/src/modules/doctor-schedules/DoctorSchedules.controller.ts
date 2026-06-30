import { NextFunction, Request, Response } from "express";
import DoctorScheduleService from "./DoctorSchedules.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const CreateSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorScheduleService.Create(req.body);
    return sendResponse(res, data, "Doctor schedule created successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllSchedules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hospitalId, doctorId, ...rest } = req.query;
    let result;
    
    if (hospitalId) {
      result = await DoctorScheduleService.GetByHospital(hospitalId as string, rest as Record<string, unknown>);
    } else if (doctorId) {
      result = await DoctorScheduleService.GetByDoctor(doctorId as string, rest as Record<string, unknown>);
    } else {
      result = await DoctorScheduleService.GetAll(req.query as Record<string, unknown>);
    }

    return sendResponse(res, result.data, "Doctor schedules fetched successfully", 200, result.meta);
  } catch (e) {
    next(e);
  }
};

export const GetByDoctorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await DoctorScheduleService.GetByDoctor(req.params.doctorId as string, req.query as Record<string, unknown>);
    return sendResponse(res, data, "Doctor specific schedules fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const UpdateSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorScheduleService.Update(req.params.id as string, req.body);
    return sendResponse(res, data, "Doctor schedule updated successfully");
  } catch (e) {
    next(e);
  }
};

export const GetFilterOptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hospitalId } = req.query;
    if (!hospitalId) return sendResponse(res, null, "hospitalId is required", 400);
    const data = await DoctorScheduleService.GetFilterOptions(hospitalId as string);
    return sendResponse(res, data, "Filter options fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorScheduleService.Delete(req.params.id as string);
    return sendResponse(res, data, "Doctor schedule deleted successfully");
  } catch (e) {
    next(e);
  }
};
