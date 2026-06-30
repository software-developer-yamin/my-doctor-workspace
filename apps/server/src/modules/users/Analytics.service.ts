import Appointment from '../appointments/Appointments.model.js';
import Doctor from '../doctors/Doctors.model.js';
import Hospital from '../hospitals/Hospitals.model.js';
import Customer from '../customers/Customers.model.js';
import AmbulanceBooking from '../ambulance-bookings/AmbulanceBookings.model.js';
import DiagnosticBooking from '../diagnostic-bookings/DiagnosticBookings.model.js';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export class AnalyticsService {
  static async GetDashboardStats() {
    const [
      totalDoctors,
      totalHospitals,
      totalCustomers,
      appointmentStats,
      monthlyAppointments,
      recentAppointments,
      bookingBreakdown,
    ] = await Promise.all([
      Doctor.countDocuments(),
      Hospital.countDocuments(),
      Customer.countDocuments(),

      // Appointment status breakdown + revenue
      Appointment.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            confirmed: { $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } },
            totalRevenue: { $sum: '$totalFee' },
            paidRevenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$totalFee', 0] } },
          },
        },
      ]),

      // Monthly appointment counts for current year
      Appointment.aggregate([
        {
          $group: {
            _id: { $month: '$appointmentDate' },
            count: { $sum: 1 },
            revenue: { $sum: '$totalFee' },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Recent 5 appointments with doctor + customer details
      Appointment.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctor',
            foreignField: '_id',
            as: 'doctor',
            pipeline: [{ $project: { name: 1, photo: 1, degrees: 1 } }],
          },
        },
        { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customer',
            pipeline: [{ $project: { name: 1, phone: 1 } }],
          },
        },
        { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'hospitals',
            localField: 'hospital',
            foreignField: '_id',
            as: 'hospital',
            pipeline: [{ $project: { name: 1 } }],
          },
        },
        { $unwind: { path: '$hospital', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            appointmentDate: 1,
            status: 1,
            totalFee: 1,
            appointmentType: 1,
            consultationType: 1,
            'doctor.name': 1,
            'doctor.photo': 1,
            'customer.name': 1,
            'customer.phone': 1,
            'hospital.name': 1,
            createdAt: 1,
          },
        },
      ]),

      // Booking breakdown across all booking types
      Promise.all([
        AmbulanceBooking.countDocuments(),
        DiagnosticBooking.countDocuments(),
      ]).then(([ambulance, diagnostic]) => ({ ambulance, diagnostic })),
    ]);

    const stats = appointmentStats[0] || {
      total: 0, confirmed: 0, completed: 0, pending: 0, cancelled: 0,
      totalRevenue: 0, paidRevenue: 0,
    };

    // Build 12-month chart with zeros for missing months
    const monthlyMap: Record<number, { count: number; revenue: number }> = {};
    monthlyAppointments.forEach((m: any) => {
      monthlyMap[m._id] = { count: m.count, revenue: m.revenue };
    });

    const chartData = MONTH_NAMES.map((name, i) => ({
      name,
      appointments: monthlyMap[i + 1]?.count ?? 0,
      revenue: monthlyMap[i + 1]?.revenue ?? 0,
    }));

    return {
      summary: {
        totalDoctors,
        totalHospitals,
        totalCustomers,
        totalAppointments: stats.total,
        confirmedAppointments: stats.confirmed,
        completedAppointments: stats.completed,
        pendingAppointments: stats.pending,
        cancelledAppointments: stats.cancelled,
        totalRevenue: stats.totalRevenue,
        paidRevenue: stats.paidRevenue,
        ambulanceBookings: bookingBreakdown.ambulance,
        diagnosticBookings: bookingBreakdown.diagnostic,
      },
      chartData,
      recentAppointments,
    };
  }
}
