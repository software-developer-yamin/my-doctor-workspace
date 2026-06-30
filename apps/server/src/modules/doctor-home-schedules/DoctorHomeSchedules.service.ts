import DoctorHomeSchedule from './DoctorHomeSchedules.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class DoctorHomeScheduleService {
  static async CreateOrUpdate(payload: any) {
    const { doctor, schedules, homeVisitFee, followUpFee } = payload;
    const update: any = { schedules };
    if (homeVisitFee !== undefined) update.homeVisitFee = homeVisitFee;
    if (followUpFee !== undefined) update.followUpFee = followUpFee;
    return await DoctorHomeSchedule.findOneAndUpdate(
      { doctor },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  static async GetAll(filters: Record<string, unknown> = {}) {
    const { page, limit, skip } = parsePagination(filters);
    
    const [data, total] = await Promise.all([
      DoctorHomeSchedule.find({})
        .populate('doctor', 'name email photo degrees')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      DoctorHomeSchedule.countDocuments({}),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetByDoctor(doctorId: string) {
    return await DoctorHomeSchedule.findOne({ doctor: doctorId }).populate('doctor', 'name email photo degrees');
  }

  static async Delete(id: string) {
    return await DoctorHomeSchedule.findByIdAndDelete(id);
  }
}

export default DoctorHomeScheduleService;
