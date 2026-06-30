import express from 'express';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import * as HomeDoctorBookingController from './HomeDoctorBookings.controller.js';

const router: express.Router = express.Router();

// Customer facing routes
router.post('/', verifyAccessToken, HomeDoctorBookingController.CreateBooking);
router.get('/customer', verifyAccessToken, HomeDoctorBookingController.GetCustomerBookings);

// Admin/Doctor facing routes
router.get('/', verifyAccessToken, HomeDoctorBookingController.GetAllBookings);
router.get('/doctor/:doctorId', verifyAccessToken, HomeDoctorBookingController.GetDoctorBookings);
router.put('/:id/status', verifyAccessToken, HomeDoctorBookingController.UpdateStatus);

export default router;
