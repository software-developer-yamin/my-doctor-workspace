import mongoose from 'mongoose';
import DiagnosticTest from './DiagnosticTests.model.js';
import LabTest from '../labs/LabTests.model.js';
import Lab from '../labs/Labs.model.js';
import BdLocationService from '../bd-locations/BdLocations.service.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

const diagnosticTestPipeline = [
  {
    $lookup: {
      from: 'labtests',
      localField: '_id',
      foreignField: 'test',
      as: '_labTests',
    },
  },
  {
    $addFields: {
      minLabPrice: {
        $cond: {
          if: { $gt: [{ $size: '$_labTests' }, 0] },
          then: { $min: '$_labTests.price' },
          else: '$price_start_from',
        },
      },
      labsCount: { $size: '$_labTests' },
    },
  },
  { $unset: '_labTests' },
];

class DiagnosticTestService {
  static async Create(payload: any) {
    return await DiagnosticTest.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const match: any = {};

    if (filters.search) {
      match.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { category: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.category) {
      match.category = { $regex: filters.category, $options: 'i' };
    }

    if (filters.isHomeSampleCollectionAvailable === 'true' || filters.isHomeSampleCollectionAvailable === true) {
      match.isHomeSampleCollectionAvailable = true;
    }

    // Filter tests by location: only tests offered by labs in that district/upazila
    const locationFilter = filters.district || filters.bdLocation;
    if (locationFilter) {
      let locationIds: mongoose.Types.ObjectId[];
      if (filters.district) {
        locationIds = await BdLocationService.ResolveToIds(filters.district as string, filters.upazila as string);
      } else {
        locationIds = [new mongoose.Types.ObjectId(filters.bdLocation as string)];
      }
      const labsInDistrict = await Lab.find(
        { bdLocation: { $in: locationIds } },
        { _id: 1 }
      ).lean();
      const labIds = labsInDistrict.map((l: any) => l._id);
      const labTests = await LabTest.find(
        { lab: { $in: labIds } },
        { test: 1 }
      ).lean();
      const testIds = [
        ...new Set(labTests.map((lt: any) => lt.test.toString())),
      ].map((id) => new mongoose.Types.ObjectId(id));
      match._id = { $in: testIds };
    }

    let sort: any = { name: 1 };
    if (filters.sort === 'price_asc') sort = { price_start_from: 1 };
    else if (filters.sort === 'price_desc') sort = { price_start_from: -1 };
    else if (filters.sort === 'newest') sort = { createdAt: -1 };

    const [result] = await DiagnosticTest.aggregate([
      { $match: match },
      {
        $facet: {
          data: [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            ...diagnosticTestPipeline,
          ],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async GetById(id: string) {
    const [doc] = await DiagnosticTest.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      ...diagnosticTestPipeline,
    ]);
    return doc ?? null;
  }

  static async Update(id: string, payload: any) {
    return await DiagnosticTest.findByIdAndUpdate(id, payload, { new: true });
  }

  static async Delete(id: string) {
    return await DiagnosticTest.findByIdAndDelete(id);
  }

  static async GetFilters() {
    const categories = await DiagnosticTest.aggregate([
      { $match: { category: { $exists: true, $ne: null, $nin: ['', null] } } },
      { $group: { _id: '$category' } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: '$_id' } },
    ]);
    return {
      categories: categories.map((c: { name: string }) => c.name),
    };
  }
}

export default DiagnosticTestService;
