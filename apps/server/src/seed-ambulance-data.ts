/**
 * seed-ambulance-data.ts — Seed rating and totalTrips for all ambulances.
 * Run: npx ts-node src/seed-ambulance-data.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/mydoctor';

async function seedAmbulanceData() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected:', MONGO_URI);
  const db = mongoose.connection.db!;

  const ambulances = await db.collection('ambulances')
    .find({}, { projection: { _id: 1, name: 1, ambulance_type: 1, status: 1 } })
    .toArray();

  console.log(`Processing ${ambulances.length} ambulances...`);

  for (let i = 0; i < ambulances.length; i++) {
    const a = ambulances[i];
    const idNum = parseInt(a._id.toString().slice(-6), 16);
    const seed = (idNum + i * 31) % 100;

    // rating: 3.5–4.9 (ambulances generally rated lower variance than doctors)
    const ratingRaw = 3.5 + ((seed * 7 + i * 13) % 150) / 100;
    const rating = Math.round(ratingRaw * 10) / 10;

    // totalTrips: 80–600 depending on seed
    const totalTrips = 80 + ((seed * 17 + i * 41) % 521);

    await db.collection('ambulances').updateOne(
      { _id: a._id },
      { $set: { rating, totalTrips } },
    );

    console.log(`  ${(a.name || '').slice(0, 35).padEnd(35)} | ★${rating} | ${totalTrips} trips`);
  }

  console.log(`\nDone. ${ambulances.length} ambulances updated.`);
  await mongoose.disconnect();
}

seedAmbulanceData().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
