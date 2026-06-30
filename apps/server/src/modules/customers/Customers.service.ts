import Customer from './Customers.model.js';
import Otp from './Otps.model.js';
import { sendSMS } from '../../helpers/sms.helper.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../middlewares/shared/jwt_helper.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';
import createError from 'http-errors';

class CustomerService {
  static async Create(payload: any) {
    return await Customer.create(payload);
  }

  static async Login(payload: any) {
    const { phone, password } = payload;

    const customer = await Customer.findOne({ phone });
    if (!customer) {
      throw createError.Unauthorized('Invalid phone number or password');
    }

    const isMatch = await customer.isValidPassword(password);
    if (!isMatch) {
      throw createError.Unauthorized('Invalid phone number or password');
    }

    const accessToken = await signAccessToken((customer._id as any).toString(), 'customer');
    const refreshToken = await signRefreshToken((customer._id as any).toString());

    return {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        photo: customer.photo,
        gender: customer.gender,
      },
      accessToken,
      refreshToken,
    };
  }

  static async RequestLoginOtp(phone: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const message = `Your My Doctor login code is: ${otp}. Valid for 5 minutes.`;
    await sendSMS(phone, message, { category: 'otp_login' });

    return { message: 'OTP sent successfully' };
  }

  static async LoginWithOtp(payload: { phone: string; otp: string }) {
    const { phone, otp } = payload;

    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) throw createError.BadRequest('Invalid or expired OTP');

    let customer = await Customer.findOne({ phone });
    let isNewAccount = false;
    if (!customer) {
      customer = await Customer.create({ phone });
      isNewAccount = true;
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    const accessToken = await signAccessToken((customer._id as any).toString(), 'customer');
    const refreshToken = await signRefreshToken((customer._id as any).toString());

    return {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        photo: customer.photo,
        gender: customer.gender,
      },
      accessToken,
      refreshToken,
      isNewAccount,
    };
  }

  static async RefreshToken(token: string) {
    if (!token) throw createError.BadRequest('Refresh token is required');

    const customerId = await verifyRefreshToken(token);

    const customer = await Customer.findById(customerId);
    if (!customer) throw createError.NotFound('Customer not found');

    const accessToken = await signAccessToken((customer._id as any).toString(), 'customer');
    const newRefreshToken = await signRefreshToken((customer._id as any).toString());

    return { accessToken, refreshToken: newRefreshToken };
  }

  static async GetProfile(customerId: string) {
    const customer = await Customer.findById(customerId).select('-password');
    if (!customer) throw createError.NotFound('Customer not found');
    return customer;
  }

  static async ChangePassword(customerId: string, payload: { currentPassword: string; newPassword: string }) {
    const { currentPassword, newPassword } = payload;

    const customer = await Customer.findById(customerId);
    if (!customer) throw createError.NotFound('Customer not found');

    const isMatch = await customer.isValidPassword(currentPassword);
    if (!isMatch) throw createError.Unauthorized('Current password is incorrect');

    customer.password = newPassword;
    await customer.save();

    return { message: 'Password changed successfully' };
  }

  static async RequestPasswordResetOtp(phone: string) {
    const customer = await Customer.findOne({ phone });
    // Always return the same response — don't leak whether phone is registered
    if (!customer) return { message: 'If this number is registered, you will receive an OTP shortly.' };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const message = `Your My Doctor password reset code is: ${otp}. Valid for 5 minutes.`;
    await sendSMS(phone, message, { category: 'otp_password_reset' });

    return { message: 'If this number is registered, you will receive an OTP shortly.' };
  }

  static async ResetPassword(payload: { phone: string; otp: string; newPassword: string }) {
    const { phone, otp, newPassword } = payload;

    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) throw createError.BadRequest('Invalid or expired OTP');

    const customer = await Customer.findOne({ phone });
    if (!customer) throw createError.NotFound('Customer not found');

    customer.password = newPassword;
    await customer.save();

    await Otp.deleteOne({ _id: otpRecord._id });

    return { message: 'Password reset successfully' };
  }

  static async RequestRegistrationOtp(phone: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await Otp.findOneAndUpdate(
      { phone },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send SMS
    const message = `Your My Doctor verification code is: ${otp}. Valid for 5 minutes.`;
    await sendSMS(phone, message, { category: 'otp_registration' });

    return { message: 'OTP sent successfully' };
  }

  static async VerifyOtpAndRegister(payload: any) {
    const { phone, otp, ...customerData } = payload;

    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) {
      throw createError.BadRequest('Invalid or expired OTP');
    }

    // OTP verified, remove it
    await Otp.deleteOne({ _id: otpRecord._id });

    // Register customer
    return await this.Create({ ...customerData, phone });
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const [data, total] = await Promise.all([
      Customer.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Customer.countDocuments({}),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetOne(id: string) {
    return await Customer.findById(id);
  }

  static async Update(id: string, payload: any) {
    return await Customer.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await Customer.findByIdAndDelete(id);
  }
}

export default CustomerService;
