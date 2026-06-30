import express from 'express';
import CallbackRequestController from './CallbackRequests.controller.js';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';

const router: express.Router = express.Router();

// Public — submit callback request
router.post('/', CallbackRequestController.Create);

// Admin
router.get('/', verifyAccessToken, CallbackRequestController.GetAll);
router.get('/:id', verifyAccessToken, CallbackRequestController.GetOne);
router.patch('/:id/status', verifyAccessToken, CallbackRequestController.UpdateStatus);
router.delete('/:id', verifyAccessToken, CallbackRequestController.Delete);

export default router;
