import express from 'express';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import { protect } from '../../middlewares/shared/protect.js';
import * as DoctorLiveQueueController from './DoctorLiveQueues.controller.js';

const router: express.Router = express.Router();

// Helper endpoints
router.post('/setup', verifyAccessToken, DoctorLiveQueueController.SetupLiveQueue);

// Doctor self-managed queue
router.post('/doctor-setup', verifyAccessToken, protect(['doctor']), DoctorLiveQueueController.SetupLiveQueueByDoctor);
router.put('/:id/current-serial', verifyAccessToken, DoctorLiveQueueController.UpdateCurrentSerial);
router.put('/:id/end', verifyAccessToken, DoctorLiveQueueController.EndLiveQueue);

// Public / Customer App endpoints
router.get('/hospital/:hospitalId', DoctorLiveQueueController.GetLiveQueueForHospital);
router.get('/doctor/:doctorId', DoctorLiveQueueController.GetLiveQueueForDoctor);

// Admin endpoints
router.get('/', verifyAccessToken, DoctorLiveQueueController.GetAllQueues);

export default router;
