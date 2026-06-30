import { NextFunction, Request, Response } from "express";
import CityService from "./Cities.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const CreateCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CityService.Create(req.body.name);
    return sendResponse(res, data, "City created successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await CityService.GetAll(req.query);
    return sendResponse(res, data, "Cities fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const UpdateCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CityService.Update(req.params.id as string, req.body.name);
    return sendResponse(res, data, "City updated successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CityService.Delete(req.params.id as string);
    return sendResponse(res, data, "City deleted successfully");
  } catch (e) {
    next(e);
  }
};
