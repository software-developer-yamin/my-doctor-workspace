import express from 'express';
import ContactMessageController from './ContactMessages.controller.js';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';

const router: express.Router = express.Router();

// Public — submit contact form
router.post('/', ContactMessageController.Create);

// Admin — manage messages
router.get('/', verifyAccessToken, ContactMessageController.GetAll);
router.get('/:id', verifyAccessToken, ContactMessageController.GetOne);
router.patch('/:id/status', verifyAccessToken, ContactMessageController.UpdateStatus);
router.delete('/:id', verifyAccessToken, ContactMessageController.Delete);

export default router;
