import HomeDoctorBooking from './HomeDoctorBookings.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class HomeDoctorBookingService {
  static async Create(payload: any) {
    return await HomeDoctorBooking.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    
    const query: any = {};
    if (filters.status) query.status = filters.status;

    const [data, total] = await Promise.all([
      HomeDoctorBooking.find(query)
        .populate('customer', 'name phone email')
        .populate('doctor', 'name phone email photo address')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      HomeDoctorBooking.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetByCustomer(customerId: string, filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const query = { customer: customerId };

    const [data, total] = await Promise.all([
      HomeDoctorBooking.find(query)
        .populate('doctor', 'name phone email photo address degrees')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      HomeDoctorBooking.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetByDoctor(doctorId: string, filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const query = { doctor: doctorId };

    const [data, total] = await Promise.all([
      HomeDoctorBooking.find(query)
        .populate('customer', 'name phone email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      HomeDoctorBooking.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async UpdateStatus(id: string, status: string) {
    return await HomeDoctorBooking.findByIdAndUpdate(id, { status }, { new: true })
      .populate('customer', 'name phone email')
      .populate('doctor', 'name phone email photo address');
  }

  static async Delete(id: string) {
    return await HomeDoctorBooking.findByIdAndDelete(id);
  }
}

export default HomeDoctorBookingService;
