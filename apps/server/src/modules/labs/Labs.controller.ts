import { NextFunction, Request, Response } from "express";
import LabService from "./Labs.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

const parseLabPayload = (req: Request) => {
  const { lat, lon, tests, ...rest } = req.body;
  const files = req.files as any;

  const payload: any = { ...rest };

  if (files?.logo) payload.logo = `/uploads/${files.logo[0].filename}`;
  if (files?.cover_photo) payload.cover_photo = `/uploads/${files.cover_photo[0].filename}`;

  if (lat !== undefined || lon !== undefined) {
    payload.location = {
      type: "Point",
      coordinates: [parseFloat(lon || 0), parseFloat(lat || 0)],
    };
  }

  if (payload.isOpen24_7 !== undefined) {
    payload.isOpen24_7 = payload.isOpen24_7 === 'true' || payload.isOpen24_7 === true;
  }

  if (typeof payload.rating === 'string') {
    payload.rating = parseFloat(payload.rating) || 0;
  }

  if (typeof payload.totalReviews === 'string') {
    payload.totalReviews = parseInt(payload.totalReviews, 10) || 0;
  }

  return { payload, tests };
};

export const CreateLab = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payload, tests } = parseLabPayload(req);
    const data = await LabService.Create(payload);

    if (tests) {
      try {
        const parsedTests = JSON.parse(tests);
        await LabService.SyncTests(data._id.toString(), parsedTests);
      } catch { /* invalid JSON — skip test sync */ }
    }

    return sendResponse(res, data, "Lab created successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllLabs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await LabService.GetAll(req.query as Record<string, unknown>);
    return sendResponse(res, data, "Labs fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetLabById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await LabService.GetById(req.params.id as string);
    return sendResponse(res, data, "Lab fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const GetLabFilters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await LabService.GetFilters();
    return sendResponse(res, data, "Lab filters fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const UpdateLab = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payload, tests } = parseLabPayload(req);

    // Only clear file fields if no new file was uploaded
    if (!payload.logo) delete payload.logo;
    if (!payload.cover_photo) delete payload.cover_photo;

    const data = await LabService.Update(req.params.id as string, payload);

    if (tests) {
      try {
        const parsedTests = JSON.parse(tests);
        await LabService.SyncTests(req.params.id.toString(), parsedTests);
      } catch { /* invalid JSON — skip test sync */ }
    }

    return sendResponse(res, data, "Lab updated successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteLab = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await LabService.Delete(req.params.id as string);
    return sendResponse(res, data, "Lab deleted successfully");
  } catch (e) {
    next(e);
  }
};
