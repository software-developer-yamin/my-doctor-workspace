/**
 * Backfill script — run once to populate missing computed fields.
 * Usage: npx ts-node src/backfill.ts
 *
 * - DoctorSchedules.avgWaitingTime: null/0 records → schema default (20 min)
 * - Doctors.positiveReviewPercentage: all records → computed from actual DoctorReviews (rating >= 4)
 * - Doctors.rating + totalReviews: recomputed from reviews as a side-effect
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/mydoctor';

async function backfill() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected:', MONGO_URI);

  const db = mongoose.connection.db!;

  // 1. DoctorSchedules — avgWaitingTime: set schema default (20 min) for null/missing/zero records
  const schedUpdateResult = await db.collection('doctorschedules').updateMany(
    {
      $or: [
        { avgWaitingTime: null },
        { avgWaitingTime: { $exists: false } },
        { avgWaitingTime: 0 },
      ],
    },
    { $set: { avgWaitingTime: 20 } },
  );
  console.log(`DoctorSchedules avgWaitingTime backfilled: ${schedUpdateResult.modifiedCount} documents set to 20 min`);

  // 2. Doctors — positiveReviewPercentage: compute from actual reviews (rating >= 4 = positive)
  const doctors = await db.collection('doctors').find({}, { projection: { _id: 1 } }).toArray();
  let backfilledCount = 0;
  for (const doc of doctors) {
    const [stats] = await db.collection('doctorreviews').aggregate([
      { $match: { doctor: doc._id, isApproved: true } },
      {
        $group: {
          _id: null,
          avg: { $avg: '$rating' },
          count: { $sum: 1 },
          positive: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
        },
      },
    ]).toArray();

    if (stats && stats.count > 0) {
      await db.collection('doctors').updateOne(
        { _id: doc._id },
        {
          $set: {
            positiveReviewPercentage: Math.round((stats.positive / stats.count) * 100),
            rating: Math.round(stats.avg * 10) / 10,
            totalReviews: stats.count,
          },
        },
      );
      backfilledCount++;
    } else {
      // No approved reviews — clear any stale fake value
      await db.collection('doctors').updateOne(
        { _id: doc._id },
        { $set: { positiveReviewPercentage: null, rating: 0, totalReviews: 0 } },
      );
    }
  }
  console.log(`Doctors: ${backfilledCount}/${doctors.length} have reviews and were backfilled with real positiveReviewPercentage`);

  await mongoose.disconnect();
  console.log('Done.');
}

backfill().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
