import express from 'express';
import SmsLogController from './SmsLogs.controller.js';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';

const router: express.Router = express.Router();

// Public — send the app download link via SMS
router.post('/send-app-link', SmsLogController.SendAppDownloadLink);

// Admin — view/manage SMS history
router.get('/', verifyAccessToken, SmsLogController.GetAll);
router.get('/:id', verifyAccessToken, SmsLogController.GetOne);
router.delete('/:id', verifyAccessToken, SmsLogController.Delete);

export default router;
