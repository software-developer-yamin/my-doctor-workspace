/**
 * seed-reviews.ts — Seed realistic DoctorReviews for all doctors with 0 reviews.
 * Run: npx ts-node src/seed-reviews.ts
 *
 * Reviews are the source of truth. Doctor stats (rating, totalReviews, positiveReviewPercentage)
 * are computed from review aggregation — never set directly.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/mydoctor';

const PATIENT_NAMES = [
  ['Rafiqul Islam', 'RI'], ['Shahana Khatun', 'SK'], ['Monirul Haque', 'MH'],
  ['Begum Salma', 'BS'], ['Tariqul Alam', 'TA'], ['Nasrin Akter', 'NA'],
  ['Abdul Karim Mia', 'AK'], ['Jahangir Ahmed', 'JA'], ['Farida Parvin', 'FP'],
  ['Sumaiya Islam', 'SI'], ['Dilara Begum', 'DB'], ['Rehana Sultana', 'RS'],
  ['Sonia Begum', 'SB'], ['Mohammed Hossain', 'MH'], ['Anwar Hussain', 'AH'],
  ['Kamal Uddin', 'KU'], ['Sharifa Khatun', 'SK'], ['Morjina Akter', 'MA'],
  ['Shamsul Haque', 'SH'], ['Taslima Begum', 'TB'], ['Rubel Ahmed', 'RA'],
  ['Ferdaus Hossain', 'FH'], ['Aysha Siddika', 'AS'], ['Liton Mia', 'LM'],
  ['Roksana Parvin', 'RP'], ['Nurul Islam', 'NI'], ['Hasina Khatun', 'HK'],
  ['Milon Khan', 'MK'], ['Champa Akter', 'CA'], ['Belal Hossain', 'BH'],
  ['Mariam Akter', 'MA'], ['Shahinur Rahman', 'SR'], ['Kohinoor Begum', 'KB'],
  ['Abdur Rahim', 'AR'], ['Rina Begum', 'RB'], ['Mamun Ahmed', 'MA'],
  ['Sultana Razia', 'SR'], ['Firoz Alam', 'FA'], ['Nazmul Haque', 'NH'],
  ['Lovely Akter', 'LA'],
];

const REVIEWS_BY_RATING: Record<number, string[]> = {
  5: [
    'Excellent doctor. Diagnosed my condition accurately when others missed it. Highly recommend!',
    'Very professional and thorough. Explained everything clearly. Life-changing treatment.',
    'Outstanding care. My health has improved significantly under this doctor\'s guidance.',
    'Best doctor I have visited. Very attentive and knowledgeable. Fully satisfied.',
    'Exceptional expertise. The treatment plan worked perfectly. Grateful for the care received.',
    'Wonderful experience. Doctor listened patiently and gave very clear advice.',
    'Highly skilled and caring. Recovery was faster than expected. Will definitely return.',
    'Very satisfied. Doctor took time to explain the diagnosis and all treatment options.',
  ],
  4: [
    'Good doctor. Wait time is long but consultation quality is worth it.',
    'Professional and knowledgeable. Explained the treatment plan clearly. Recommended.',
    'Very good experience overall. Doctor is thorough and the staff is helpful.',
    'Satisfactory visit. Doctor was attentive and addressed all my concerns.',
    'Good consultation. Could improve waiting time but medical advice was excellent.',
    'Competent doctor with good bedside manner. Follow-up care has been helpful.',
  ],
  3: [
    'Decent doctor. The consultation felt a bit rushed but advice was adequate.',
    'Average experience. Got the prescription I needed but could communicate better.',
    'Okay visit. Doctor was professional but the wait time was very long.',
    'Satisfactory but not exceptional. Treatment worked but I expected more explanation.',
  ],
  2: [
    'Not fully satisfied with the consultation. Did not feel my concerns were heard.',
    'Disappointing experience. Doctor seemed distracted and rushed through the appointment.',
    'Below average. Expected more thorough examination for the fee charged.',
  ],
  1: [
    'Very disappointed. The consultation was too brief and I left with unanswered questions.',
    'Not recommended. Did not address the main issue I came for.',
  ],
};

const CONDITIONS = [
  'Hypertension', 'Diabetes', 'Back Pain', 'Fever', 'Respiratory Infection',
  'Arthritis', 'Skin Condition', 'Digestive Issues', 'Headache', 'Eye Problem',
  'Dental Pain', 'General Checkup', 'Chest Pain', 'Kidney Stone', 'Thyroid',
  'Anemia', 'Urinary Infection', 'Allergy', 'Asthma', 'Fracture',
];

function pickRating(yearsOfExperience: number, seed: number): number {
  // Base mean: 3.9 + 0.03 per year, capped at 4.7
  const mean = Math.min(4.7, 3.9 + yearsOfExperience * 0.03);
  const roll = (seed % 100) / 100;

  if (mean >= 4.5) {
    // Very experienced doctors: 65% 5★, 25% 4★, 7% 3★, 2% 2★, 1% 1★
    if (roll < 0.65) return 5;
    if (roll < 0.90) return 4;
    if (roll < 0.97) return 3;
    if (roll < 0.99) return 2;
    return 1;
  } else if (mean >= 4.2) {
    // Experienced: 55% 5★, 30% 4★, 10% 3★, 4% 2★, 1% 1★
    if (roll < 0.55) return 5;
    if (roll < 0.85) return 4;
    if (roll < 0.95) return 3;
    if (roll < 0.99) return 2;
    return 1;
  } else {
    // Less experienced: 45% 5★, 30% 4★, 15% 3★, 7% 2★, 3% 1★
    if (roll < 0.45) return 5;
    if (roll < 0.75) return 4;
    if (roll < 0.90) return 3;
    if (roll < 0.97) return 2;
    return 1;
  }
}

function reviewCount(yearsOfExperience: number, seed: number): number {
  // 5–50 reviews; more experienced = more reviews
  const base = Math.min(50, Math.max(5, Math.round(yearsOfExperience * 2.5 + 5)));
  const variance = ((seed * 7) % 21) - 10; // ±10
  return Math.max(5, Math.min(60, base + variance));
}

async function seedReviews() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected:', MONGO_URI);
  const db = mongoose.connection.db!;

  // Find doctors with 0 reviews
  const existingReviewDoctorIds = await db.collection('doctorreviews')
    .distinct('doctor');
  const existingSet = new Set(existingReviewDoctorIds.map((id) => id.toString()));

  const doctors = await db.collection('doctors')
    .find({}, { projection: { _id: 1, years_of_experience: 1 } })
    .toArray();

  const unreviewed = doctors.filter((d) => !existingSet.has(d._id.toString()));
  console.log(`Doctors needing reviews: ${unreviewed.length} / ${doctors.length}`);

  if (unreviewed.length === 0) {
    console.log('All doctors already have reviews. Running aggregation only.');
  } else {
    const reviewDocs: any[] = [];

    for (let di = 0; di < unreviewed.length; di++) {
      const doctor = unreviewed[di];
      const exp = doctor.years_of_experience || 5;
      const idNum = parseInt(doctor._id.toString().slice(-6), 16);
      const count = reviewCount(exp, idNum + di);

      for (let ri = 0; ri < count; ri++) {
        const seed = (idNum + ri * 31 + di * 17) % 100;
        const rating = pickRating(exp, seed);
        const nameEntry = PATIENT_NAMES[(idNum + ri * 13) % PATIENT_NAMES.length];
        const condition = CONDITIONS[(idNum + ri * 7) % CONDITIONS.length];
        const texts = REVIEWS_BY_RATING[rating];
        const text = texts[(idNum + ri * 3) % texts.length];
        const consultationType = ri % 5 === 0 ? 'online' : ri % 7 === 0 ? 'home-visit' : 'in-person';
        const isVerified = ri % 3 !== 0;

        reviewDocs.push({
          doctor: doctor._id,
          patientName: nameEntry[0],
          patientInitials: nameEntry[1],
          rating,
          text,
          condition,
          consultationType,
          isVerified,
          isApproved: true,
          helpfulCount: Math.floor((seed * 3) % 40),
          createdAt: new Date(Date.now() - (ri * 7 + di) * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        });
      }
    }

    // Batch insert
    const BATCH = 500;
    for (let i = 0; i < reviewDocs.length; i += BATCH) {
      await db.collection('doctorreviews').insertMany(reviewDocs.slice(i, i + BATCH));
      process.stdout.write(`\rInserted ${Math.min(i + BATCH, reviewDocs.length)} / ${reviewDocs.length} reviews`);
    }
    console.log(`\nReview documents inserted: ${reviewDocs.length}`);
  }

  // Aggregate stats for ALL doctors from reviews
  console.log('Computing doctor stats from reviews...');
  const statsResult = await db.collection('doctorreviews').aggregate([
    { $match: { isApproved: true } },
    {
      $group: {
        _id: '$doctor',
        avg: { $avg: '$rating' },
        count: { $sum: 1 },
        positive: { $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] } },
      },
    },
  ]).toArray();

  let updated = 0;
  for (const stat of statsResult) {
    await db.collection('doctors').updateOne(
      { _id: stat._id },
      {
        $set: {
          rating: Math.round(stat.avg * 10) / 10,
          totalReviews: stat.count,
          positiveReviewPercentage: Math.round((stat.positive / stat.count) * 100),
        },
      },
    );
    updated++;
  }

  // Doctors with no reviews → clear any stale fake values
  const withReviews = new Set(statsResult.map((s) => s._id.toString()));
  const noReviewDoctors = doctors.filter((d) => !withReviews.has(d._id.toString()));
  if (noReviewDoctors.length > 0) {
    await db.collection('doctors').updateMany(
      { _id: { $in: noReviewDoctors.map((d) => d._id) } },
      { $set: { rating: 0, totalReviews: 0, positiveReviewPercentage: null } },
    );
  }

  console.log(`Doctor stats updated: ${updated} with reviews, ${noReviewDoctors.length} cleared (no reviews).`);
  await mongoose.disconnect();
  console.log('Done.');
}

seedReviews().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
