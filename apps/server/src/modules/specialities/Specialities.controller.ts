import { NextFunction, Request, Response } from "express";
import SpecialityService from "./Specialities.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const CreateSpeciality = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: any = { name: req.body.name };
    if (req.file) payload.image = `/uploads/${req.file.filename}`;
    const data = await SpecialityService.Create(payload);
    return sendResponse(res, data, "Speciality created successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllSpecialities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await SpecialityService.GetAll(req.query as Record<string, unknown>);
    return sendResponse(res, data, "Specialities fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const UpdateSpeciality = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: any = { name: req.body.name };
    if (req.file) payload.image = `/uploads/${req.file.filename}`;
    const data = await SpecialityService.Update(req.params.id as string, payload);
    return sendResponse(res, data, "Speciality updated successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteSpeciality = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await SpecialityService.Delete(req.params.id as string);
    return sendResponse(res, data, "Speciality deleted successfully");
  } catch (e) {
    next(e);
  }
};
