import express from 'express';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import { protect } from '../../middlewares/shared/protect.js';
import PrescriptionController from './Prescriptions.controller.js';
import uploadMedia from '../../helpers/uploadMedia.helper.js';

const router: express.Router = express.Router();

router.post('/', verifyAccessToken, protect(['doctor']), uploadMedia.array('attachments', 10), PrescriptionController.Create);
router.get('/my', verifyAccessToken, protect(['customer']), PrescriptionController.GetMyPrescriptions);
router.get('/appointment/:appointmentId', verifyAccessToken, PrescriptionController.GetByAppointment);
router.patch('/:id', verifyAccessToken, protect(['doctor']), uploadMedia.array('attachments', 10), PrescriptionController.Update);

export default router;
