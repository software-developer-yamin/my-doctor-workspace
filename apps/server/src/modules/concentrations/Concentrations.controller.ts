import { NextFunction, Request, Response } from "express";
import ConcentrationService from "./Concentrations.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const CreateConcentration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ConcentrationService.Create(req.body);
    return sendResponse(res, data, "Concentration created successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllConcentrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await ConcentrationService.GetAll(req.query);
    return sendResponse(res, data, "Concentrations fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const UpdateConcentration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ConcentrationService.Update(req.params.id as string, req.body);
    return sendResponse(res, data, "Concentration updated successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteConcentration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ConcentrationService.Delete(req.params.id as string);
    return sendResponse(res, data, "Concentration deleted successfully");
  } catch (e) {
    next(e);
  }
};
