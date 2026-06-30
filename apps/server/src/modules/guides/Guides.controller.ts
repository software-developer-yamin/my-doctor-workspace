import { NextFunction, Request, Response } from 'express';
import GuideService from './Guides.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

export const CreateGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    if ((req as any).file) {
      payload.photo = `/uploads/${(req as any).file.filename}`;
    }
    const data = await GuideService.Create(payload);
    return sendResponse(res, data, 'Guide created successfully', 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllGuides = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await GuideService.GetAll(req.query as Record<string, unknown>);
    return sendResponse(res, data, 'Guides fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetGuideById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await GuideService.GetById(req.params.id as string);
    return sendResponse(res, data, 'Guide fetched successfully');
  } catch (e) {
    next(e);
  }
};

export const GetGuideFilters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await GuideService.GetFilters();
    return sendResponse(res, data, 'Guide filters fetched successfully');
  } catch (e) {
    next(e);
  }
};

export const UpdateGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    if ((req as any).file) {
      payload.photo = `/uploads/${(req as any).file.filename}`;
    }
    const data = await GuideService.Update(req.params.id as string, payload);
    return sendResponse(res, data, 'Guide updated successfully');
  } catch (e) {
    next(e);
  }
};

export const DeleteGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await GuideService.Delete(req.params.id as string);
    return sendResponse(res, data, 'Guide deleted successfully');
  } catch (e) {
    next(e);
  }
};
