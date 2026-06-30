import { NextFunction, Request, Response } from "express";
import { AnalyticsService } from "./Analytics.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const GetDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.GetDashboardStats();
    return sendResponse(res, data, "Dashboard stats fetched successfully");
  } catch (e) {
    next(e);
  }
};
