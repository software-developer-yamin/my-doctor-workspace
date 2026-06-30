import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/shared/jwt_helper.js';
import CallbackRequestService from './CallbackRequests.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { ErrorUtils } from '../../utils/errorResponse.js';

class CallbackRequestController {
  // Public — request a callback
  static async Create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, note } = req.body;
      if (!name || !phone) {
        return ErrorUtils.badRequest(res, 'Name and phone are required');
      }
      if (String(phone).trim().length < 10) {
        return ErrorUtils.badRequest(res, 'Please enter a valid phone number');
      }

      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        undefined;
      const userAgent = req.headers['user-agent'] as string | undefined;

      const data = await CallbackRequestService.Create({
        name: String(name).trim(),
        phone: String(phone).trim(),
        note: note ? String(note).trim() : undefined,
        ip,
        userAgent,
      });
      return sendResponse(res, data, 'Callback request submitted successfully', 201);
    } catch (e) {
      next(e);
    }
  }

  // Admin
  static async GetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await CallbackRequestService.GetAll(
        req.query as Record<string, unknown>,
      );
      return sendResponse(res, data, 'Callback requests fetched successfully', 200, meta);
    } catch (e) {
      next(e);
    }
  }

  static async GetOne(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CallbackRequestService.GetOne(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, 'Callback request not found');
      return sendResponse(res, data, 'Callback request fetched successfully');
    } catch (e) {
      next(e);
    }
  }

  static async UpdateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      if (!status) return ErrorUtils.badRequest(res, 'Status is required');
      const handledBy = req.payload?.aud as string | undefined;
      const data = await CallbackRequestService.UpdateStatus(
        req.params.id as string,
        status,
        handledBy,
      );
      if (!data) return ErrorUtils.notFound(res, 'Callback request not found');
      return sendResponse(res, data, 'Status updated successfully');
    } catch (e) {
      next(e);
    }
  }

  static async Delete(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CallbackRequestService.Delete(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, 'Callback request not found');
      return sendResponse(res, null, 'Callback request deleted successfully');
    } catch (e) {
      next(e);
    }
  }
}

export default CallbackRequestController;
