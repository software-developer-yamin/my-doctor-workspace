import { NextFunction, Request, Response } from "express";
import HospitalService from "./Hospitals.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

const parseJsonField = (payload: any, field: string) => {
  if (typeof payload[field] === 'string') {
    try { payload[field] = JSON.parse(payload[field]); } catch { payload[field] = []; }
  }
};

const parseFilesIntoPayload = (req: Request, payload: any) => {
  const files = req.files as any;
  if (!files) return;
  if (files.logo) payload.logo = `/uploads/${files.logo[0].filename}`;
  if (files.cover_photo) payload.cover_photo = `/uploads/${files.cover_photo[0].filename}`;
  if (files.images) payload.images = files.images.map((f: any) => `/uploads/${f.filename}`);
};

const parseHospitalPayload = (req: Request) => {
  const payload = req.body;
  parseFilesIntoPayload(req, payload);
  parseJsonField(payload, 'specialities');
  parseJsonField(payload, 'services');
  parseJsonField(payload, 'facilities');
  parseJsonField(payload, 'openingHours');
  parseJsonField(payload, 'faqs');
  parseJsonField(payload, 'accreditations');
  if (payload.insurances !== undefined && typeof payload.insurances === 'string') {
    try {
      const parsed = JSON.parse(payload.insurances);
      payload.insurances = Array.isArray(parsed) ? parsed : payload.insurances.split(',').map((s: string) => s.trim()).filter(Boolean);
    } catch {
      payload.insurances = payload.insurances.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }
  if (typeof payload.stats === 'string') {
    try { payload.stats = JSON.parse(payload.stats); } catch { delete payload.stats; }
  }
  if (payload.isEmergencyAvailable !== undefined) {
    payload.isEmergencyAvailable = payload.isEmergencyAvailable === 'true' || payload.isEmergencyAvailable === true;
  }
  if (payload.hasAmbulance !== undefined) {
    payload.hasAmbulance = payload.hasAmbulance === 'true' || payload.hasAmbulance === true;
  }
  if (payload.hasCabinFacility !== undefined) {
    payload.hasCabinFacility = payload.hasCabinFacility === 'true' || payload.hasCabinFacility === true;
  }
  return payload;
};

export const CreateHospital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = parseHospitalPayload(req);
    const data = await HospitalService.Create(payload);
    return sendResponse(res, data, "Hospital created successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const GetAllHospitals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await HospitalService.GetAll(req.query);
    return sendResponse(res, data, "Hospitals fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetHospitalById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await HospitalService.GetById(req.params.id as string);
    return sendResponse(res, data, "Hospital fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const UpdateHospital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = parseHospitalPayload(req);
    if (!payload.password) delete payload.password;
    const data = await HospitalService.Update(req.params.id as string, payload);
    return sendResponse(res, data, "Hospital updated successfully");
  } catch (e) {
    next(e);
  }
};

export const GetHospitalFilters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await HospitalService.GetFilters(req.query);
    return sendResponse(res, data, "Hospital filters fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteHospital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await HospitalService.Delete(req.params.id as string);
    return sendResponse(res, data, "Hospital deleted successfully");
  } catch (e) {
    next(e);
  }
};

export const GetHospitalReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await HospitalService.GetReviews(req.params.id as string, req.query);
    return sendResponse(res, data, "Reviews fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const CreateHospitalReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await HospitalService.CreateReview(req.params.id as string, req.body);
    return sendResponse(res, data, "Review submitted successfully", 201);
  } catch (e) {
    next(e);
  }
};
