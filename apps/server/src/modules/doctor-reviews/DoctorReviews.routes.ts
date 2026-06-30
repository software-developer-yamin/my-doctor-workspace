import express from 'express';
import { GetDoctorReviews, CreateDoctorReview, UpdateDoctorReview, DeleteDoctorReview } from './DoctorReviews.controller.js';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';

const router: express.Router = express.Router();

// Public — anyone can read reviews for a doctor
router.get('/doctor/:id', GetDoctorReviews);

// Protected — customer must be authenticated to submit
router.post('/doctor/:id', verifyAccessToken, CreateDoctorReview);

// Protected — author or admin to modify
router.patch('/:reviewId', verifyAccessToken, UpdateDoctorReview);
router.delete('/:reviewId', verifyAccessToken, DeleteDoctorReview);

export default router;
