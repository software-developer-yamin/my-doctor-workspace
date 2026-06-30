import { NextFunction, Request, Response } from 'express';
import ContactMessageService from './ContactMessages.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { ErrorUtils } from '../../utils/errorResponse.js';

class ContactMessageController {
  // Public — submit a new contact message
  static async Create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phone, subject, message } = req.body;
      if (!name || !phone || !subject || !message) {
        return ErrorUtils.badRequest(
          res,
          'Name, phone, subject and message are required',
        );
      }
      if (String(phone).trim().length < 10) {
        return ErrorUtils.badRequest(res, 'Please enter a valid phone number');
      }
      if (String(message).trim().length < 5) {
        return ErrorUtils.badRequest(
          res,
          'Message must be at least 5 characters',
        );
      }

      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        undefined;
      const userAgent = req.headers['user-agent'] as string | undefined;

      const data = await ContactMessageService.Create({
        name: String(name).trim(),
        phone: String(phone).trim(),
        subject: String(subject).trim(),
        message: String(message).trim(),
        ip,
        userAgent,
      });
      return sendResponse(res, data, 'Message submitted successfully', 201);
    } catch (e) {
      next(e);
    }
  }

  // Admin — list / detail / update / delete
  static async GetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await ContactMessageService.GetAll(
        req.query as Record<string, unknown>,
      );
      return sendResponse(
        res,
        data,
        'Contact messages fetched successfully',
        200,
        meta,
      );
    } catch (e) {
      next(e);
    }
  }

  static async GetOne(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ContactMessageService.GetOne(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, 'Contact message not found');
      return sendResponse(res, data, 'Contact message fetched successfully');
    } catch (e) {
      next(e);
    }
  }

  static async UpdateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      if (!status) {
        return ErrorUtils.badRequest(res, 'Status is required');
      }
      const data = await ContactMessageService.UpdateStatus(
        req.params.id as string,
        status,
      );
      if (!data) return ErrorUtils.notFound(res, 'Contact message not found');
      return sendResponse(res, data, 'Status updated successfully');
    } catch (e) {
      next(e);
    }
  }

  static async Delete(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ContactMessageService.Delete(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, 'Contact message not found');
      return sendResponse(res, null, 'Contact message deleted successfully');
    } catch (e) {
      next(e);
    }
  }
}

export default ContactMessageController;
