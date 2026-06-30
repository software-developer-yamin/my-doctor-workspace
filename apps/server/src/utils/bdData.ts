// Official Bangladesh administrative data: 64 districts with upazilas
// Bengali district name → English canonical name
export const BENGALI_DISTRICT_MAP: Record<string, string> = {
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

// Official upazila list per district (alphabetically sorted)
export const DISTRICT_UPAZILAS: Record<string, string[]> = {
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

export const ALL_DISTRICTS = Object.keys(DISTRICT_UPAZILAS).sort();

// Flat list of all {district, upazila} pairs
export function getAllLocations(): { district: string; upazila: string }[] {
  const result: { district: string; upazila: string }[] = [];
  for (const [district, upazilas] of Object.entries(DISTRICT_UPAZILAS)) {
    for (const upazila of upazilas) {
      result.push({ district, upazila });
    }
  }
  return result;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Extract district + upazila from a free-text address string
export function parseAddress(address: string): { district: string | null; upazila: string | null } {
  if (!address || !address.trim()) return { district: null, upazila: null };

  let district: string | null = null;

  // 1. Bengali district names (substring match)
  for (const [bengali, english] of Object.entries(BENGALI_DISTRICT_MAP)) {
    if (address.includes(bengali)) {
      district = english;
      break;
    }
  }

  // 2. English district names (word-boundary, longest first to avoid partial matches)
  if (!district) {
    const sorted = [...ALL_DISTRICTS].sort((a, b) => b.length - a.length);
    for (const d of sorted) {
      if (new RegExp(`\\b${escapeRe(d)}\\b`, 'i').test(address)) {
        district = d;
        break;
      }
    }
  }

  if (!district) return { district: null, upazila: null };

  const upazilas = DISTRICT_UPAZILAS[district] ?? [];
  let upazila: string | null = null;

  // 3. English upazila names (longest first)
  const sortedU = [...upazilas].sort((a, b) => b.length - a.length);
  for (const u of sortedU) {
    if (new RegExp(`\\b${escapeRe(u)}\\b`, 'i').test(address)) {
      upazila = u;
      break;
    }
  }

  // 4. Bengali "সদর" keyword → pick the Sadar upazila
  if (!upazila && address.includes('সদর')) {
    upazila = upazilas.find(u => u.toLowerCase().endsWith(' sadar')) ?? null;
  }

  // 5. Default to "{district} Sadar"
  if (!upazila) {
    upazila = upazilas.find(u => u.toLowerCase().endsWith(' sadar')) ?? upazilas[0] ?? null;
  }

  return { district, upazila };
}
