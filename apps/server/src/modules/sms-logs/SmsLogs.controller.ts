import { NextFunction, Request, Response } from 'express';
import SmsLogService from './SmsLogs.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { ErrorUtils } from '../../utils/errorResponse.js';
import { sendSMS } from '../../helpers/sms.helper.js';

class SmsLogController {
  static async GetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await SmsLogService.GetAll(
        req.query as Record<string, unknown>,
      );
      return sendResponse(res, data, 'SMS logs fetched successfully', 200, meta);
    } catch (e) {
      next(e);
    }
  }

  static async GetOne(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SmsLogService.GetOne(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, 'SMS log not found');
      return sendResponse(res, data, 'SMS log fetched successfully');
    } catch (e) {
      next(e);
    }
  }

  static async Delete(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SmsLogService.Delete(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, 'SMS log not found');
      return sendResponse(res, null, 'SMS log deleted successfully');
    } catch (e) {
      next(e);
    }
  }

  // Public endpoint — sends the app download link via SMS
  static async SendAppDownloadLink(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { phone } = req.body;
      if (!phone) return ErrorUtils.badRequest(res, 'Phone number is required');

      const cleaned = String(phone).trim();
      if (cleaned.length < 10) {
        return ErrorUtils.badRequest(res, 'Invalid phone number');
      }

      const message =
        'Download My Doctor app — your healthcare companion.\n' +
        'Google Play: https://play.google.com/store/apps/details?id=com.mydoctor.app\n' +
        'App Store: https://apps.apple.com/app/mydoctor';

      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        undefined;
      const userAgent = req.headers['user-agent'] as string | undefined;

      await sendSMS(cleaned, message, {
        category: 'app_download_link',
        ip,
        userAgent,
      });

      return sendResponse(res, null, 'Download link sent successfully');
    } catch (e) {
      next(e);
    }
  }
}

export default SmsLogController;
