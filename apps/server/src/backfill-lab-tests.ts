/**
 * Backfill: ensure every DiagnosticTest is linked to at least 3 Labs via LabTests.
 * Run: npm run build && node dist/backfill-lab-tests.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import DiagnosticTest from "./modules/diagnostic-tests/DiagnosticTests.model.js";
import Lab from "./modules/labs/Labs.model.js";
import LabTest from "./modules/labs/LabTests.model.js";

dotenv.config();

const log = (msg: string) => console.log(`[LAB-BACKFILL] ${msg}`);

function jitter(base: number, pct = 0.25): number {
  const factor = 1 + (Math.random() * 2 - 1) * pct;
  return Math.round(base * factor / 50) * 50; // round to nearest 50
}

async function main() {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) throw new Error("MONGODB_URI not set");
  await mongoose.connect(uri);
  log("Connected");

  const labs = await Lab.find({}).select("_id").lean();
  if (labs.length === 0) { log("No labs in DB — abort"); return; }
  log(`Found ${labs.length} labs`);

  const tests = await DiagnosticTest.find({}).select("_id price_start_from").lean();
  log(`Found ${tests.length} diagnostic tests`);

  let added = 0;
  const MIN_LABS = Math.min(3, labs.length);

  for (const test of tests) {
    const existing = await LabTest.find({ test: test._id }).select("lab").lean();
    const existingLabIds = new Set(existing.map((e: any) => e.lab.toString()));

    const needed = MIN_LABS - existing.length;
    if (needed <= 0) continue;

    // pick random labs not already linked
    const available = labs.filter((l: any) => !existingLabIds.has(l._id.toString()));
    const shuffled = available.sort(() => Math.random() - 0.5).slice(0, needed);

    const docs = shuffled.map((l: any) => ({
      lab: l._id,
      test: test._id,
      price: jitter((test as any).price_start_from || 500),
    }));

    if (docs.length > 0) {
      await LabTest.insertMany(docs, { ordered: false });
      added += docs.length;
    }
  }

  log(`Added ${added} LabTest entries`);
  await mongoose.disconnect();
  log("Done");
}

main().catch((err) => { console.error(err); process.exit(1); });
