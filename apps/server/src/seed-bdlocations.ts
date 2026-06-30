/**
 * seed-bdlocations.ts — Seed BdLocations flat schema + migrate hospital bdLocation refs
 *
 * Run: npx ts-node src/seed-bdlocations.ts
 *
 * Steps:
 * 1. Clear old BdLocations collection (old schema had {district, upazilas[]})
 * 2. Seed all 64 Bangladesh districts × official upazilas as flat {district, upazila} entries
 * 3. For each hospital, parse address → find matching BdLocation → set bdLocation ref
 * 4. Log hospitals whose addresses couldn't be mapped
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/mydoctor';

const log = (msg: string) => console.log(`[BD-SEED] ${msg}`);
const warn = (msg: string) => console.warn(`[BD-SEED][WARN] ${msg}`);

// ─── Schemas (minimal, inline to avoid circular import issues) ───────────────

const BdLocationSchema = new mongoose.Schema(
  { district: { type: String, required: true, trim: true }, upazila: { type: String, required: true, trim: true } },
  { timestamps: true, versionKey: false }
);
BdLocationSchema.index({ district: 1, upazila: 1 }, { unique: true });
BdLocationSchema.index({ district: 1 });
const BdLocation = mongoose.model('BdLocations', BdLocationSchema);

const HospitalSchema = new mongoose.Schema({ address: String, bdLocation: { type: mongoose.Schema.Types.ObjectId } }, { strict: false });
const Hospital = mongoose.model('Hospitals', HospitalSchema);

const AmbulanceSchema = new mongoose.Schema({ address: String, upazila: String, bdLocation: { type: mongoose.Schema.Types.ObjectId } }, { strict: false });
const Ambulance = mongoose.model('Ambulances', AmbulanceSchema);

const LabSchema = new mongoose.Schema({ address: String, upazila: String, bdLocation: { type: mongoose.Schema.Types.ObjectId } }, { strict: false });
const Lab = mongoose.model('Labs', LabSchema);

const GuideSchema = new mongoose.Schema({ upazila: String, bdLocation: { type: mongoose.Schema.Types.ObjectId } }, { strict: false });
const Guide = mongoose.model('Guides', GuideSchema);

// ─── Official Bangladesh data ─────────────────────────────────────────────────

const BENGALI_DISTRICT_MAP: Record<string, string> = {
  'ঢাকা': 'Dhaka', 'ফরিদপুর': 'Faridpur', 'গাজীপুর': 'Gazipur',
  'গোপালগঞ্জ': 'Gopalganj', 'কিশোরগঞ্জ': 'Kishoreganj', 'মাদারীপুর': 'Madaripur',
  'মানিকগঞ্জ': 'Manikganj', 'মুন্সীগঞ্জ': 'Munshiganj', 'নারায়ণগঞ্জ': 'Narayanganj',
  'নরসিংদী': 'Narsingdi', 'রাজবাড়ী': 'Rajbari', 'শরিয়তপুর': 'Shariatpur',
  'টাঙ্গাইল': 'Tangail', 'বান্দরবান': 'Bandarban', 'ব্রাহ্মণবাড়িয়া': 'Brahmanbaria',
  'চাঁদপুর': 'Chandpur', 'চট্টগ্রাম': 'Chattogram', 'কক্সবাজার': "Cox's Bazar",
  'কুমিল্লা': 'Cumilla', 'ফেনী': 'Feni', 'খাগড়াছড়ি': 'Khagrachhari',
  'লক্ষ্মীপুর': 'Lakshmipur', 'নোয়াখালী': 'Noakhali', 'রাঙ্গামাটি': 'Rangamati',
  'বগুড়া': 'Bogura', 'চাঁপাইনবাবগঞ্জ': 'Chapai Nawabganj', 'জয়পুরহাট': 'Joypurhat',
  'নওগাঁ': 'Naogaon', 'নাটোর': 'Natore', 'পাবনা': 'Pabna', 'রাজশাহী': 'Rajshahi',
  'সিরাজগঞ্জ': 'Sirajganj', 'বাগেরহাট': 'Bagerhat', 'চুয়াডাঙ্গা': 'Chuadanga',
  'যশোর': 'Jashore', 'ঝিনাইদহ': 'Jhenaidah', 'খুলনা': 'Khulna', 'কুষ্টিয়া': 'Kushtia',
  'মাগুরা': 'Magura', 'মেহেরপুর': 'Meherpur', 'নড়াইল': 'Narail', 'সাতক্ষীরা': 'Satkhira',
  'বরিশাল': 'Barishal', 'বরগুনা': 'Barguna', 'ভোলা': 'Bhola', 'ঝালকাঠি': 'Jhalokati',
  'পটুয়াখালী': 'Patuakhali', 'পিরোজপুর': 'Pirojpur', 'হবিগঞ্জ': 'Habiganj',
  'মৌলভীবাজার': 'Moulvibazar', 'সুনামগঞ্জ': 'Sunamganj', 'সিলেট': 'Sylhet',
  'দিনাজপুর': 'Dinajpur', 'গাইবান্ধা': 'Gaibandha', 'কুড়িগ্রাম': 'Kurigram',
  'লালমনিরহাট': 'Lalmonirhat', 'নীলফামারী': 'Nilphamari', 'পঞ্চগড়': 'Panchagarh',
  'রংপুর': 'Rangpur', 'ঠাকুরগাঁও': 'Thakurgaon', 'জামালপুর': 'Jamalpur',
  'ময়মনসিংহ': 'Mymensingh', 'নেত্রকোণা': 'Netrokona', 'শেরপুর': 'Sherpur',
};

const DISTRICT_UPAZILAS: Record<string, string[]> = {
  'Dhaka': ['Dhamrai', 'Dohar', 'Keraniganj', 'Nawabganj', 'Savar'],
  'Faridpur': ['Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Faridpur Sadar', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'],
  'Gazipur': ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur', 'Tongi'],
  'Gopalganj': ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
  'Kishoreganj': ['Austagram', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kishoreganj Sadar', 'Kuliarchar', 'Mithamoin', 'Nikli', 'Pakundia', 'Tarail'],
  'Madaripur': ['Kalkini', 'Madaripur Sadar', 'Rajoir', 'Shibchar'],
  'Manikganj': ['Daulatpur', 'Ghior', 'Harirampur', 'Manikganj Sadar', 'Saturia', 'Shivalaya', 'Singair'],
  'Munshiganj': ['Gazaria', 'Lohajang', 'Munshiganj Sadar', 'Sirajdikhan', 'Sreenagar', 'Tongibari'],
  'Narayanganj': ['Araihazar', 'Bandar', 'Narayanganj Sadar', 'Rupganj', 'Sonargaon'],
  'Narsingdi': ['Belabo', 'Monohardi', 'Narsingdi Sadar', 'Palash', 'Raipura', 'Shibpur'],
  'Rajbari': ['Baliakandi', 'Goalanda', 'Kalukhali', 'Pangsha', 'Rajbari Sadar'],
  'Shariatpur': ['Bhedarganj', 'Damudya', 'Gosairhat', 'Jajira', 'Naria', 'Shariatpur Sadar', 'Zajira'],
  'Tangail': ['Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur', 'Tangail Sadar'],
  'Bandarban': ['Alikadam', 'Bandarban Sadar', 'Lama', 'Naikhongchhari', 'Rowangchhari', 'Ruma', 'Thanchi'],
  'Brahmanbaria': ['Akhaura', 'Ashuganj', 'Bancharampur', 'Bijoynagar', 'Brahmanbaria Sadar', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail'],
  'Chandpur': ['Chandpur Sadar', 'Faridganj', 'Hajiganj', 'Haimchar', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti'],
  'Chattogram': ['Anowara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Kanknadi', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'],
  "Cox's Bazar": ['Chakaria', "Cox's Bazar Sadar", 'Kutubdia', 'Maheshkhali', 'Pekua', 'Ramu', 'Teknaf', 'Ukhia'],
  'Cumilla': ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Cumilla Sadar Dakshin', 'Cumilla Sadar Uttar', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Lalmai', 'Manoharganj', 'Meghna', 'Muradnagar', 'Nangalkot', 'Titas'],
  'Feni': ['Chhagalnaiya', 'Daganbhuiyan', 'Feni Sadar', 'Fulgazi', 'Parshuram', 'Sonagazi'],
  'Khagrachhari': ['Dighinala', 'Guimara', 'Khagrachhari Sadar', 'Lakshmichhari', 'Mahalchhari', 'Manikchari', 'Matiranga', 'Panchhari', 'Ramgarh'],
  'Lakshmipur': ['Kamalnagar', 'Lakshmipur Sadar', 'Ramganj', 'Ramgati', 'Roypur'],
  'Noakhali': ['Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Kabirhat', 'Noakhali Sadar', 'Senbagh', 'Subarnachar'],
  'Rangamati': ['Bagaichhari', 'Barkal', 'Belaichhari', 'Juraichhari', 'Kaptai', 'Kawkhali', 'Langadu', 'Naniarchar', 'Rajasthali', 'Rangamati Sadar'],
  'Bogura': ['Adamdighi', 'Bogura Sadar', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatala'],
  'Chapai Nawabganj': ['Bholahat', 'Chapai Nawabganj Sadar', 'Gomastapur', 'Nachole', 'Shibganj'],
  'Joypurhat': ['Akkelpur', 'Joypurhat Sadar', 'Kalai', 'Khetlal', 'Panchbibi'],
  'Naogaon': ['Atrai', 'Badalgachhi', 'Dhamoirhat', 'Mahadebpur', 'Manda', 'Naogaon Sadar', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'],
  'Natore': ['Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Natore Sadar', 'Singra'],
  'Pabna': ['Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Pabna Sadar', 'Santhia', 'Sujanagar'],
  'Rajshahi': ['Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Rajshahi Sadar', 'Tanore'],
  'Sirajganj': ['Belkuchi', 'Chauhali', 'Kamarkhand', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Sirajganj Sadar', 'Tarash', 'Ullapara'],
  'Bagerhat': ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola'],
  'Chuadanga': ['Alamdanga', 'Chuadanga Sadar', 'Damurhuda', 'Jibannagar'],
  'Jashore': ['Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jashore Sadar', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
  'Jhenaidah': ['Harinakunda', 'Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa'],
  'Khulna': ['Batiaghata', 'Dacope', 'Dighalia', 'Dumuria', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsa', 'Terokhada'],
  'Kushtia': ['Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Kushtia Sadar', 'Mirpur'],
  'Magura': ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'],
  'Meherpur': ['Gangni', 'Meherpur Sadar', 'Mujibnagar'],
  'Narail': ['Kalia', 'Lohagara', 'Narail Sadar'],
  'Satkhira': ['Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Satkhira Sadar', 'Shyamnagar', 'Tala'],
  'Barishal': ['Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Barishal Sadar', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Ujirpur', 'Wazirpur'],
  'Barguna': ['Amtali', 'Bamna', 'Barguna Sadar', 'Betagi', 'Patharghata', 'Taltali'],
  'Bhola': ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'],
  'Jhalokati': ['Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur'],
  'Patuakhali': ['Bauphal', 'Dashmina', 'Dumki', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Patuakhali Sadar', 'Rangabali'],
  'Pirojpur': ['Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Nesarabad', 'Pirojpur Sadar', 'Zianagar'],
  'Habiganj': ['Ajmiriganj', 'Bahubal', 'Baniachong', 'Chunarughat', 'Habiganj Sadar', 'Lakhai', 'Madhabpur', 'Nabiganj'],
  'Moulvibazar': ['Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Moulvibazar Sadar', 'Rajnagar', 'Sreemangal'],
  'Sunamganj': ['Bishwamvarpur', 'Chhatak', 'Derai', 'Dharampasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Shalla', 'South Sunamganj', 'Sunamganj Sadar', 'Tahirpur'],
  'Sylhet': ['Balaganj', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Dakshin Surma', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'North Sylhet', 'Osmani Nagar', 'Sylhet Sadar', 'Zakiganj'],
  'Dinajpur': ['Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Dinajpur Sadar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur'],
  'Gaibandha': ['Fulchhari', 'Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj'],
  'Kurigram': ['Bhurungamari', 'Chilmari', 'Kurigram Sadar', 'Nageshwari', 'Phulbari', 'Rajarhat', 'Rajibpur', 'Raumari', 'Ulipur'],
  'Lalmonirhat': ['Aditmari', 'Hatibandha', 'Kaliganj', 'Lalmonirhat Sadar', 'Patgram'],
  'Nilphamari': ['Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Nilphamari Sadar', 'Saidpur'],
  'Panchagarh': ['Atwari', 'Boda', 'Debiganj', 'Panchagarh Sadar', 'Tetulia'],
  'Rangpur': ['Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Rangpur Sadar', 'Taraganj'],
  'Thakurgaon': ['Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail', 'Thakurgaon Sadar'],
  'Jamalpur': ['Bakshiganj', 'Dewanganj', 'Islampur', 'Jamalpur Sadar', 'Madarganj', 'Melandaha', 'Sarishabari'],
  'Mymensingh': ['Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Iswarganj', 'Muktagachha', 'Mymensingh Sadar', 'Nandail', 'Phulpur', 'Tarakanda', 'Trishal'],
  'Netrokona': ['Atpara', 'Barhatta', 'Durgapur', 'Kalmakanda', 'Kendua', 'Khaliajuri', 'Madan', 'Mohanganj', 'Netrokona Sadar', 'Purbadhala'],
  'Sherpur': ['Jhenaigati', 'Nakla', 'Nalitabari', 'Sherpur Sadar', 'Sreebardi'],
};

const ALL_DISTRICTS = Object.keys(DISTRICT_UPAZILAS).sort();

function escapeRe(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function parseAddress(address: string): { district: string | null; upazila: string | null } {
  if (!address) return { district: null, upazila: null };

  let district: string | null = null;

  for (const [bengali, english] of Object.entries(BENGALI_DISTRICT_MAP)) {
    if (address.includes(bengali)) { district = english; break; }
  }

  if (!district) {
    const sorted = [...ALL_DISTRICTS].sort((a, b) => b.length - a.length);
    for (const d of sorted) {
      if (new RegExp(`\\b${escapeRe(d)}\\b`, 'i').test(address)) { district = d; break; }
    }
  }

  if (!district) return { district: null, upazila: null };

  const upazilas = DISTRICT_UPAZILAS[district] ?? [];
  let upazila: string | null = null;

  const sortedU = [...upazilas].sort((a, b) => b.length - a.length);
  for (const u of sortedU) {
    if (new RegExp(`\\b${escapeRe(u)}\\b`, 'i').test(address)) { upazila = u; break; }
  }

  if (!upazila && address.includes('সদর')) {
    upazila = upazilas.find(u => u.toLowerCase().endsWith(' sadar')) ?? null;
  }

  if (!upazila) {
    upazila = upazilas.find(u => u.toLowerCase().endsWith(' sadar')) ?? upazilas[0] ?? null;
  }

  return { district, upazila };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  await mongoose.connect(MONGO_URI);
  log('Connected to MongoDB');

  // Step 1: Drop old BdLocations documents (schema change: array → flat)
  const oldCount = await BdLocation.countDocuments();
  log(`Dropping ${oldCount} old BdLocation documents...`);
  await BdLocation.deleteMany({});

  // Drop stale unique index on district-only (from old schema) and sync correct indexes
  try {
    await BdLocation.collection.dropIndex('district_1');
    log('Dropped stale district_1 unique index');
  } catch (_) {
    // index may not exist — that's fine
  }
  await BdLocation.syncIndexes();
  log('Indexes synced');

  // Step 2: Seed all 64 districts × upazilas (flat)
  const allLocations: { district: string; upazila: string }[] = [];
  for (const [district, upazilas] of Object.entries(DISTRICT_UPAZILAS)) {
    for (const upazila of upazilas) {
      allLocations.push({ district, upazila });
    }
  }

  log(`Seeding ${allLocations.length} district-upazila pairs...`);
  const seedOps = allLocations.map(({ district, upazila }) => ({
    updateOne: {
      filter: { district, upazila },
      update: { $set: { district, upazila } },
      upsert: true,
    },
  }));
  const seedResult = await BdLocation.bulkWrite(seedOps, { ordered: false });
  log(`Seeded: ${seedResult.upsertedCount} inserted, ${seedResult.modifiedCount} updated`);

  // Build in-memory lookup: { district → { upazila → ObjectId } }
  const locationDocs = await BdLocation.find({}, { _id: 1, district: 1, upazila: 1 }).lean();
  const locationMap = new Map<string, mongoose.Types.ObjectId>();
  for (const doc of locationDocs) {
    locationMap.set(`${doc.district}||${doc.upazila}`, doc._id as mongoose.Types.ObjectId);
  }

  // ── Step 3: Migrate Hospitals ──────────────────────────────────────────────
  const hospitals = await Hospital.find({}, { _id: 1, address: 1, bdLocation: 1 }).lean();
  log(`Processing ${hospitals.length} hospitals...`);

  let hMapped = 0, hSkipped = 0, hUnmapped = 0;
  const hOps: any[] = [];
  const unmappedHospitals: string[] = [];

  for (const h of hospitals) {
    const address = (h as any).address as string | undefined;
    if (!address) { hSkipped++; continue; }

    const { district, upazila } = parseAddress(address);
    if (!district || !upazila) {
      unmappedHospitals.push(`${h._id} | "${address}"`);
      hUnmapped++;
      continue;
    }

    const locId = locationMap.get(`${district}||${upazila}`);
    if (!locId) { hUnmapped++; continue; }

    hOps.push({
      updateOne: {
        filter: { _id: h._id },
        update: { $set: { bdLocation: locId } },
      },
    });
    hMapped++;
  }

  if (hOps.length) {
    await Hospital.bulkWrite(hOps, { ordered: false });
  }
  log(`Hospitals: ${hMapped} mapped, ${hSkipped} skipped (no address), ${hUnmapped} unmapped`);
  if (unmappedHospitals.length) {
    warn(`Hospitals with unrecognized addresses (manual review needed):`);
    unmappedHospitals.forEach(h => warn(`  ${h}`));
  }

  // ── Step 4: Migrate Ambulances (from upazila string if bdLocation missing) ─
  const ambulances = await Ambulance.find({}, { _id: 1, address: 1, upazila: 1, bdLocation: 1 }).lean();
  log(`Processing ${ambulances.length} ambulances...`);
  let aMapped = 0;
  const aOps: any[] = [];

  for (const a of ambulances) {
    if ((a as any).bdLocation) { aMapped++; continue; }
    const address = (a as any).address || (a as any).upazila || '';
    if (!address) continue;
    const { district, upazila } = parseAddress(address);
    if (!district || !upazila) continue;
    const locId = locationMap.get(`${district}||${upazila}`);
    if (!locId) continue;
    aOps.push({ updateOne: { filter: { _id: a._id }, update: { $set: { bdLocation: locId } } } });
    aMapped++;
  }
  if (aOps.length) await Ambulance.bulkWrite(aOps, { ordered: false });
  log(`Ambulances: ${aMapped} processed`);

  // ── Step 5: Migrate Labs ───────────────────────────────────────────────────
  const labs = await Lab.find({}, { _id: 1, address: 1, upazila: 1, bdLocation: 1 }).lean();
  log(`Processing ${labs.length} labs...`);
  let lMapped = 0;
  const lOps: any[] = [];

  for (const l of labs) {
    if ((l as any).bdLocation) { lMapped++; continue; }
    const address = (l as any).address || (l as any).upazila || '';
    if (!address) continue;
    const { district, upazila } = parseAddress(address);
    if (!district || !upazila) continue;
    const locId = locationMap.get(`${district}||${upazila}`);
    if (!locId) continue;
    lOps.push({ updateOne: { filter: { _id: l._id }, update: { $set: { bdLocation: locId } } } });
    lMapped++;
  }
  if (lOps.length) await Lab.bulkWrite(lOps, { ordered: false });
  log(`Labs: ${lMapped} processed`);

  log('Migration complete!');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('[BD-SEED] Fatal error:', err);
  process.exit(1);
});
