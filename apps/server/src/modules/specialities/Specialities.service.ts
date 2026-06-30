import Speciality from './Specialities.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

const statsLookup = [
  {
    $lookup: {
      from: 'doctors',
      localField: '_id',
      foreignField: 'specializations',
      as: '_doctors',
    },
  },
  {
    $lookup: {
      from: 'hospitals',
      localField: '_id',
      foreignField: 'specialities',
      as: '_hospitals',
    },
  },
  {
    $addFields: {
      doctorsCount: { $size: '$_doctors' },
      hospitalsCount: { $size: '$_hospitals' },
    },
  },
  { $unset: ['_doctors', '_hospitals'] },
];

class SpecialityService {
  static async Create(payload: { name: string; image?: string }) {
    return await Speciality.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const match: any = {};
    if (filters.search) {
      match.name = { $regex: filters.search, $options: 'i' };
    }

    const [result] = await Speciality.aggregate([
      { $match: match },
      {
        $facet: {
          data: [
            { $sort: { name: 1 } },
            { $skip: skip },
            { $limit: limit },
            ...statsLookup,
          ],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async Update(id: string, payload: { name: string; image?: string }) {
    return await Speciality.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await Speciality.findByIdAndDelete(id);
  }
}

export default SpecialityService;
