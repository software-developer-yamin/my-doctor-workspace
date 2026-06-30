/**
 * One-time migration: add next_serial to existing DoctorLiveQueues documents.
 * next_serial = current_serial + 1 (the next slot to assign to an online booking).
 * Run before deploying the atomic serial assignment fix.
 * Usage: npx ts-node --esm src/migrate-queue-next-serial.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydoctor';

async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected:', MONGO_URI);

  const db = mongoose.connection.db!;
  const col = db.collection('doctorlivequeues');

  const result = await col.updateMany(
    { next_serial: { $exists: false } },
    [{ $set: { next_serial: { $add: ['$current_serial', 1] } } }]
  );

  console.log(`Migrated: ${result.modifiedCount} queue documents`);
  console.log(`Already had next_serial: ${result.matchedCount - result.modifiedCount}`);

  await mongoose.disconnect();
  console.log('Done.');
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
