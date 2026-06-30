/**
 * One-time migration: patch DoctorSchedules documents that have empty
 * consultationTypes / appointmentTypes / languages arrays.
 *
 * Run:  npx ts-node --esm src/migrate-schedules.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DoctorSchedules from './modules/doctor-schedules/DoctorSchedules.model.js';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected to MongoDB');

  const consultationResult = await DoctorSchedules.updateMany(
    { $or: [{ consultationTypes: { $exists: false } }, { consultationTypes: { $size: 0 } }] },
    { $set: { consultationTypes: ['in-person'] } }
  );
  console.log(`consultationTypes patched: ${consultationResult.modifiedCount} docs`);

  const appointmentResult = await DoctorSchedules.updateMany(
    { $or: [{ appointmentTypes: { $exists: false } }, { appointmentTypes: { $size: 0 } }] },
    { $set: { appointmentTypes: ['New Patient', 'Follow Up', 'Report Show', 'Reference'] } }
  );
  console.log(`appointmentTypes patched: ${appointmentResult.modifiedCount} docs`);

  const referenceResult = await DoctorSchedules.updateMany(
    { appointmentTypes: { $exists: true, $ne: [] }, $nor: [{ appointmentTypes: 'Reference' }] },
    { $addToSet: { appointmentTypes: 'Reference' } }
  );
  console.log(`Reference type added: ${referenceResult.modifiedCount} schedule docs`);

  const langResult = await DoctorSchedules.updateMany(
    { $or: [{ languages: { $exists: false } }, { languages: { $size: 0 } }] },
    { $set: { languages: ['Bengali'] } }
  );
  console.log(`languages patched: ${langResult.modifiedCount} docs`);

  const waitResult = await DoctorSchedules.updateMany(
    { $or: [{ avgWaitingTime: { $exists: false } }, { avgWaitingTime: null }] },
    { $set: { avgWaitingTime: 30 } }
  );
  console.log(`avgWaitingTime patched: ${waitResult.modifiedCount} docs`);

  await mongoose.disconnect();
  console.log('Done');
}

migrate().catch((e) => { console.error(e); process.exit(1); });
