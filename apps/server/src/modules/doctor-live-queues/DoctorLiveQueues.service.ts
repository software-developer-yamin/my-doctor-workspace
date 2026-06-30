import DoctorLiveQueue from './DoctorLiveQueues.model.js';
import Appointment from '../appointments/Appointments.model.js';
import User from '../users/Users.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class DoctorLiveQueueService {
  // Count scheduled appointments already booked for that day so next_serial
  // starts after them — shared serial pool between scheduled and walk-in.
  private static async getInitialNextSerial(doctor: string, hospital: string, dayStart: Date): Promise<number> {
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCHours(23, 59, 59, 999);
    const count = await Appointment.countDocuments({
      doctor,
      hospital,
      appointmentDate: { $gte: dayStart, $lte: dayEnd },
      status: { $nin: ['Cancelled'] },
    });
    return count + 1;
  }

  static async SetupQueue(payload: any, helperId: string) {
    const helper: any = await User.findById(helperId);
    if (!helper || !helper.assignedHospital) {
      throw new Error('Helper is not assigned to any hospital');
    }

    const { doctor, start_date_time, total_serial, avg_per_patient_visit_time_in_min, date } = payload;

    const queryDate = new Date(date || new Date());
    queryDate.setUTCHours(0, 0, 0, 0);

    const initialNextSerial = await DoctorLiveQueueService.getInitialNextSerial(
      doctor, String(helper.assignedHospital), queryDate
    );

    return await DoctorLiveQueue.findOneAndUpdate(
      { hospital: helper.assignedHospital, doctor, date: queryDate },
      {
        $set: {
          start_date_time: new Date(start_date_time),
          total_serial,
          avg_per_patient_visit_time_in_min: avg_per_patient_visit_time_in_min || 15,
          isActive: true,
        },
        $setOnInsert: {
          hospital: helper.assignedHospital,
          doctor,
          creator: helperId,
          date: queryDate,
          current_serial: 0,
          next_serial: initialNextSerial,
        },
      },
      { upsert: true, new: true }
    );
  }

  static async UpdateCurrentSerial(id: string, current_serial: number) {
    return await DoctorLiveQueue.findByIdAndUpdate(
      id,
      {
        $set: { current_serial },
        $max: { next_serial: current_serial + 1 },
      },
      { new: true }
    ).populate('doctor', 'name photo degrees speciality');
  }

  static async GetLiveQueueByHospital(hospitalId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return await DoctorLiveQueue.find({
      hospital: hospitalId,
      date: today,
      isActive: true
    })
    .populate('doctor', 'name photo degrees slug short_description')
    .sort({ 'start_date_time': 1 });
  }

  static async GetLiveQueueByDoctor(doctorId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return await DoctorLiveQueue.find({
      doctor: doctorId,
      date: today,
    })
    .populate('hospital', 'name address logo hotline')
    .populate('doctor', 'name photo degrees')
    .sort({ start_date_time: 1 });
  }

  static async EndQueue(id: string) {
    return await DoctorLiveQueue.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  static async SetupQueueByDoctor(payload: any, doctorId: string) {
    const { hospitalId, start_date_time, total_serial, avg_per_patient_visit_time_in_min, date } = payload;

    const queryDate = new Date(date || new Date());
    queryDate.setUTCHours(0, 0, 0, 0);

    const initialNextSerial = await DoctorLiveQueueService.getInitialNextSerial(
      doctorId, hospitalId, queryDate
    );

    return await DoctorLiveQueue.findOneAndUpdate(
      { hospital: hospitalId, doctor: doctorId, date: queryDate },
      {
        $set: {
          start_date_time: new Date(start_date_time),
          total_serial,
          avg_per_patient_visit_time_in_min: avg_per_patient_visit_time_in_min || 15,
          isActive: true,
        },
        $setOnInsert: {
          hospital: hospitalId,
          doctor: doctorId,
          creator: null,
          date: queryDate,
          current_serial: 0,
          next_serial: initialNextSerial,
        },
      },
      { upsert: true, new: true }
    );
  }

  static async GetAllActiveQueues(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    
    const query: any = {};
    if (filters.isActive !== undefined) query.isActive = filters.isActive === 'true';
    if (filters.creator) query.creator = filters.creator;

    const [data, total] = await Promise.all([
      DoctorLiveQueue.find(query)
        .populate('hospital', 'name address')
        .populate('doctor', 'name photo degrees')
        .populate('creator', 'name email role')
        .sort({ 'createdAt': -1 })
        .skip(skip)
        .limit(limit),
      DoctorLiveQueue.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }
}

export default DoctorLiveQueueService;
