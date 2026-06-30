import express from 'express';
import AppointmentController from './Appointments.controller.js';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import { validate } from '../../validators/validate.middleware.js';
import { createAppointmentSchema, updateAppointmentSchema } from '../../validators/appointment.validator.js';

const router: express.Router = express.Router();

// All appointment routes require authentication
router.post('/', verifyAccessToken, validate(createAppointmentSchema), AppointmentController.Create);
router.get('/', verifyAccessToken, AppointmentController.GetAll);
router.get('/customer/:customerId', verifyAccessToken, AppointmentController.GetByCustomer);
router.get('/doctor/:doctorId', verifyAccessToken, AppointmentController.GetByDoctor);
router.get('/:id', verifyAccessToken, AppointmentController.GetById);
router.patch('/:id', verifyAccessToken, validate(updateAppointmentSchema), AppointmentController.Update);
router.delete('/:id', verifyAccessToken, AppointmentController.Delete);

export default router;
