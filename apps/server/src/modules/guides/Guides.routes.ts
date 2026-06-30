import express from 'express';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import upload from '../../helpers/upload.helper.js';
import * as GuideController from './Guides.controller.js';

const router: express.Router = express.Router();

const cpUpload = upload.single('photo');

// Public routes
router.get('/public/filters', GuideController.GetGuideFilters);
router.get('/public', GuideController.GetAllGuides);
router.get('/public/:id', GuideController.GetGuideById);

// Authenticated routes
router.post('/', verifyAccessToken, cpUpload, GuideController.CreateGuide);
router.get('/', verifyAccessToken, GuideController.GetAllGuides);
router.get('/filters', verifyAccessToken, GuideController.GetGuideFilters);
router.get('/:id', verifyAccessToken, GuideController.GetGuideById);
router.patch('/:id', verifyAccessToken, cpUpload, GuideController.UpdateGuide);
router.delete('/:id', verifyAccessToken, GuideController.DeleteGuide);

export default router;
