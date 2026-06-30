import mongoose from 'mongoose';
import Lab from './Labs.model.js';
import LabTest from './LabTests.model.js';
import BdLocationService from '../bd-locations/BdLocations.service.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

const labAggregatePipeline = [
  {
    $lookup: {
      from: 'bdlocations',
      localField: 'bdLocation',
      foreignField: '_id',
      as: 'bdLocation',
    },
  },
  { $unwind: { path: '$bdLocation', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'labtests',
      let: { labId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$lab', '$$labId'] } } },
        {
          $lookup: {
            from: 'diagnostictests',
            localField: 'test',
            foreignField: '_id',
            as: 'test',
          },
        },
        { $unwind: { path: '$test', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            price: 1,
            'test._id': 1,
            'test.name': 1,
            'test.description': 1,
          },
        },
      ],
      as: 'tests',
    },
  },
  {
    $addFields: {
      testsCount: { $size: '$tests' },
    },
  },
];

class LabService {
  static async Create(payload: any) {
    return await Lab.create(payload);
  }

  static async GetAll(filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const match: any = {};

    if (filters.search) {
      match.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { hotline: { $regex: filters.search, $options: 'i' } },
        { address: { $regex: filters.search, $options: 'i' } },
        { about: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.district || filters.upazila) {
      const ids = await BdLocationService.ResolveToIds(filters.district as string, filters.upazila as string);
      if (ids.length) match.bdLocation = { $in: ids };
      else if (filters.district) match.bdLocation = { $in: [] };
    } else if (filters.bdLocation) {
      match.bdLocation = new mongoose.Types.ObjectId(filters.bdLocation as string);
    }
    if (filters.type) match.type = filters.type;
    if (filters.isOpen24_7 === 'true' || filters.isOpen24_7 === true) match.isOpen24_7 = true;

    // Filter by test: only labs that offer a specific diagnostic test
    if (filters.test) {
      const labIds = await LabTest.find(
        { test: new mongoose.Types.ObjectId(filters.test) },
        { lab: 1 }
      ).lean();
      match._id = { $in: labIds.map((lt) => lt.lab) };
    }

    let sort: any = { rating: -1, updatedAt: -1 };
    if (filters.sort === 'name') sort = { name: 1 };
    else if (filters.sort === 'newest') sort = { updatedAt: -1 };
    else if (filters.sort === 'tests') sort = { testsCount: -1, rating: -1 };

    const [result] = await Lab.aggregate([
      { $match: match },
      {
        $facet: {
          data: [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
            ...labAggregatePipeline,
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
    const [doc] = await Lab.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      ...labAggregatePipeline,
    ]);
    return doc ?? null;
  }

  static async Update(id: string, payload: any) {
    return await Lab.findByIdAndUpdate(id, payload, { new: true }).populate('bdLocation', 'district upazila');
  }

  static async Delete(id: string) {
    await LabTest.deleteMany({ lab: id });
    return await Lab.findByIdAndDelete(id);
  }

  static async SyncTests(labId: string, tests: { testId: string; price: number }[]) {
    await LabTest.deleteMany({ lab: labId });
    if (tests?.length) {
      await LabTest.insertMany(tests.map(t => ({ lab: labId, test: t.testId, price: t.price })));
    }
  }

  static async GetFilters() {
    const types = await Lab.aggregate([
      { $match: { type: { $exists: true, $ne: null } } },
      { $group: { _id: '$type' } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: '$_id' } },
    ]);
    return {
      types: types.map((t: { name: string }) => t.name),
    };
  }
}

export default LabService;
