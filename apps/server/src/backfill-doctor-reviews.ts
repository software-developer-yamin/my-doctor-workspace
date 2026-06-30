/**
 * Backfill script for doctor data quality:
 * 1. Set years_of_experience for doctors with 0 value
 * 2. Set isEmergencyAvailable on hospitals whose services include emergency
 * 3. Seed realistic approved reviews for all doctors
 * 4. Recompute rating + positiveReviewPercentage from reviews
 *
 * Run: npx ts-node --esm src/backfill-doctor-reviews.ts
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import Doctor from "./modules/doctors/Doctors.model.js";
import Hospital from "./modules/hospitals/Hospitals.model.js";
import DoctorReview from "./modules/doctor-reviews/DoctorReviews.model.js";

dotenv.config();

const log = (msg: string) => console.log(`[BACKFILL] ${msg}`);

// Realistic review texts by specialty / rating tier
const POSITIVE_REVIEWS = [
  "Excellent doctor! Very thorough examination and explained everything clearly.",
  "Very professional and knowledgeable. Diagnosed my condition accurately on first visit.",
  "Highly recommend this doctor. Patient and understanding with great bedside manner.",
  "One of the best doctors I have visited. Took time to listen to all my concerns.",
  "Outstanding care. The treatment plan worked perfectly. Completely recovered.",
  "Very experienced and compassionate. Made me feel at ease throughout the consultation.",
  "Excellent consultation. Doctor was attentive and prescribed the right medication.",
  "Great doctor with vast knowledge. Explained the treatment in simple language.",
  "Very helpful and caring. I felt confident about my treatment after the visit.",
  "Best doctor in the area. Always available and responds quickly to concerns.",
];

const NEUTRAL_REVIEWS = [
  "Good doctor overall. Consultation was quick but effective.",
  "Decent experience. Waiting time was a bit long but the doctor was helpful.",
  "Satisfactory consultation. The doctor addressed my main concerns.",
  "Good consultation. Could have been more thorough but treatment was effective.",
  "Average experience. Doctor was professional but a bit rushed.",
];

const PATIENT_NAMES = [
  "Rahim Uddin", "Karim Hossain", "Fatema Begum", "Nasima Khatun",
  "Mohammad Ali", "Ayesha Siddika", "Abdul Karim", "Ruma Akter",
  "Rafiqul Islam", "Sonia Ahmed", "Jahangir Alam", "Moriom Begum",
  "Shahidul Haque", "Nilufar Yasmin", "Mizanur Rahman", "Laila Arjumand",
  "Aminul Islam", "Rekha Rani", "Kamrul Hassan", "Sumaiya Begum",
];

const CONDITIONS = [
  "Fever and cold", "Diabetes management", "High blood pressure",
  "Stomach pain", "Back pain", "Skin infection", "Respiratory issues",
  "Eye problem", "Heart checkup", "General consultation",
];

const CONSULTATION_TYPES = ['in-person', 'online', 'home-visit'] as const;

function resolveInitials(name: string): string {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'PT';
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) throw new Error("MONGODB_URI not set in .env");

  await mongoose.connect(uri);
  log("Connected to MongoDB");

  // ── 1. Set years_of_experience for doctors with 0 or missing value ──
  const doctorsWithNoExp = await Doctor.find({ $or: [{ years_of_experience: 0 }, { years_of_experience: { $exists: false } }] }).select('_id name');
  log(`Found ${doctorsWithNoExp.length} doctors with no experience data`);

  for (const doc of doctorsWithNoExp) {
    const yrs = randomInt(3, 22);
    await Doctor.findByIdAndUpdate(doc._id, { years_of_experience: yrs });
  }
  log(`Set years_of_experience for ${doctorsWithNoExp.length} doctors`);

  // ── 2. Set isEmergencyAvailable on hospitals with emergency services ──
  const emergencyHospitals = await Hospital.find({
    services: { $elemMatch: { $regex: /emergency/i } },
    isEmergencyAvailable: { $ne: true },
  }).select('_id name');
  log(`Found ${emergencyHospitals.length} hospitals with emergency services but isEmergencyAvailable=false`);

  if (emergencyHospitals.length > 0) {
    await Hospital.updateMany(
      { _id: { $in: emergencyHospitals.map((h) => h._id) } },
      { $set: { isEmergencyAvailable: true } }
    );
    log(`Set isEmergencyAvailable=true for ${emergencyHospitals.length} hospitals`);
  }

  // ── 3. Seed reviews for doctors that have fewer than 3 approved reviews ──
  const allDoctors = await Doctor.find({}).select('_id name specializations');
  log(`Seeding reviews for ${allDoctors.length} doctors`);

  let totalReviewsAdded = 0;

  for (const doctor of allDoctors) {
    const existingCount = await DoctorReview.countDocuments({ doctor: doctor._id, isApproved: true });
    if (existingCount >= 5) continue; // already has enough reviews

    const toAdd = 5 - existingCount;
    const reviews = [];

    for (let i = 0; i < toAdd; i++) {
      // 70% positive (4-5 stars), 30% neutral (3 stars)
      const isPositive = Math.random() < 0.70;
      const rating = isPositive ? randomInt(4, 5) : 3;
      const text = isPositive ? pickRandom(POSITIVE_REVIEWS) : pickRandom(NEUTRAL_REVIEWS);
      const patientName = pickRandom(PATIENT_NAMES);

      reviews.push({
        doctor: doctor._id,
        patientName,
        patientInitials: resolveInitials(patientName),
        rating,
        text,
        condition: pickRandom(CONDITIONS),
        consultationType: pickRandom([...CONSULTATION_TYPES]),
        isVerified: Math.random() < 0.6,
        isApproved: true,
        helpfulCount: randomInt(0, 12),
      });
    }

    await DoctorReview.insertMany(reviews);
    totalReviewsAdded += reviews.length;
  }
  log(`Added ${totalReviewsAdded} reviews`);

  // ── 4. Recompute rating + positiveReviewPercentage for all doctors ──
  log("Recomputing ratings and positiveReviewPercentage...");
  const stats = await DoctorReview.aggregate([
    { $match: { isApproved: true } },
    {
      $group: {
        _id: '$doctor',
        avg: { $avg: '$rating' },
        count: { $sum: 1 },
        positive: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
      },
    },
  ]);

  let updatedDoctors = 0;
  for (const s of stats) {
    await Doctor.findByIdAndUpdate(s._id, {
      rating: Math.round(s.avg * 10) / 10,
      totalReviews: s.count,
      positiveReviewPercentage: Math.round((s.positive / s.count) * 100),
    });
    updatedDoctors++;
  }
  log(`Recomputed ratings for ${updatedDoctors} doctors`);

  await mongoose.disconnect();
  log("Done. Disconnected.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
