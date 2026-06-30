import mongoose from 'mongoose';
import Hospital from './Hospitals.model.js';
import HospitalReview from './HospitalReview.model.js';
import BdLocationService from '../bd-locations/BdLocations.service.js';
import BdLocation from '../bd-locations/BdLocations.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';
import { parseAddress } from '../../utils/bdData.js';

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const HOSPITAL_PUBLIC_FIELDS = new Set([
  '_id','slug','name','logo','address','bdLocation','specialities','type','stats',
  'rating','totalReviews','isEmergencyAvailable','openingHours','hotline','contactNumber',
  'avgConsultationFee','updatedAt','createdAt',
]);

function parseFieldsProjection(fields?: string): Record<string, 1> | null {
  if (!fields) return null;
  const proj: Record<string, 1> = {};
  for (const f of fields.split(',').map((s) => s.trim())) {
    if (HOSPITAL_PUBLIC_FIELDS.has(f)) proj[f] = 1;
  }
  return Object.keys(proj).length ? proj : null;
}

const doctorCountLookup = [
  {
    $lookup: {
      from: 'doctorschedules',
      localField: '_id',
      foreignField: 'hospital',
      as: '_schedules',
    },
  },
  {
    $addFields: {
      'stats.doctorsCount': { $size: { $setUnion: ['$_schedules.doctor', []] } },
      'stats.avgWaitingTime': {
        $cond: [
          { $gt: [{ $size: '$_schedules' }, 0] },
          { $avg: '$_schedules.avgWaitingTime' },
          null,
        ],
      },
      avgConsultationFee: {
        $cond: [
          { $gt: [{ $size: '$_schedules' }, 0] },
          { $avg: '$_schedules.consultationFee' },
          0,
        ],
      },
    },
  },
  { $unset: '_schedules' },
];

const populateLookups = [
  {
    $lookup: {
      from: 'specialities',
      localField: 'specialities',
      foreignField: '_id',
      as: 'specialities',
    },
  },
  {
    $lookup: {
      from: 'bdlocations',
      localField: 'bdLocation',
      foreignField: '_id',
      as: 'bdLocation',
    },
  },
  { $unwind: { path: '$bdLocation', preserveNullAndEmptyArrays: true } },
];

async function resolveBdLocationIds(district?: string, upazila?: string): Promise<mongoose.Types.ObjectId[]> {
  if (!district) return [];
  return BdLocationService.ResolveToIds(district, upazila);
}

class HospitalService {
  static async Create(payload: any) {
    if (payload.district) {
      const loc = await BdLocationService.FindOrCreate(payload.district, payload.upazila || '');
      payload.bdLocation = loc._id;
    } else if (payload.address && !payload.bdLocation) {
      const { district, upazila } = parseAddress(payload.address);
      if (district && upazila) {
        const loc = await BdLocationService.FindOrCreate(district, upazila);
        payload.bdLocation = loc._id;
      }
    }
    return await Hospital.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const match: any = {};

    if (filters.search) {
      const safeSearch = escapeRegex(filters.search as string);
      const matchingLocations = await BdLocation.find(
        { $or: [{ district: { $regex: safeSearch, $options: 'i' } }, { upazila: { $regex: safeSearch, $options: 'i' } }] }, '_id'
      );
      const locationOrClause = matchingLocations.length > 0
        ? [{ bdLocation: { $in: matchingLocations.map((l) => l._id) } }]
        : [];
      match.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { address: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { hotline: { $regex: safeSearch, $options: 'i' } },
        { services: { $regex: safeSearch, $options: 'i' } },
        ...locationOrClause,
      ];
    }

    if (filters.district || filters.upazila) {
      const ids = await resolveBdLocationIds(filters.district as string, filters.upazila as string);
      if (ids.length) match.bdLocation = { $in: ids };
      else if (filters.district) match.bdLocation = { $in: [] };
    } else if (filters.bdLocation) {
      match.bdLocation = new mongoose.Types.ObjectId(filters.bdLocation as string);
    }
    if (filters.speciality) {
      const specList = Array.isArray(filters.speciality) ? filters.speciality : [filters.speciality];
      match.specialities = { $in: specList.map((id: string) => new mongoose.Types.ObjectId(id)) };
    }
    if (filters.availability === '24_7') match.isEmergencyAvailable = true;
    if (filters.availability === 'open_now') match.openingHours = { $exists: true, $not: { $size: 0 } };
    if (filters.type) match.type = filters.type;
    if (filters.isEmergency === 'true') match.isEmergency = true;
    if (filters.hasICU === 'true') match['stats.icuBeds'] = { $gt: 0 };

    const { page, limit, skip } = parsePagination(filters);

    const sortRaw = (filters.sort || filters.sortBy) as string | undefined;
    const sortBy = sortRaw === 'rating_desc' ? 'rating'
      : sortRaw === 'doctors_desc' ? 'doctors'
      : sortRaw === 'beds_desc' ? 'beds'
      : sortRaw; // allow legacy bare values too
    const sortStage: { $sort: Record<string, 1 | -1> } = sortBy === 'rating'
      ? { $sort: { rating: -1, updatedAt: -1 } }
      : sortBy === 'doctors'
      ? { $sort: { 'stats.doctorsCount': -1, updatedAt: -1 } }
      : sortBy === 'beds'
      ? { $sort: { 'stats.totalBeds': -1, updatedAt: -1 } }
      : { $sort: { updatedAt: -1 } };

    const fieldsProj = parseFieldsProjection(filters.fields as string | undefined);
    const dataProjection = fieldsProj ? [{ $project: fieldsProj }] : [];

    // When sorting by doctorsCount (computed field), run doctorCountLookup before facet
    const [result] = sortBy === 'doctors'
      ? await Hospital.aggregate([
          { $match: match },
          ...doctorCountLookup,
          {
            $facet: {
              data: [sortStage, { $skip: skip }, { $limit: limit }, ...populateLookups, ...dataProjection],
              total: [{ $count: 'count' }],
            },
          },
        ])
      : await Hospital.aggregate([
          { $match: match },
          {
            $facet: {
              data: [sortStage, { $skip: skip }, { $limit: limit }, ...doctorCountLookup, ...populateLookups, ...dataProjection],
              total: [{ $count: 'count' }],
            },
          },
        ]);

    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetById(id: string) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const match = isObjectId ? { _id: new mongoose.Types.ObjectId(id) } : { slug: id };

    const [doc] = await Hospital.aggregate([
      { $match: match },
      ...doctorCountLookup,
      ...populateLookups,
    ]);
    return doc ?? null;
  }

  static async Update(id: string, payload: any) {
    if (payload.district) {
      const loc = await BdLocationService.FindOrCreate(payload.district, payload.upazila || '');
      payload.bdLocation = loc._id;
    } else if (payload.address) {
      const existing = await Hospital.findById(id).select('bdLocation').lean();
      if (!payload.bdLocation && !existing?.bdLocation) {
        const { district, upazila } = parseAddress(payload.address);
        if (district && upazila) {
          const loc = await BdLocationService.FindOrCreate(district, upazila);
          payload.bdLocation = loc._id;
        }
      }
    }
    return await Hospital.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await Hospital.findByIdAndDelete(id);
  }

  static async GetFilters(filters: any = {}) {
    const nameMatch: any = { name: { $ne: '' } };
    if (filters.search) {
      nameMatch.name = { $regex: escapeRegex(filters.search as string), $options: 'i' };
    }

    const [specialities, types] = await Promise.all([
      Hospital.aggregate([
        { $match: { specialities: { $exists: true, $not: { $size: 0 } } } },
        { $unwind: '$specialities' },
        { $group: { _id: '$specialities' } },
        {
          $lookup: {
            from: 'specialities',
            localField: '_id',
            foreignField: '_id',
            as: 'info',
          },
        },
        { $unwind: { path: '$info', preserveNullAndEmptyArrays: true } },
        { $project: { _id: '$_id', name: { $ifNull: ['$info.name', ''] } } },
        { $match: nameMatch },
        { $sort: { name: 1 } },
      ]),
      Hospital.aggregate([
        { $match: { type: { $exists: true, $nin: [null, ''] } } },
        { $group: { _id: '$type' } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, name: '$_id' } },
      ]),
    ]);
    return {
      specialities: specialities.map((s: { _id: any; name: string }) => ({
        _id: s._id.toString(),
        name: s.name,
      })),
      types: types.map((t: { name: string }) => t.name),
    };
  }

  static async GetReviews(hospitalId: string, filters: any = {}) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(hospitalId);
    let hospital: any = null;

    if (isObjectId) {
      hospital = await Hospital.findById(hospitalId).select('_id').lean();
    } else {
      hospital = await Hospital.findOne({ slug: hospitalId }).select('_id').lean();
    }

    if (!hospital) return { data: [], meta: buildMeta(0, 1, 10) };

    const { page, limit, skip } = parsePagination(filters);

    const [reviews, total] = await Promise.all([
      HospitalReview.find({ hospital: hospital._id, isApproved: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      HospitalReview.countDocuments({ hospital: hospital._id, isApproved: true }),
    ]);

    return { data: reviews, meta: buildMeta(total, page, limit) };
  }

  static async CreateReview(hospitalId: string, payload: any) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(hospitalId);
    let hospital: any = null;

    if (isObjectId) {
      hospital = await Hospital.findById(hospitalId).select('_id rating totalReviews').lean();
    } else {
      hospital = await Hospital.findOne({ slug: hospitalId }).select('_id rating totalReviews').lean();
    }

    if (!hospital) throw new Error('Hospital not found');

    const review = await HospitalReview.create({
      hospital: hospital._id,
      patientName: payload.patientName,
      rating: payload.rating,
      text: payload.text,
    });

    // Recompute rating from all approved reviews
    const [agg] = await HospitalReview.aggregate([
      { $match: { hospital: hospital._id, isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (agg) {
      await Hospital.findByIdAndUpdate(hospital._id, {
        rating: Math.round(agg.avgRating * 10) / 10,
        totalReviews: agg.count,
      });
    }

    return review;
  }
}

export default HospitalService;
