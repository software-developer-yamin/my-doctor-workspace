import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { signAccessToken, signRefreshToken } from '../../middlewares/shared/jwt_helper.js';
import Doctor from './Doctors.model.js';
import DoctorSchedules from '../doctor-schedules/DoctorSchedules.model.js';
import Appointment from '../appointments/Appointments.model.js';
import BdLocationService from '../bd-locations/BdLocations.service.js';
import Speciality from '../specialities/Specialities.model.js';
import Concentration from '../concentrations/Concentrations.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const DOCTOR_PUBLIC_FIELDS = new Set([
  '_id','slug','name','photo','gender','degrees','specializations','field_of_concentration',
  'rating','totalReviews','positiveReviewPercentage','hospitalsCount','avgConsultationFee',
  'minConsultationFee','avgWaitingTime','isAvailableHome','homeSchedule','hospitalSchedules',
  'updatedAt','createdAt',
]);

function parseFieldsProjection(fields?: string): Record<string, 1> | null {
  if (!fields) return null;
  const proj: Record<string, 1> = {};
  for (const f of fields.split(',').map((s) => s.trim())) {
    if (DOCTOR_PUBLIC_FIELDS.has(f)) proj[f] = 1;
  }
  return Object.keys(proj).length ? proj : null;
}

function generateSlots(startTime: string, endTime: string): string[] {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const slots: string[] = [];
  for (let m = startMin; m + 30 <= endMin; m += 30) {
    const sH = Math.floor(m / 60);
    const sM = m % 60;
    const eH = Math.floor((m + 30) / 60);
    const eM = (m + 30) % 60;
    const endPeriod = eH >= 12 ? 'PM' : 'AM';
    const eH12 = eH % 12 || 12;
    const sH12 = sH % 12 || 12;
    slots.push(`${sH12}:${String(sM).padStart(2, '0')}–${eH12}:${String(eM).padStart(2, '0')} ${endPeriod}`);
  }
  return slots;
}

function slotToStartTime(slot: string): string {
  const parts = slot.split('–');
  const rawStart = parts[0].trim();
  const rawEnd = parts[1].trim();
  const endMeridiem = rawEnd.slice(-2) as 'AM' | 'PM';
  const startHour = parseInt(rawStart.split(':')[0], 10);
  const startMeridiem = (endMeridiem === 'PM' && startHour === 11) ? 'AM' : endMeridiem;
  return `${rawStart} ${startMeridiem}`;
}

const schedulesLookup = [
  {
    $lookup: {
      from: 'doctorschedules',
      let: { doctorId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$doctor', '$$doctorId'] } } },
        {
          $lookup: {
            from: 'hospitals',
            let: { hospitalId: '$hospital' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$hospitalId'] } } },
              {
                $lookup: {
                  from: 'bdlocations',
                  localField: 'bdLocation',
                  foreignField: '_id',
                  as: 'bdLocation',
                },
              },
              { $unwind: { path: '$bdLocation', preserveNullAndEmptyArrays: true } },
            ],
            as: 'hospital',
          },
        },
        { $unwind: { path: '$hospital', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            consultationFee: 1,
            followUpFee: 1,
            avgWaitingTime: 1,
            schedules: 1,
            consultationTypes: 1,
            appointmentTypes: 1,
            languages: 1,
            status: 1,
            'hospital._id': 1,
            'hospital.name': 1,
            'hospital.address': 1,
            'hospital.city': 1,
            'hospital.logo': 1,
            'hospital.hotline': 1,
            'hospital.contactNumber': 1,
            'hospital.email': 1,
            'hospital.mapUrl': 1,
            'hospital.bdLocation': 1,
          },
        },
      ],
      as: 'hospitalSchedules',
    },
  },
  {
    $addFields: {
      hospitalsCount: { $size: '$hospitalSchedules' },
      avgConsultationFee: {
        $cond: [
          { $gt: [{ $size: '$hospitalSchedules' }, 0] },
          { $avg: '$hospitalSchedules.consultationFee' },
          0,
        ],
      },
      minConsultationFee: {
        $cond: [
          { $gt: [{ $size: '$hospitalSchedules' }, 0] },
          { $min: '$hospitalSchedules.consultationFee' },
          0,
        ],
      },
      avgWaitingTime: {
        $cond: [
          { $gt: [{ $size: '$hospitalSchedules' }, 0] },
          { $avg: '$hospitalSchedules.avgWaitingTime' },
          null,
        ],
      },
    },
  },
];

const homeScheduleLookup = [
  {
    $lookup: {
      from: 'doctorhomeschedules',
      localField: '_id',
      foreignField: 'doctor',
      as: '_homeSchedule',
    },
  },
  {
    $addFields: {
      homeSchedule: { $arrayElemAt: ['$_homeSchedule', 0] },
      isAvailableHome: { $gt: [{ $size: '$_homeSchedule' }, 0] },
    },
  },
  { $unset: '_homeSchedule' },
];

const populateLookups = [
  {
    $lookup: {
      from: 'specialities',
      localField: 'specializations',
      foreignField: '_id',
      as: 'specializations',
    },
  },
  {
    $lookup: {
      from: 'concentrations',
      localField: 'field_of_concentration',
      foreignField: '_id',
      as: 'field_of_concentration',
    },
  },
];

function buildMatchCriteria(idOrSlug: string): Record<string, unknown> {
  return mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: new mongoose.Types.ObjectId(idOrSlug) }
    : { slug: idOrSlug };
}

class DoctorService {
  static async Create(payload: any) {
    return await Doctor.create(payload);
  }

  static async Login(payload: any) {
    const { email, password } = payload;

    const doctor = await Doctor.findOne({ email }).select('+password');
    if (!doctor) throw createError.Unauthorized('Invalid email or password');

    const isMatch = await doctor.isValidPassword(password);
    if (!isMatch) throw createError.Unauthorized('Invalid email or password');

    const accessToken = await signAccessToken((doctor._id as any).toString(), 'doctor');
    const refreshToken = await signRefreshToken((doctor._id as any).toString());

    return {
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        photo: doctor.photo,
        BMDC_REG_NO: doctor.BMDC_REG_NO,
      },
      accessToken,
      refreshToken,
    };
  }

  static async GetAll(filters: any = {}) {
    const match: any = {};

    if (filters.search) {
      const safeSearch = escapeRegex(filters.search as string);
      const orClauses: any[] = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { BMDC_REG_NO: { $regex: safeSearch, $options: 'i' } },
        { phone: { $regex: safeSearch, $options: 'i' } },
        { degrees: { $regex: safeSearch, $options: 'i' } },
        { short_description: { $regex: safeSearch, $options: 'i' } },
      ];
      // Also match doctors whose specialization or concentration names contain the search term
      const [matchingSpecialities, matchingConcentrations] = await Promise.all([
        Speciality.find({ name: { $regex: safeSearch, $options: 'i' } }, '_id'),
        Concentration.find({ name: { $regex: safeSearch, $options: 'i' } }, '_id'),
      ]);
      if (matchingSpecialities.length > 0) {
        orClauses.push({ specializations: { $in: matchingSpecialities.map((s) => s._id) } });
      }
      if (matchingConcentrations.length > 0) {
        orClauses.push({ field_of_concentration: { $in: matchingConcentrations.map((c) => c._id) } });
      }
      match.$or = orClauses;
    }

    if (filters.specialization) match.specializations = new mongoose.Types.ObjectId(filters.specialization);
    if (filters.concentration) match.field_of_concentration = new mongoose.Types.ObjectId(filters.concentration);
    if (filters.gender === 'Male' || filters.gender === 'Female') match.gender = filters.gender;

    const { page, limit, skip } = parsePagination(filters);

    const pipeline: any[] = [
      { $match: match },
      ...homeScheduleLookup,
    ];

    if (filters.isAvailableHome !== undefined) {
      pipeline.push({ $match: { isAvailableHome: filters.isAvailableHome === 'true' } });
    }

    const locationDistrict = (filters.district || filters.bdLocation) as string | undefined;
    const locationUpazila = filters.upazila as string | undefined;
    if (locationDistrict) {
      let locationIds: mongoose.Types.ObjectId[] = [];
      if (/^[0-9a-fA-F]{24}$/.test(locationDistrict)) {
        locationIds = [new mongoose.Types.ObjectId(locationDistrict)];
      } else {
        locationIds = await BdLocationService.ResolveToIds(locationDistrict, locationUpazila);
      }
      if (locationIds.length) {
        pipeline.push(
          {
            $lookup: {
              from: 'doctorschedules',
              let: { doctorId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$doctor', '$$doctorId'] } } },
                {
                  $lookup: {
                    from: 'hospitals',
                    let: { hospitalId: '$hospital' },
                    pipeline: [
                      { $match: { $expr: { $eq: ['$_id', '$$hospitalId'] } } },
                      { $match: { bdLocation: { $in: locationIds } } },
                    ],
                    as: '_hosp',
                  },
                },
                { $match: { '_hosp.0': { $exists: true } } },
                { $limit: 1 },
              ],
              as: '_locationMatch',
            },
          },
          { $match: { '_locationMatch.0': { $exists: true } } },
          { $unset: '_locationMatch' },
        );
      }
    }

    // Time band definitions for schedule filtering — both startTime AND endTime must be within the band
    const TIME_BANDS: Record<string, object> = {
      morning:   { $gte: '06:00', $lte: '12:00' },
      afternoon: { $gte: '12:00', $lte: '16:00' },
      evening:   { $gte: '16:00', $lte: '20:00' },
      night:     { $gte: '20:00', $lte: '23:59' },
    };
    // Aggregation expressions — startTime in band AND endTime within band ceiling
    const TIME_BAND_EXPRS: Record<string, any> = {
      morning:   { $and: [{ $gte: ['$$s.startTime', '06:00'] }, { $lte: ['$$s.startTime', '12:00'] }, { $lte: ['$$s.endTime', '12:00'] }] },
      afternoon: { $and: [{ $gte: ['$$s.startTime', '12:00'] }, { $lte: ['$$s.startTime', '16:00'] }, { $lte: ['$$s.endTime', '16:00'] }] },
      evening:   { $and: [{ $gte: ['$$s.startTime', '16:00'] }, { $lte: ['$$s.startTime', '20:00'] }, { $lte: ['$$s.endTime', '20:00'] }] },
      night:     { $and: [{ $gte: ['$$s.startTime', '20:00'] }, { $lte: ['$$s.endTime',   '23:59'] }] },
    };

    let scheduleCategories: string[] = [];

    if (filters.schedule) {
      const values = String(filters.schedule).split(',').map((s: string) => s.trim()).filter(Boolean);
      const exactTimes = values.filter(v => !TIME_BANDS[v]);
      scheduleCategories = values.filter(v => TIME_BANDS[v] !== undefined);

      const orConditions: any[] = [];
      // Build $expr conditions using TIME_BAND_EXPRS (rewritten with $schedules.* path)
      const LOOKUP_BAND_EXPRS: Record<string, any> = {
        morning:   { $and: [{ $gte: ['$schedules.startTime', '06:00'] }, { $lte: ['$schedules.startTime', '12:00'] }, { $lte: ['$schedules.endTime', '12:00'] }] },
        afternoon: { $and: [{ $gte: ['$schedules.startTime', '12:00'] }, { $lte: ['$schedules.startTime', '16:00'] }, { $lte: ['$schedules.endTime', '16:00'] }] },
        evening:   { $and: [{ $gte: ['$schedules.startTime', '16:00'] }, { $lte: ['$schedules.startTime', '20:00'] }, { $lte: ['$schedules.endTime', '20:00'] }] },
        night:     { $and: [{ $gte: ['$schedules.startTime', '20:00'] }, { $lte: ['$schedules.endTime',   '23:59'] }] },
      };
      for (const cat of scheduleCategories) {
        const expr = LOOKUP_BAND_EXPRS[cat];
        if (expr) orConditions.push({ $expr: expr });
      }
      if (exactTimes.length > 0) {
        orConditions.push({ 'schedules.startTime': { $in: exactTimes } });
      }

      if (orConditions.length > 0) {
        pipeline.push(
          {
            $lookup: {
              from: 'doctorschedules',
              let: { doctorId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$doctor', '$$doctorId'] } } },
                { $unwind: '$schedules' },
                { $match: orConditions.length === 1 ? orConditions[0] : { $or: orConditions } },
                { $limit: 1 },
              ],
              as: '_schedMatch',
            },
          },
          { $match: { '_schedMatch.0': { $exists: true } } },
          { $unset: '_schedMatch' },
        );
      }
    }

    if (filters.consultationType) {
      pipeline.push(
        {
          $lookup: {
            from: 'doctorschedules',
            let: { doctorId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$doctor', '$$doctorId'] } } },
              { $match: { consultationTypes: filters.consultationType } },
              { $limit: 1 },
            ],
            as: '_ctMatch',
          },
        },
        { $match: { '_ctMatch.0': { $exists: true } } },
        { $unset: '_ctMatch' },
      );
    }

    // Build facet data pipeline — post-filter hospitalSchedules when time band is active
    const sortField =
      filters.sort === 'rating_desc' ? { rating: -1 } :
      filters.sort === 'experience_desc' ? { years_of_experience: -1 } :
      { name: 1 };
    const facetDataPipeline: any[] = [
      { $sort: sortField },
      { $skip: skip },
      { $limit: limit },
      ...schedulesLookup,
    ];

    if (scheduleCategories.length > 0) {
      const bandExprs = scheduleCategories
        .map(cat => TIME_BAND_EXPRS[cat])
        .filter(Boolean);
      if (bandExprs.length > 0) {
        const bandCond = bandExprs.length === 1 ? bandExprs[0] : { $or: bandExprs };
        facetDataPipeline.push({
          $addFields: {
            hospitalSchedules: {
              $map: {
                input: {
                  $filter: {
                    input: '$hospitalSchedules',
                    as: 'hs',
                    cond: {
                      $gt: [
                        {
                          $size: {
                            $filter: {
                              input: { $ifNull: ['$$hs.schedules', []] },
                              as: 's',
                              cond: bandCond,
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                },
                as: 'hs',
                in: {
                  $mergeObjects: [
                    '$$hs',
                    {
                      schedules: {
                        $filter: {
                          input: { $ifNull: ['$$hs.schedules', []] },
                          as: 's',
                          cond: bandCond,
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        });
      }
    }

    const fieldsProj = parseFieldsProjection(filters.fields as string | undefined);
    facetDataPipeline.push(...populateLookups, { $project: fieldsProj ?? { password: 0 } });

    pipeline.push({
      $facet: {
        data: facetDataPipeline,
        total: [{ $count: 'count' }],
      },
    });

    const [result] = await Doctor.aggregate(pipeline);
    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;
    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetById(idOrSlug: string) {
    const [doc] = await Doctor.aggregate([
      { $match: buildMatchCriteria(idOrSlug) },
      ...schedulesLookup,
      ...homeScheduleLookup,
      ...populateLookups,
      { $project: { password: 0 } },
    ]);
    return doc ?? null;
  }

  static async GetDoctorHospitals(id: string) {
    const doctor = await Doctor.findOne(buildMatchCriteria(id)).select('_id').lean();
    if (!doctor) return [];
    return await DoctorSchedules.aggregate([
      { $match: { doctor: doctor._id } },
      {
        $lookup: {
          from: 'hospitals',
          localField: 'hospital',
          foreignField: '_id',
          as: 'hospital',
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      { $unwind: '$hospital' },
      { $group: { _id: '$hospital._id', name: { $first: '$hospital.name' } } },
      { $project: { _id: 1, name: 1 } },
    ]);
  }

  static async GetRelated(idOrSlug: string, limit = 4) {
    const doctor = await Doctor.findOne(buildMatchCriteria(idOrSlug)).select('_id specializations');
    if (!doctor || !doctor.specializations.length) return [];

    return await Doctor.aggregate([
      {
        $match: {
          _id: { $ne: doctor._id },
          specializations: { $in: doctor.specializations },
        },
      },
      ...homeScheduleLookup,
      ...schedulesLookup,
      ...populateLookups,
      { $project: { password: 0, faqs: 0, publications: 0, awards: 0, videos: 0 } },
      { $limit: limit },
    ]);
  }

  static async GetAvailableSlots(idOrSlug: string, query: any) {
    const { date, scheduleId } = query;
    if (!date || !scheduleId) throw new Error('date and scheduleId are required');

    const scheduleDoc = await DoctorSchedules.findById(scheduleId).select('doctor hospital schedules');
    if (!scheduleDoc) throw new Error('Schedule not found');

    const targetDate = new Date(date);
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    const daySchedule = (scheduleDoc.schedules as any[]).find(
      (s) => s.day === dayName && s.isAvailable
    );
    if (!daySchedule) return { slots: [], available: 0, booked: 0, total: 0 };

    const allSlots = generateSlots(daySchedule.startTime, daySchedule.endTime);

    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: scheduleDoc.doctor,
      hospital: scheduleDoc.hospital,
      appointmentDate: { $gte: dayStart, $lte: dayEnd },
      status: { $nin: ['Cancelled'] },
    }).select('selectedSchedule');

    const bookedStartTimes = new Set(
      bookedAppointments.map((a) => (a.selectedSchedule as any).startTime?.trim())
    );

    const availableSlots = allSlots.filter((slot) => !bookedStartTimes.has(slotToStartTime(slot)));

    return {
      slots: availableSlots,
      available: availableSlots.length,
      booked: allSlots.length - availableSlots.length,
      total: allSlots.length,
    };
  }

  static async Update(id: string, payload: any) {
    if (payload.password) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
    }
    return await Doctor.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await Doctor.findByIdAndDelete(id);
  }

  static async GetFilters() {
    const [consultationTypes, languages, timeSlots, genders] = await Promise.all([
      DoctorSchedules.aggregate([
        { $unwind: '$consultationTypes' },
        { $group: { _id: '$consultationTypes' } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, name: '$_id' } },
      ]),
      DoctorSchedules.aggregate([
        { $unwind: '$languages' },
        { $group: { _id: '$languages' } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, name: '$_id' } },
      ]),
      DoctorSchedules.aggregate([
        { $unwind: '$schedules' },
        { $match: { 'schedules.isAvailable': { $ne: false } } },
        {
          $group: {
            _id: { startTime: '$schedules.startTime', endTime: '$schedules.endTime' },
          },
        },
        { $sort: { '_id.startTime': 1 } },
        { $project: { _id: 0, startTime: '$_id.startTime', endTime: '$_id.endTime' } },
      ]),
      Doctor.aggregate([
        { $match: { gender: { $exists: true, $nin: [null, ''] } } },
        { $group: { _id: '$gender' } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, name: '$_id' } },
      ]),
    ]);
    const STANDARD_CONSULTATION_TYPES = ['IN_PREMISES', 'VIRTUAL', 'HOME_VISIT'];
    const dbConsultationTypes = consultationTypes.map((c: { name: string }) => c.name);
    const allConsultationTypes = [...new Set([...STANDARD_CONSULTATION_TYPES, ...dbConsultationTypes])];

    return {
      consultationTypes: allConsultationTypes,
      languages: languages.map((l: { name: string }) => l.name),
      timeSlots: timeSlots as { startTime: string; endTime: string }[],
      genders: ['Male', 'Female'],
    };
  }
}

export default DoctorService;
