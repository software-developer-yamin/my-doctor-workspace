import Appointment from './Appointments.model.js';
import DoctorLiveQueue from '../doctor-live-queues/DoctorLiveQueues.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class AppointmentService {
  static async Create(payload: any) {
    const appointmentDate = new Date(payload.appointmentDate);
    const dayStart = new Date(appointmentDate);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(appointmentDate);
    dayEnd.setUTCHours(23, 59, 59, 999);

    // Atomically claim the next serial from the queue's counter.
    // $inc + pre-update return = no race condition, no duplicate serials.
    const activeQueue = await DoctorLiveQueue.findOneAndUpdate(
      {
        doctor: payload.doctor,
        hospital: payload.hospital,
        date: dayStart,
        isActive: true,
        $expr: { $lte: ['$next_serial', '$total_serial'] },
      },
      { $inc: { next_serial: 1 } },
      { new: false }
    );

    if (activeQueue) {
      // new: false → pre-increment value = the serial we just claimed
      payload.serialNo = activeQueue.next_serial;
    } else {
      // Check if queue exists but is full (vs no queue at all)
      const queueExists = await DoctorLiveQueue.exists({
        doctor: payload.doctor,
        hospital: payload.hospital,
        date: dayStart,
        isActive: true,
      });
      if (queueExists) {
        throw new Error('Queue is full. No more serials available for today.');
      }
      // No live queue — fall back to count-based serial for scheduled appointments
      const existingCount = await Appointment.countDocuments({
        doctor: payload.doctor,
        hospital: payload.hospital,
        appointmentDate: { $gte: dayStart, $lte: dayEnd },
        status: { $nin: ['Cancelled'] },
      });
      payload.serialNo = existingCount + 1;
    }

    return await Appointment.create(payload);
  }

  static async GetById(id: string) {
    return await Appointment.findById(id)
      .populate('doctor')
      .populate('hospital')
      .populate('customer');
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const query = { ...filters };
    delete query.page;
    delete query.limit;

    const [data, total] = await Promise.all([
      Appointment.find(query)
        .populate('customer')
        .populate('doctor')
        .populate('hospital')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(query),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetByCustomer(customerId: string, filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    if (filters.appointmentDate) {
      const d = new Date(filters.appointmentDate as string);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);
      filters.appointmentDate = { $gte: start, $lte: end };
    }
    const query = { ...filters, customer: customerId };
    delete query.page;
    delete query.limit;

    const [data, total] = await Promise.all([
      Appointment.find(query)
        .populate('doctor')
        .populate('hospital')
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(query),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetByDoctor(doctorId: string, filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    if (filters.appointmentDate) {
      const d = new Date(filters.appointmentDate as string);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);
      filters.appointmentDate = { $gte: start, $lte: end };
    }
    const query = { ...filters, doctor: doctorId };
    delete query.page;
    delete query.limit;

    const [data, total] = await Promise.all([
      Appointment.find(query)
        .populate('customer')
        .populate('hospital')
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(query),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }


  static async Update(id: string, payload: any) {
    if (payload.status === 'Completed') {
      payload.paymentStatus = 'Paid';

      const appt = await Appointment.findById(id).select('doctor hospital appointmentDate');
      if (appt) {
        const dayStart = new Date(appt.appointmentDate);
        dayStart.setUTCHours(0, 0, 0, 0);

        const queue = await DoctorLiveQueue.findOne({
          doctor: appt.doctor,
          hospital: appt.hospital,
          date: dayStart,
          isActive: true,
        });

        if (queue && queue.current_serial < queue.total_serial) {
          await DoctorLiveQueue.findByIdAndUpdate(queue._id, { $inc: { current_serial: 1 } });
        }
      }
    }

    return await Appointment.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await Appointment.findByIdAndDelete(id);
  }
}

export default AppointmentService;
