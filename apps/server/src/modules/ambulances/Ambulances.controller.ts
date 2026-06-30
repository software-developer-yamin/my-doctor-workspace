import { NextFunction, Request, Response } from "express";
import AmbulanceService from "./Ambulances.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const CreateAmbulance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.image = `/uploads/${req.file.filename}`;
    const data = await AmbulanceService.Create(payload);
    return sendResponse(res, data, "Ambulance created successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllAmbulances = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await AmbulanceService.GetAll(req.query as Record<string, unknown>);
    return sendResponse(res, data, "Ambulances fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetAmbulanceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AmbulanceService.GetById(req.params.id as string);
    return sendResponse(res, data, "Ambulance fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const UpdateAmbulance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.image = `/uploads/${req.file.filename}`;
    const data = await AmbulanceService.Update(req.params.id as string, payload);
    return sendResponse(res, data, "Ambulance updated successfully");
  } catch (e) {
    next(e);
  }
};

export const GetAmbulanceFilters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AmbulanceService.GetFilters();
    return sendResponse(res, data, "Ambulance filters fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteAmbulance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AmbulanceService.Delete(req.params.id as string);
    return sendResponse(res, data, "Ambulance deleted successfully");
  } catch (e) {
    next(e);
  }
};
