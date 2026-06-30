import mongoose from 'mongoose';
import DoctorSchedule from './DoctorSchedules.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class DoctorScheduleService {
  static async Create(payload: any) {
    return await DoctorSchedule.create(payload);
  }

  static async GetAll(filters: Record<string, unknown> = {}) {
    const { page, limit, skip } = parsePagination(filters);
    
    const query: Record<string, unknown> = { ...filters };
    delete query.page; delete query.limit;

    const [data, total] = await Promise.all([
      DoctorSchedule.find(query)
        .populate({ path: 'doctor', populate: { path: 'specializations' } })
        .populate('hospital')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      DoctorSchedule.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetByHospital(hospitalId: string, filters: Record<string, unknown> = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const search = filters.search as string | undefined;

    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = DAYS[new Date().getDay()];

    let hospitalObjectId: mongoose.Types.ObjectId;
    try {
      hospitalObjectId = new mongoose.Types.ObjectId(hospitalId as string);
    } catch {
      return { data: [], meta: buildMeta(0, page, limit) };
    }

    const basePipeline: any[] = [
      { $match: { hospital: hospitalObjectId } },
    ];

    // Schedule-level filters (before doctor lookup for efficiency)
    if (filters.consultationType) {
      basePipeline.push({ $match: { consultationTypes: filters.consultationType } });
    }
    if (filters.status) {
      basePipeline.push({ $match: { status: filters.status } });
    }
    if (filters.minFee !== undefined) {
      basePipeline.push({ $match: { consultationFee: { $gte: Number(filters.minFee) } } });
    }
    if (filters.maxFee !== undefined) {
      basePipeline.push({ $match: { consultationFee: { $lte: Number(filters.maxFee) } } });
    }

    basePipeline.push(
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'specialities',
          localField: 'doctor.specializations',
          foreignField: '_id',
          as: 'doctor.specializations',
        },
      },
    );

    // Doctor-level filters (after doctor lookup)
    if (filters.gender) {
      basePipeline.push({ $match: { 'doctor.gender': filters.gender } });
    }
    if (filters.minExperience !== undefined) {
      basePipeline.push({ $match: { 'doctor.years_of_experience': { $gte: Number(filters.minExperience) } } });
    }
    if (filters.maxExperience !== undefined) {
      basePipeline.push({ $match: { 'doctor.years_of_experience': { $lte: Number(filters.maxExperience) } } });
    }
    if (filters.specialty) {
      try {
        basePipeline.push({
          $match: { 'doctor.specializations._id': new mongoose.Types.ObjectId(filters.specialty as string) },
        });
      } catch { /* invalid ObjectId — skip filter */ }
    }

    if (search) {
      basePipeline.push({
        $match: {
          $or: [
            { 'doctor.name': { $regex: search, $options: 'i' } },
            { 'doctor.specializations.name': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    const todayIdx = new Date().getDay(); // 0=Sun … 6=Sat
    const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    basePipeline.push({
      $addFields: {
        isAvailableToday: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: { $ifNull: ['$schedules', []] },
                  as: 'slot',
                  cond: {
                    $and: [
                      { $eq: ['$$slot.day', todayName] },
                      { $eq: ['$$slot.isAvailable', true] },
                    ],
                  },
                },
              },
            },
            0,
          ],
        },
        // Next available slot ordered from today forward, wrapping around the week
        nextAvailableSchedule: {
          $ifNull: [
            {
              $first: {
                $sortArray: {
                  input: {
                    $map: {
                      input: {
                        $filter: {
                          input: { $ifNull: ['$schedules', []] },
                          as: 's',
                          cond: { $eq: ['$$s.isAvailable', true] },
                        },
                      },
                      as: 's',
                      in: {
                        $mergeObjects: [
                          '$$s',
                          {
                            _offset: {
                              $mod: [
                                {
                                  $add: [
                                    { $subtract: [{ $indexOfArray: [DAY_NAMES, '$$s.day'] }, todayIdx] },
                                    7,
                                  ],
                                },
                                7,
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                  sortBy: { _offset: 1 },
                },
              },
            },
            { $first: { $ifNull: ['$schedules', []] } },
          ],
        },
      },
    });

    if (filters.isAvailableToday === 'true') {
      basePipeline.push({ $match: { isAvailableToday: true } });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaySerialLookup: any[] = [
      {
        $lookup: {
          from: 'appointments',
          let: { doctorId: '$doctor._id', hospitalId: '$hospital' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$doctor', '$$doctorId'] },
                    { $eq: ['$hospital', '$$hospitalId'] },
                    { $gte: ['$appointmentDate', todayStart] },
                    { $lte: ['$appointmentDate', todayEnd] },
                    { $ne: ['$status', 'Cancelled'] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: '_todayApts',
        },
      },
      {
        $addFields: {
          todaySerialCount: { $ifNull: [{ $arrayElemAt: ['$_todayApts.count', 0] }, 0] },
          todaySerialTotal: '$serialPerDay',
        },
      },
      { $unset: '_todayApts' },
    ];

    const [countResult, data] = await Promise.all([
      DoctorSchedule.aggregate([...basePipeline, { $count: 'count' }]),
      DoctorSchedule.aggregate([
        ...basePipeline,
        { $sort: { isAvailableToday: -1, updatedAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        ...todaySerialLookup,
      ]),
    ]);

    const total = countResult[0]?.count ?? 0;
    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetFilterOptions(hospitalId: string) {
    let hospitalObjectId: mongoose.Types.ObjectId;
    try {
      hospitalObjectId = new mongoose.Types.ObjectId(hospitalId);
    } catch {
      return { consultationTypes: [], genders: [], feeRanges: [], experienceRanges: [] };
    }

    const result = await DoctorSchedule.aggregate([
      { $match: { hospital: hospitalObjectId } },
      { $lookup: { from: 'doctors', localField: 'doctor', foreignField: '_id', as: 'doctor' } },
      { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          consultationTypes: [
            { $unwind: { path: '$consultationTypes', preserveNullAndEmptyArrays: false } },
            { $group: { _id: '$consultationTypes' } },
            { $sort: { _id: 1 } },
          ],
          genders: [
            { $group: { _id: '$doctor.gender' } },
            { $match: { _id: { $ne: null } } },
            { $sort: { _id: 1 } },
          ],
          feeStats: [
            { $match: { consultationFee: { $exists: true, $ne: null } } },
            { $group: { _id: null, min: { $min: '$consultationFee' }, max: { $max: '$consultationFee' } } },
          ],
          expStats: [
            { $match: { 'doctor.years_of_experience': { $exists: true, $ne: null } } },
            { $group: { _id: null, min: { $min: '$doctor.years_of_experience' }, max: { $max: '$doctor.years_of_experience' } } },
          ],
        },
      },
    ]);

    const r = result[0] ?? {};

    // Always return complete domain-standard values; merge with any extra DB values
    const STANDARD_CONSULTATION_TYPES = ['IN_PREMISES', 'VIRTUAL', 'HOME_VISIT'];
    const dbConsultationTypes: string[] = ((r.consultationTypes ?? []) as any[]).map((x) => x._id).filter(Boolean);
    const consultationTypes = [...new Set([...STANDARD_CONSULTATION_TYPES, ...dbConsultationTypes])];

    // Always return both genders — domain set is fixed
    const genders = ['Male', 'Female'];

    // Always use standard fee buckets covering common BD healthcare fee ranges
    const feeRanges: Array<{ label: string; min: number | null; max: number | null }> = [
      { label: 'Under ৳500', min: null, max: 500 },
      { label: '৳500–800', min: 500, max: 800 },
      { label: '৳800–1000', min: 800, max: 1000 },
      { label: '৳1000+', min: 1000, max: null },
    ];

    const expMax: number | null = r.expStats?.[0]?.max ?? null;
    const EXP_PRESETS = [
      { label: '1–5 years', min: 1, max: 5 },
      { label: '5–10 years', min: 5, max: 10 as number | null },
      { label: '10+ years', min: 10, max: null as number | null },
    ];
    const experienceRanges = expMax !== null
      ? EXP_PRESETS.filter((r) => r.min < expMax)
      : EXP_PRESETS;

    return { consultationTypes, genders, feeRanges, experienceRanges };
  }

  static async GetByDoctor(doctorId: string, filters: Record<string, unknown> = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const query = { doctor: doctorId };

    const [data, total] = await Promise.all([
      DoctorSchedule.find(query)
        .populate('hospital')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      DoctorSchedule.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async Update(id: string, payload: any) {
    return await DoctorSchedule.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await DoctorSchedule.findByIdAndDelete(id);
  }
}

export default DoctorScheduleService;
