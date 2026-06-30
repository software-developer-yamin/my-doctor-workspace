import express from 'express';
import CustomerController from './Customers.controller.js';
import { verifyAccessToken } from '../../middlewares/shared/jwt_helper.js';
import upload from '../../helpers/upload.helper.js';

const router: express.Router = express.Router();

// Public auth routes
router.post('/register/request-otp', CustomerController.RequestRegistrationOtp);
router.post('/register/verify-otp', CustomerController.VerifyOtpAndRegister);
router.post('/login', CustomerController.Login);
router.post('/login/request-otp', CustomerController.RequestLoginOtp);
router.post('/login/verify-otp', CustomerController.LoginWithOtp);
router.post('/refresh-token', CustomerController.RefreshToken);
router.post('/logout', verifyAccessToken, CustomerController.Logout);

// Forgot password flow
router.post('/forgot-password/request-otp', CustomerController.RequestPasswordResetOtp);
router.post('/forgot-password/reset', CustomerController.ResetPassword);

// Authenticated customer routes
router.get('/me', verifyAccessToken, CustomerController.GetProfile);
router.patch('/me', verifyAccessToken, upload.single('photo'), CustomerController.UpdateMe);
router.patch('/me/password', verifyAccessToken, CustomerController.ChangePassword);

// Admin CRUD routes
router.post('/', verifyAccessToken, upload.single('photo'), CustomerController.Create);
router.get('/', verifyAccessToken, CustomerController.GetAll);
router.get('/:id', verifyAccessToken, CustomerController.GetOne);
router.patch('/:id', verifyAccessToken, upload.single('photo'), CustomerController.Update);
router.delete('/:id', verifyAccessToken, CustomerController.Delete);

export default router;

