import express from 'express';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import * as DoctorHomeScheduleController from './DoctorHomeSchedules.controller.js';

const router: express.Router = express.Router();

router.get('/public', DoctorHomeScheduleController.GetAllSchedules);
router.get('/public/doctor/:doctorId', DoctorHomeScheduleController.GetScheduleByDoctor);

router.post('/', verifyAccessToken, DoctorHomeScheduleController.SaveSchedule);
router.get('/', verifyAccessToken, DoctorHomeScheduleController.GetAllSchedules);
router.get('/doctor/:doctorId', verifyAccessToken, DoctorHomeScheduleController.GetScheduleByDoctor);
router.delete('/:id', verifyAccessToken, DoctorHomeScheduleController.DeleteSchedule);

export default router;
