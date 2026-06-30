import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/shared/jwt_helper.js";
import { ErrorUtils } from "../../utils/errorResponse.js";
import { sendResponse } from "../../utils/sendResponse.js";
import CustomerService from "./Customers.service.js";

class CustomerController {
  static async Create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      if (req.file) payload.photo = `/uploads/${req.file.filename}`;
      const data = await CustomerService.Create(payload);
      return sendResponse(res, data, "Customer created successfully", 201);
    } catch (e) {
      next(e);
    }
  }

  static async RequestRegistrationOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { phone } = req.body;
      if (!phone) return ErrorUtils.badRequest(res, "Phone number is required");
      const data = await CustomerService.RequestRegistrationOtp(
        phone as string,
      );
      return sendResponse(res, data, "OTP sent successfully");
    } catch (e) {
      next(e);
    }
  }

  static async Login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CustomerService.Login(req.body);
      return sendResponse(res, data, "Login successful");
    } catch (e) {
      next(e);
    }
  }

  static async RequestLoginOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;
      if (!phone) return ErrorUtils.badRequest(res, "Phone number is required");
      const data = await CustomerService.RequestLoginOtp(phone as string);
      return sendResponse(res, data, "OTP sent successfully");
    } catch (e) {
      next(e);
    }
  }

  static async LoginWithOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) return ErrorUtils.badRequest(res, "Phone and OTP are required");
      const data = await CustomerService.LoginWithOtp({ phone, otp });
      return sendResponse(res, data, "Login successful");
    } catch (e) {
      next(e);
    }
  }

  static async RefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return ErrorUtils.badRequest(res, "Refresh token is required");
      const data = await CustomerService.RefreshToken(refreshToken);
      return sendResponse(res, data, "Token refreshed successfully");
    } catch (e) {
      next(e);
    }
  }

  static async Logout(req: Request, res: Response, next: NextFunction) {
    try {
      return sendResponse(res, null, "Logged out successfully");
    } catch (e) {
      next(e);
    }
  }

  static async GetProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const customerId = req.payload?.aud as string;
      const data = await CustomerService.GetProfile(customerId);
      return sendResponse(res, data, "Profile fetched successfully");
    } catch (e) {
      next(e);
    }
  }

  static async UpdateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const customerId = req.payload?.aud as string;
      const payload = { ...req.body };
      if (req.file) payload.photo = `/uploads/${req.file.filename}`;
      // Never allow these fields via self-update
      delete payload.password;
      delete payload.phone;
      delete payload._id;
      const data = await CustomerService.Update(customerId, payload);
      if (!data) return ErrorUtils.notFound(res, "Customer not found");
      return sendResponse(res, data, "Profile updated successfully");
    } catch (e) {
      next(e);
    }
  }

  static async ChangePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const customerId = req.payload?.aud as string;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return ErrorUtils.badRequest(res, "Current password and new password are required");
      }
      const data = await CustomerService.ChangePassword(customerId, { currentPassword, newPassword });
      return sendResponse(res, data, "Password changed successfully");
    } catch (e) {
      next(e);
    }
  }

  static async RequestPasswordResetOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;
      if (!phone) return ErrorUtils.badRequest(res, "Phone number is required");
      const data = await CustomerService.RequestPasswordResetOtp(phone);
      return sendResponse(res, data, "OTP sent successfully");
    } catch (e) {
      next(e);
    }
  }

  static async ResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, otp, newPassword } = req.body;
      if (!phone || !otp || !newPassword) {
        return ErrorUtils.badRequest(res, "Phone, OTP, and new password are required");
      }
      const data = await CustomerService.ResetPassword({ phone, otp, newPassword });
      return sendResponse(res, data, "Password reset successfully");
    } catch (e) {
      next(e);
    }
  }

  static async VerifyOtpAndRegister(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await CustomerService.VerifyOtpAndRegister(req.body);
      return sendResponse(res, data, "Registration successful", 201);
    } catch (e) {
      next(e);
    }
  }

  static async GetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, meta } = await CustomerService.GetAll(
        req.query as Record<string, unknown>,
      );
      return sendResponse(
        res,
        data,
        "Customers fetched successfully",
        200,
        meta,
      );
    } catch (e) {
      next(e);
    }
  }

  static async GetOne(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CustomerService.GetOne(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, "Customer not found");
      return sendResponse(res, data, "Customer fetched successfully");
    } catch (e) {
      next(e);
    }
  }

  static async Update(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      if (req.file) payload.photo = `/uploads/${req.file.filename}`;
      const data = await CustomerService.Update(
        req.params.id as string,
        payload,
      );
      if (!data) return ErrorUtils.notFound(res, "Customer not found");
      return sendResponse(res, data, "Customer updated successfully");
    } catch (e) {
      next(e);
    }
  }

  static async Delete(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await CustomerService.Delete(req.params.id as string);
      if (!data) return ErrorUtils.notFound(res, "Customer not found");
      return sendResponse(res, null, "Customer deleted successfully");
    } catch (e) {
      next(e);
    }
  }
}

export default CustomerController;
