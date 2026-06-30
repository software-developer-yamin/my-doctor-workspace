import Prescription from './Prescriptions.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class PrescriptionService {
  static async Create(payload: any) {
    return await Prescription.create(payload);
  }

  static async GetByAppointment(appointmentId: string) {
    return await Prescription.findOne({ appointment: appointmentId })
      .populate('doctor', 'name email photo BMDC_REG_NO')
      .populate('patient', 'name phone email photo')
      .populate('appointment');
  }

  static async Update(id: string, payload: any) {
    return await Prescription.findByIdAndUpdate(id, payload, { new: true });
  }

  static async GetMyPrescriptions(patientId: string, filters: Record<string, unknown> = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const query: Record<string, unknown> = { patient: patientId };

    if (filters.search) {
      query.diagnosis = { $regex: filters.search, $options: 'i' };
    }
    if (filters.dateFrom || filters.dateTo) {
      const dateRange: Record<string, Date> = {};
      if (filters.dateFrom) dateRange.$gte = new Date(filters.dateFrom as string);
      if (filters.dateTo)   dateRange.$lte = new Date(filters.dateTo as string);
      query.createdAt = dateRange;
    }

    const sortOrder = filters.sort === 'oldest' ? 1 : -1;

    const [data, total] = await Promise.all([
      Prescription.find(query)
        .populate('doctor', 'name photo BMDC_REG_NO')
        .populate({ path: 'appointment', populate: { path: 'hospital', select: 'name address logo' } })
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit),
      Prescription.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }
}

export default PrescriptionService;
