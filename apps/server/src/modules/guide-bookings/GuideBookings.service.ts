import mongoose from 'mongoose';
import GuideBooking from './GuideBookings.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class GuideBookingService {
  static async Create(payload: any) {
    return await GuideBooking.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const query: any = {};
    if (filters.customer) query.customer = filters.customer;
    if (filters.status) query.status = filters.status;
    if (filters.bdLocation) query.bdLocation = new mongoose.Types.ObjectId(filters.bdLocation as string);
    if (filters.search) {
      query.$or = [
        { patientName: { $regex: filters.search, $options: 'i' } },
        { phoneNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      GuideBooking.find(query)
        .populate('customer', 'name phone email')
        .populate('bdLocation', 'district upazila')
        .populate('hospital', 'name address')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      GuideBooking.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetByCustomer(customerId: string, filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const query = { customer: customerId };

    const [data, total] = await Promise.all([
      GuideBooking.find(query)
        .populate('bdLocation', 'district upazila')
        .populate('hospital', 'name address')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      GuideBooking.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async UpdateStatus(id: string, status: string) {
    return await GuideBooking.findByIdAndUpdate(id, { status }, { new: true });
  }

  static async Delete(id: string) {
    return await GuideBooking.findByIdAndDelete(id);
  }
}

export default GuideBookingService;
