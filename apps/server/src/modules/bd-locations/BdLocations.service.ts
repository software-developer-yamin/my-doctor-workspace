import BdLocation from './BdLocations.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class BdLocationService {
  static async Create(district: string, upazila: string) {
    const d = district.trim();
    const u = upazila.trim();
    return await BdLocation.findOneAndUpdate(
      { district: d, upazila: u },
      { $setOnInsert: { district: d, upazila: u } },
      { upsert: true, new: true }
    );
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);
    const match: any = {};
    if (filters.search) {
      match.$or = [
        { district: { $regex: filters.search, $options: 'i' } },
        { upazila: { $regex: filters.search, $options: 'i' } },
      ];
    }
    if (filters.district) match.district = { $regex: `^${filters.district}$`, $options: 'i' };

    const [result] = await BdLocation.aggregate([
      { $match: match },
      {
        $facet: {
          data: [{ $sort: { district: 1, upazila: 1 } }, { $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;
    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetGrouped(): Promise<Array<{ district: string; upazilas: string[] }>> {
    const result = await BdLocation.aggregate([
      { $match: { district: { $exists: true, $nin: [null, ''] } } },
      { $group: { _id: '$district', upazilas: { $push: '$upazila' } } },
      { $project: { _id: 0, district: '$_id', upazilas: { $filter: { input: '$upazilas', as: 'u', cond: { $and: [{ $ne: ['$$u', null] }, { $ne: ['$$u', ''] }] } } } } },
      { $sort: { district: 1 } },
    ]);
    return result;
  }

  static async GetDistricts(): Promise<string[]> {
    const districts = await BdLocation.distinct('district');
    return districts.sort();
  }

  static async GetUpazilasByDistrict(district: string) {
    return await BdLocation.find(
      { district: { $regex: `^${district}$`, $options: 'i' } },
      { _id: 1, district: 1, upazila: 1 }
    ).sort({ upazila: 1 });
  }

  static async FindOrCreate(district: string, upazila: string) {
    const d = district.trim();
    const u = upazila.trim();
    return await BdLocation.findOneAndUpdate(
      { district: d, upazila: u },
      { $setOnInsert: { district: d, upazila: u } },
      { upsert: true, new: true }
    );
  }

  static async ResolveToIds(district: string, upazila?: string): Promise<import('mongoose').Types.ObjectId[]> {
    if (district && upazila) {
      const loc = await BdLocation.findOne(
        { district: { $regex: `^${district}$`, $options: 'i' }, upazila: { $regex: `^${upazila}$`, $options: 'i' } },
        { _id: 1 }
      ).lean();
      return loc ? [loc._id as import('mongoose').Types.ObjectId] : [];
    }
    if (district) {
      const locs = await BdLocation.find(
        { district: { $regex: `^${district}$`, $options: 'i' } },
        { _id: 1 }
      ).lean();
      return locs.map(l => l._id as import('mongoose').Types.ObjectId);
    }
    return [];
  }

  static async BulkSeed(locations: { district: string; upazila: string }[]) {
    if (!locations.length) return null;
    const ops = locations.map(({ district, upazila }) => ({
      updateOne: {
        filter: { district, upazila },
        update: { $set: { district, upazila } },
        upsert: true,
      },
    }));
    return await BdLocation.bulkWrite(ops, { ordered: false });
  }

  static async Update(id: string, payload: { district?: string; upazila?: string }) {
    return await BdLocation.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await BdLocation.findByIdAndDelete(id);
  }
}

export default BdLocationService;
