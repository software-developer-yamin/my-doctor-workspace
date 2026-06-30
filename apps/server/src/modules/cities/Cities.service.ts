import City from './Cities.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

const statsLookup = [
  {
    $lookup: {
      from: 'hospitals',
      localField: '_id',
      foreignField: 'city',
      as: '_hospitals',
    },
  },
  {
    $lookup: {
      from: 'ambulances',
      localField: '_id',
      foreignField: 'city',
      as: '_ambulances',
    },
  },
  {
    $lookup: {
      from: 'labs',
      localField: '_id',
      foreignField: 'city',
      as: '_labs',
    },
  },
  {
    $addFields: {
      hospitalsCount: { $size: '$_hospitals' },
      ambulancesCount: { $size: '$_ambulances' },
      labsCount: { $size: '$_labs' },
    },
  },
  { $unset: ['_hospitals', '_ambulances', '_labs'] },
];

class CityService {
  static async Create(name: string) {
    return await City.create({ name });
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const match: any = {};
    if (filters.search) {
      match.name = { $regex: filters.search, $options: 'i' };
    }

    const [result] = await City.aggregate([
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

  static async Update(id: string, name: string) {
    return await City.findByIdAndUpdate(id, { name }, { new: true });
  }

  static async Delete(id: string) {
    return await City.findByIdAndDelete(id);
  }
}

export default CityService;
