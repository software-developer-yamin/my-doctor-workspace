import { NextFunction, Request, Response } from 'express';
import BdLocationService from './BdLocations.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

export const CreateBdLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await BdLocationService.Create(String(req.body.district), String(req.body.upazila));
    return sendResponse(res, data, 'Location created successfully', 201);
  } catch (e) { next(e); }
};

export const GetAllBdLocations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await BdLocationService.GetAll(req.query);
    return sendResponse(res, data, 'Locations fetched successfully', 200, meta);
  } catch (e) { next(e); }
};

export const GetGrouped = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await BdLocationService.GetGrouped();
    return sendResponse(res, data, 'Grouped locations fetched successfully');
  } catch (e) { next(e); }
};

export const GetDistricts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await BdLocationService.GetDistricts();
    return sendResponse(res, data, 'Districts fetched successfully');
  } catch (e) { next(e); }
};

export const GetUpazilasByDistrict = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const district = String(req.query.district || req.params.district || '');
    if (!district) return sendResponse(res, [], 'No district specified');
    const data = await BdLocationService.GetUpazilasByDistrict(district);
    return sendResponse(res, data, 'Upazilas fetched successfully');
  } catch (e) { next(e); }
};

export const UpdateBdLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await BdLocationService.Update(String(req.params.id), req.body);
    return sendResponse(res, data, 'Location updated successfully');
  } catch (e) { next(e); }
};

export const DeleteBdLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await BdLocationService.Delete(String(req.params.id));
    return sendResponse(res, data, 'Location deleted successfully');
  } catch (e) { next(e); }
};
