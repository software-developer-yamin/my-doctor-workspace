/**
 * Migration — remove auto-generated "* Consultation" entries from hospital services.
 * Specialisations are tracked via the specialities field; services should only contain
 * actual service offerings (Laboratory Services, Diagnostic Imaging, etc.)
 *
 * Usage: npx ts-node src/remove-consultation-services.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/mydoctor';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected:', MONGO_URI);

  const db = mongoose.connection.db!;

  const result = await db.collection('hospitals').updateMany(
    { services: { $regex: /Consultation$/ } },
    { $pull: { services: { $regex: /Consultation$/ } } as any }
  );

  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
