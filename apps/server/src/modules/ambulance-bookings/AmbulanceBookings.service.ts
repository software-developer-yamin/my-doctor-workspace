import AmbulanceBooking from './AmbulanceBookings.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class AmbulanceBookingService {
  static async Create(payload: any) {
    return await AmbulanceBooking.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    
    const query: any = {};
    if (filters.customer) query.customer = filters.customer;
    if (filters.status && filters.status !== 'all') query.status = filters.status;
    if (filters.search) {
      query.$or = [
        { from_address: { $regex: filters.search, $options: 'i' } },
        { to_address: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      AmbulanceBooking.find(query)
        .populate('customer', 'name phone')
        .populate({
           path: 'assigned_ambulance',
           populate: { path: 'city', select: 'name' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AmbulanceBooking.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetById(id: string) {
    return await AmbulanceBooking.findById(id)
      .populate('customer', 'name phone')
      .populate('assigned_ambulance');
  }

  static async Update(id: string, payload: any) {
    return await AmbulanceBooking.findByIdAndUpdate(id, payload, { new: true })
      .populate('customer', 'name phone')
      .populate('assigned_ambulance');
  }

  static async Delete(id: string) {
    return await AmbulanceBooking.findByIdAndDelete(id);
  }
}

export default AmbulanceBookingService;
