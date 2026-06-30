import { NextFunction, Request, Response } from "express";
import DoctorService from "./Doctors.service.js";
import DoctorReviewService from "../doctor-reviews/DoctorReviews.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AuthRequest } from "../../middlewares/shared/jwt_helper.js";
import { parseJsonArrayFields } from "../../helpers/parseJsonFields.helper.js";

export const CreateDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    if (req.file) payload.photo = `/uploads/${req.file.filename}`;
    try { parseJsonArrayFields(payload); } catch (e) { return next(e); }
    const data = await DoctorService.Create(payload);
    return sendResponse(res, data, "Doctor created successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorService.Login(req.body);
    return sendResponse(res, data, "Login successful");
  } catch (e) {
    next(e);
  }
};

export const GetAllDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await DoctorService.GetAll(req.query);
    return sendResponse(res, data, "Doctors fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const GetDoctorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorService.GetById(req.params.id as string);
    return sendResponse(res, data, "Doctor fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const GetMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.payload?.aud as string;
    const data = await DoctorService.GetById(doctorId);
    return sendResponse(res, data, "Doctor profile fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const GetDoctorHospitals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorService.GetDoctorHospitals(req.params.id as string);
    return sendResponse(res, data, "Doctor hospitals fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const GetDoctorAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorService.GetAvailableSlots(req.params.id as string, req.query);
    return sendResponse(res, data, "Available slots fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const GetRelatedDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 4;
    const data = await DoctorService.GetRelated(req.params.id as string, limit);
    return sendResponse(res, data, "Related doctors fetched successfully");
  } catch (e) {
    next(e);
  }
};

export const GetDoctorReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await DoctorReviewService.GetByDoctor(req.params.id as string, req.query);
    return sendResponse(res, data, "Reviews fetched successfully", 200, meta);
  } catch (e) {
    next(e);
  }
};

export const CreateDoctorReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorReviewService.Create(req.params.id as string, req.body);
    return sendResponse(res, data, "Review submitted successfully", 201);
  } catch (e) {
    next(e);
  }
};

export const UpdateDoctorReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorReviewService.Update(req.params.reviewId as string, req.body);
    return sendResponse(res, data, "Review updated successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteDoctorReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorReviewService.Delete(req.params.reviewId as string);
    return sendResponse(res, data, "Review deleted successfully");
  } catch (e) {
    next(e);
  }
};

export const UpdateDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    if (req.file) payload.photo = `/uploads/${req.file.filename}`;
    try { parseJsonArrayFields(payload); } catch (e) { return next(e); }
    const data = await DoctorService.Update(req.params.id as string, payload);
    return sendResponse(res, data, "Doctor updated successfully");
  } catch (e) {
    next(e);
  }
};

export const DeleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorService.Delete(req.params.id as string);
    return sendResponse(res, data, "Doctor deleted successfully");
  } catch (e) {
    next(e);
  }
};

export const GetDoctorFilters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorService.GetFilters();
    return sendResponse(res, data, "Doctor filters fetched successfully");
  } catch (e) {
    next(e);
  }
};
