import express from 'express';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import * as BdLocationController from './BdLocations.controller.js';

const router: express.Router = express.Router();

router.get('/public/grouped', BdLocationController.GetGrouped);
router.get('/public/districts', BdLocationController.GetDistricts);
router.get('/public/upazilas', BdLocationController.GetUpazilasByDistrict);
router.get('/public', BdLocationController.GetAllBdLocations);
router.get('/', verifyAccessToken, BdLocationController.GetAllBdLocations);
router.post('/', verifyAccessToken, BdLocationController.CreateBdLocation);
router.patch('/:id', verifyAccessToken, BdLocationController.UpdateBdLocation);
router.delete('/:id', verifyAccessToken, BdLocationController.DeleteBdLocation);

export default router;
