import mongoose from 'mongoose';
import DoctorReview from './DoctorReviews.model.js';
import Doctor from '../doctors/Doctors.model.js';
import { parsePagination, buildMeta } from '../../utils/sendResponse.js';

function resolveInitials(name: string): string {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'PT';
}

async function resolveDoctorObjectId(idOrSlug: string): Promise<mongoose.Types.ObjectId | null> {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    return new mongoose.Types.ObjectId(idOrSlug);
  }
  const doc = await Doctor.findOne({ slug: idOrSlug }).select('_id');
  return doc ? (doc._id as mongoose.Types.ObjectId) : null;
}

class DoctorReviewService {
  static async Create(idOrSlug: string, payload: any) {
    const doctorObjectId = await resolveDoctorObjectId(idOrSlug);
    if (!doctorObjectId) throw new Error('Doctor not found');

    const review = await DoctorReview.create({
      ...payload,
      doctor: doctorObjectId,
      patientInitials: resolveInitials(payload.patientName || ''),
    });

    const [stats] = await DoctorReview.aggregate([
      { $match: { doctor: doctorObjectId, isApproved: true } },
      {
        $group: {
          _id: null,
          avg: { $avg: '$rating' },
          count: { $sum: 1 },
          positive: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
        },
      },
    ]);

    if (stats) {
      await Doctor.findByIdAndUpdate(doctorObjectId, {
        rating: Math.round(stats.avg * 10) / 10,
        totalReviews: stats.count,
        positiveReviewPercentage: Math.round((stats.positive / stats.count) * 100),
      });
    }

    return review;
  }

  static async GetByDoctor(idOrSlug: string, filters: any = {}) {
    const { page, limit, skip } = parsePagination(filters);

    const doctorObjectId = await resolveDoctorObjectId(idOrSlug);
    if (!doctorObjectId) return { data: [], meta: buildMeta(0, page, limit) };

    const query: any = { doctor: doctorObjectId };
    if (!filters.includeAll) query.isApproved = true;
    if (filters.rating) query.rating = Number(filters.rating);
    if (filters.consultationType) query.consultationType = filters.consultationType;

    const [data, total] = await Promise.all([
      DoctorReview.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DoctorReview.countDocuments(query),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  static async Update(id: string, payload: any) {
    const review = await DoctorReview.findByIdAndUpdate(id, payload, { new: true });
    if (!review) throw new Error('Review not found');

    const [stats] = await DoctorReview.aggregate([
      { $match: { doctor: review.doctor, isApproved: true } },
      {
        $group: {
          _id: null,
          avg: { $avg: '$rating' },
          count: { $sum: 1 },
          positive: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
        },
      },
    ]);
    await Doctor.findByIdAndUpdate(review.doctor, {
      rating: stats ? Math.round(stats.avg * 10) / 10 : 0,
      totalReviews: stats ? stats.count : 0,
      positiveReviewPercentage: stats ? Math.round((stats.positive / stats.count) * 100) : null,
    });

    return review;
  }

  static async Delete(id: string) {
    return await DoctorReview.findByIdAndDelete(id);
  }
}

export default DoctorReviewService;
