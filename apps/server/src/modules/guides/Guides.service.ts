import mongoose from 'mongoose';
import Guide from './Guides.model.js';
import BdLocationService from '../bd-locations/BdLocations.service.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

class GuideService {
  static async Create(payload: any) {
    return await Guide.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const query: any = {};
    if (filters.district || filters.upazila) {
      const ids = await BdLocationService.ResolveToIds(filters.district as string, filters.upazila as string);
      if (ids.length) query.bdLocation = { $in: ids };
      else if (filters.district) query.bdLocation = { $in: [] };
    } else if (filters.bdLocation) {
      query.bdLocation = new mongoose.Types.ObjectId(filters.bdLocation as string);
    }
    if (filters.hospital) query.hospital = filters.hospital;
    if (filters.status) query.status = filters.status;
    else query.status = 'Active';
    if (filters.language) query.languages = filters.language;
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { about: { $regex: filters.search, $options: 'i' } },
        { expertise: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const sort: any = {};
    if (filters.sort === 'rating') sort.rating = -1;
    else if (filters.sort === 'experience') sort.yearsOfExperience = -1;
    else sort.isFeatured = -1;

    const [data, total] = await Promise.all([
      Guide.find(query)
        .populate('hospital', 'name address logo')
        .populate('bdLocation', 'district upazila')
        .sort({ ...sort, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Guide.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetById(idOrSlug: string) {
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isId ? { _id: idOrSlug } : { slug: idOrSlug };
    return await Guide.findOne(query)
      .populate('hospital', 'name address logo phone')
      .populate('bdLocation', 'district upazila');
  }

  static async GetFilters() {
    const [languages, bdLocations] = await Promise.all([
      Guide.distinct('languages', { status: 'Active' }),
      Guide.distinct('bdLocation', { status: 'Active' }),
    ]);
    return { languages, bdLocations };
  }

  static async Update(id: string, payload: any) {
    return await Guide.findByIdAndUpdate(id, payload, { new: true })
      .populate('hospital', 'name address logo')
      .populate('bdLocation', 'district upazila');
  }

  static async Delete(id: string) {
    return await Guide.findByIdAndDelete(id);
  }
}

export default GuideService;
