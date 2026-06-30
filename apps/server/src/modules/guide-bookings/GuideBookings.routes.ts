import express from 'express';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import * as GuideBookingController from './GuideBookings.controller.js';

const router: express.Router = express.Router();

router.post('/', verifyAccessToken, GuideBookingController.CreateBooking);
router.get('/my', verifyAccessToken, GuideBookingController.GetMyBookings);
router.get('/', verifyAccessToken, GuideBookingController.GetAllBookings);
router.patch('/:id/status', verifyAccessToken, GuideBookingController.UpdateStatus);
router.delete('/:id', verifyAccessToken, GuideBookingController.DeleteBooking);

export default router;
