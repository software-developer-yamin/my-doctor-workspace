import { NextFunction, Request, Response } from "express";
import DiagnosticTestService from "./DiagnosticTests.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

const parseTestPayload = (payload: any) => {
  if (typeof payload.price_start_from === 'string') {
    payload.price_start_from = Number(payload.price_start_from);
  }
  if (payload.isHomeSampleCollectionAvailable !== undefined) {
    payload.isHomeSampleCollectionAvailable =
      payload.isHomeSampleCollectionAvailable === 'true' ||
      payload.isHomeSampleCollectionAvailable === true;
  }
  return payload;
};

export const CreateTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = parseTestPayload(req.body);
    if (req.file) payload.image = `/uploads/${req.file.filename}`;
    const data = await DiagnosticTestService.Create(payload);
    return sendResponse(res, data, "Diagnostic test created successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await DiagnosticTestService.GetAll(req.query as Record<string, unknown>);
    return sendResponse(res, data, "Diagnostic tests fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetTestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DiagnosticTestService.GetById(req.params.id as string);
    return sendResponse(res, data, "Diagnostic test fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const UpdateTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = parseTestPayload(req.body);
    if (req.file) payload.image = `/uploads/${req.file.filename}`;
    const data = await DiagnosticTestService.Update(req.params.id as string, payload);
    return sendResponse(res, data, "Diagnostic test updated successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DiagnosticTestService.Delete(req.params.id as string);
    return sendResponse(res, data, "Diagnostic test deleted successfully");
  } catch (e) {
    next(e);
  }
};

export const GetTestFilters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DiagnosticTestService.GetFilters();
    return sendResponse(res, data, "Diagnostic test filters fetched successfully");
  } catch (e) {
    next(e);
  }
};
