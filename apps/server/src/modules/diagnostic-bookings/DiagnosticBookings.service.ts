import DiagnosticBooking from './DiagnosticBookings.model.js';
import LabTest from '../labs/LabTests.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class DiagnosticBookingService {
  static async Create(payload: any) {
    // Always resolve price from the LabTest junction — client-sent price is ignored
    // to prevent tampering. Price is locked in at booking time.
    const labTest = await LabTest.findOne({ lab: payload.lab, test: payload.test });
    payload.price = labTest ? labTest.price : 0;
    return await DiagnosticBooking.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    
    const query: any = {};
    if (filters.customer) query.customer = filters.customer;
    if (filters.lab) query.lab = filters.lab;
    if (filters.status && filters.status !== 'all') query.status = filters.status;
    if (filters.search) {
      query.$or = [
        { address: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      DiagnosticBooking.find(query)
        .populate('customer', 'name phone')
        .populate('test', 'name')
        .populate('lab', 'name hotline')
        .populate('assigned_helper', 'name username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      DiagnosticBooking.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetById(id: string) {
    return await DiagnosticBooking.findById(id)
      .populate('customer', 'name phone')
      .populate('test', 'name')
      .populate('lab', 'name hotline')
      .populate('assigned_helper', 'name username');
  }

  static async Update(id: string, payload: any) {
    return await DiagnosticBooking.findByIdAndUpdate(id, payload, { new: true })
      .populate('customer', 'name phone')
      .populate('test', 'name')
      .populate('lab', 'name hotline')
      .populate('assigned_helper', 'name username');
  }

  static async Delete(id: string) {
    return await DiagnosticBooking.findByIdAndDelete(id);
  }
}

export default DiagnosticBookingService;
