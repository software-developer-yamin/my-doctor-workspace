import mongoose from 'mongoose';
import Ambulance from './Ambulances.model.js';
import BdLocationService from '../bd-locations/BdLocations.service.js';
import BdLocation from '../bd-locations/BdLocations.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class AmbulanceService {
  static async Create(payload: any) {
    return await Ambulance.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const query: any = {};

    if (filters.search) {
      const safeSearch = escapeRegex(filters.search as string);
      const matchingLocations = await BdLocation.find(
        { $or: [{ district: { $regex: safeSearch, $options: 'i' } }, { upazila: { $regex: safeSearch, $options: 'i' } }] }, '_id'
      );
      const locationOrClause = matchingLocations.length > 0
        ? [{ bdLocation: { $in: matchingLocations.map((l) => l._id) } }]
        : [];
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { ambulance_number: { $regex: safeSearch, $options: 'i' } },
        { driving_license_number: { $regex: safeSearch, $options: 'i' } },
        { phone: { $regex: safeSearch, $options: 'i' } },
        ...locationOrClause,
      ];
    }

    if (filters.district || filters.upazila) {
      const ids = await BdLocationService.ResolveToIds(filters.district as string, filters.upazila as string);
      if (ids.length) query.bdLocation = { $in: ids };
      else if (filters.district) query.bdLocation = { $in: [] };
    } else if (filters.bdLocation) {
      query.bdLocation = new mongoose.Types.ObjectId(filters.bdLocation as string);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.ambulance_type = filters.type;
    }

    const [data, total] = await Promise.all([
      Ambulance.find(query)
        .populate('bdLocation', 'district upazila')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Ambulance.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetById(id: string) {
    return await Ambulance.findById(id).populate('bdLocation', 'district upazila');
  }

  static async Update(id: string, payload: any) {
    return await Ambulance.findByIdAndUpdate(id, payload, { new: true }).populate('bdLocation', 'district upazila');
  }

  static async Delete(id: string) {
    return await Ambulance.findByIdAndDelete(id);
  }

  static async GetFilters() {
    const types = await Ambulance.aggregate([
      { $match: { ambulance_type: { $exists: true, $ne: null } } },
      { $group: { _id: '$ambulance_type' } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: '$_id' } },
    ]);
    return {
      types: types.map((t: { name: string }) => t.name),
    };
  }
}

export default AmbulanceService;
