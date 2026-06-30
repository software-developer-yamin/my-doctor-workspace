import { NextFunction, Response } from 'express';
import PrescriptionService from './Prescriptions.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { AuthRequest } from '../../middlewares/shared/jwt_helper.js';

class PrescriptionController {
  static async Create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const doctorId = req.payload?.aud as string;
      const files = (req.files as Express.Multer.File[]) ?? [];
      const newAttachments = files.map(f => ({ url: `/uploads/${f.filename}`, name: f.originalname, type: f.mimetype }));
      const medicines = req.body.medicines ? JSON.parse(req.body.medicines) : undefined;
      const data = await PrescriptionService.Create({
        ...req.body,
        ...(medicines !== undefined && { medicines }),
        doctor: doctorId,
        attachments: newAttachments,
      });
      return sendResponse(res, data, 'Prescription created successfully', 201);
    } catch (e) { next(e); }
  }

  static async GetByAppointment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await PrescriptionService.GetByAppointment(req.params.appointmentId as string);
      return sendResponse(res, data, 'Prescription fetched successfully');
    } catch (e) { next(e); }
  }

  static async GetMyPrescriptions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const patientId = req.payload?.aud as string;
      const { data, meta } = await PrescriptionService.GetMyPrescriptions(patientId, req.query as Record<string, unknown>);
      return sendResponse(res, data, 'Prescriptions fetched successfully', 200, meta);
    } catch (e) { next(e); }
  }

  static async Update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const files = (req.files as Express.Multer.File[]) ?? [];
      const newAttachments = files.map(f => ({ url: `/uploads/${f.filename}`, name: f.originalname, type: f.mimetype }));
      const existingAttachments = req.body.existingAttachments ? JSON.parse(req.body.existingAttachments) : [];
      const medicines = req.body.medicines ? JSON.parse(req.body.medicines) : undefined;
      const { existingAttachments: _, ...rest } = req.body;
      const payload = {
        ...rest,
        ...(medicines !== undefined && { medicines }),
        attachments: [...existingAttachments, ...newAttachments],
      };
      const data = await PrescriptionService.Update(req.params.id as string, payload);
      if (!data) return res.status(404).json({ success: false, message: 'Prescription not found' });
      return sendResponse(res, data, 'Prescription updated successfully');
    } catch (e) { next(e); }
  }
}

export default PrescriptionController;
