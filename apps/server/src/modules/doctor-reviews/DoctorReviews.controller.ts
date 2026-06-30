import { NextFunction, Request, Response } from 'express';
import DoctorReviewService from './DoctorReviews.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

export const GetDoctorReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await DoctorReviewService.GetByDoctor(req.params.id as string, req.query);
    return sendResponse(res, data, 'Reviews fetched successfully', 200, meta);
  } catch (e) {
    next(e);
  }
};

export const CreateDoctorReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorReviewService.Create(req.params.id as string, req.body);
    return sendResponse(res, data, 'Review submitted successfully', 201);
  } catch (e) {
    next(e);
  }
};

export const UpdateDoctorReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorReviewService.Update(req.params.reviewId as string, req.body);
    return sendResponse(res, data, 'Review updated successfully');
  } catch (e) {
    next(e);
  }
};

export const DeleteDoctorReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DoctorReviewService.Delete(req.params.reviewId as string);
    return sendResponse(res, data, 'Review deleted successfully');
  } catch (e) {
    next(e);
  }
};
