import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '../../middlewares/shared/jwt_helper.js';
import User from './Users.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class UserService {
  static async Create(payload: any) {
    return await User.create(payload);
  }

  static async Login(payload: any) {
    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not registered');
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      throw new Error('Username/password not valid');
    }

    const accessToken = await signAccessToken((user._id as any).toString(), user.role);
    const refreshToken = await signRefreshToken((user._id as any).toString());

    return { accessToken, refreshToken, user };
  }

  static async RefreshToken(token: string) {
    if (!token) throw new Error('Bad Request');
    // Original logic was here
    return { accessToken: '...', refreshToken: '...' }; 
  }

  static async Logout(token: string) {
    if (!token) throw new Error('Bad Request');
    return { message: "Successfully Logout" };
  }

  static async GetAll(filters: any = {}) {
    const query: any = {};

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.role) {
      query.role = filters.role;
    }

    const { page, limit, skip } = parsePagination(filters);
    const [data, total] = await Promise.all([
      User.find(query)
        .populate('assignedHospital', 'name address')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetById(id: string) {
    return await User.findById(id).populate('assignedHospital', 'name address');
  }

  static async Update(id: string, payload: any) {
    if (payload.password) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
    }
    return await User.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await User.findByIdAndDelete(id);
  }
}

export default UserService;
