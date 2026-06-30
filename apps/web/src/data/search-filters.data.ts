export type TFilterOption = {
  label: string;
  value: string;
};

export const SEARCH_TYPES: TFilterOption[] = [
  { label: "All", value: "all" },
  { label: "Hospital", value: "hospital" },
  { label: "Doctor", value: "doctor" },
];

export const GENDER_FILTERS: TFilterOption[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

export const CONSULTATION_TYPES: TFilterOption[] = [
  { label: "Face To Face", value: "ON_PREMISES" },
  // { label: "Video/Audio Call", value: "VIRTUAL" },
];

export const DISTANCE_FILTERS: TFilterOption[] = [
  { label: "Nearest", value: "0" },
  { label: "Within 2 Kilometers", value: "2000" },
  { label: "Within 5 Kilometers", value: "5000" },
  { label: "Within 10 Kilometers", value: "10000" },
  { label: "Within 15 Kilometers", value: "15000" },
  { label: "Within 25 Kilometers", value: "25000" },
];

export const SPECIALITY_FILTERS: TFilterOption[] = [
  { label: "Aesthetic Dermatologist", value: "4" },
  { label: "Allergy Skin-VD", value: "74" },
  { label: "Andrologist", value: "83" },
  { label: "Andrology & Transplant Surgeon", value: "64" },
  { label: "Anesthesiologist", value: "5" },
  { label: "Biochemist", value: "95" },
  { label: "Cancer Specialist", value: "122" },
  { label: "Cardiac Surgeon", value: "6" },
  { label: "Cardiologist", value: "7" },
  { label: "Cardiothoracic and Vascular Surgeon", value: "8" },
  { label: "Cardiothoracic Surgeon", value: "9" },
  { label: "Chest & Sleep Medicine Specialist", value: "124" },
  { label: "Chest Specialist", value: "10" },
  { label: "Clinical & Interventional Cardiologist", value: "118" },
  { label: "Clinical Nutritionist", value: "77" },
  { label: "Colorectal & Laparoscopic Surgeon", value: "105" },
  { label: "Colorectal Surgeon", value: "11" },
  { label: "Cosmetic Dentist", value: "85" },
  { label: "Cosmetologist", value: "12" },
  { label: "Critical Care Specialist", value: "103" },
  { label: "Dentist", value: "13" },
  { label: "Dermatologist", value: "14" },
  { label: "Diabetologist", value: "70" },
  { label: "Dietician", value: "97" },
  { label: "Endocrinologist", value: "16" },
  { label: "Family Medicine Specialist", value: "17" },
  { label: "Gastroenterologist", value: "18" },
  { label: "General Physician", value: "69" },
  { label: "General Surgeon", value: "84" },
  { label: "Geriatrician", value: "87" },
  { label: "Gynecologist & Obstetrician", value: "73" },
  { label: "Gynecologists", value: "19" },
  { label: "Hematologist", value: "21" },
  { label: "Hepatologist", value: "22" },
  { label: "Infertility Specialist", value: "24" },
  { label: "Internal Medicine Specialist", value: "26" },
  { label: "Interventional Cardiologist", value: "27" },
  { label: "Laparoscopic Surgeon", value: "66" },
  { label: "Maxillofacial Surgeon", value: "29" },
  { label: "Medicine Specialist", value: "30" },
  { label: "Microbiologist", value: "31" },
  { label: "Neonatologist", value: "32" },
  { label: "Nephrologist", value: "34" },
  { label: "Neurologist", value: "35" },
  { label: "Neuromedicine Specialist", value: "72" },
  { label: "Neurosurgeon", value: "36" },
  { label: "Nutritionist", value: "37" },
  { label: "Obstetrician", value: "63" },
  { label: "Oncologist", value: "38" },
  { label: "Ophthalmologist", value: "39" },
  { label: "Orthopedic Surgeon", value: "67" },
  { label: "Orthopedist", value: "40" },
  { label: "Otolaryngologists (ENT)", value: "41" },
  { label: "Pathologist", value: "42" },
  { label: "Pediatric Cardiologist", value: "43" },
  { label: "Pediatrician", value: "46" },
  { label: "Physical Medicine", value: "92" },
  { label: "Physiotherapist", value: "48" },
  { label: "Plastic Surgeon", value: "49" },
  { label: "Psychiatrist", value: "50" },
  { label: "Psychologist", value: "110" },
  { label: "Pulmonologist", value: "51" },
  { label: "Radiologist", value: "52" },
  { label: "Renal Specialist", value: "53" },
  { label: "Respiratory Specialist", value: "54" },
  { label: "Rheumatologist", value: "55" },
  { label: "Sonologist", value: "56" },
  { label: "Surgeon", value: "57" },
  { label: "Urologist", value: "60" },
  { label: "Vascular Surgeon", value: "61" },
  { label: "Venereologist", value: "62" },
];

export const COUNTRY_FILTERS: TFilterOption[] = [
  { label: "Bangladesh", value: "22" },
  { label: "India", value: "103" },
  { label: "Singapore", value: "194" },
  { label: "Malaysia", value: "157" },
  { label: "Thailand", value: "217" },
  { label: "United States", value: "233" },
  { label: "United Kingdom", value: "79" },
  { label: "Canada", value: "39" },
  { label: "Australia", value: "15" },
  { label: "United Arab Emirates", value: "8" },
];

export const AMBULANCE_TYPE_FILTERS: TFilterOption[] = [
  { label: "AC Ambulance", value: "ac" },
  { label: "Non-AC Ambulance", value: "non_ac" },
  { label: "Freezing Ambulance", value: "freezing" },
  { label: "ICU Ambulance", value: "icu" },
  { label: "NICU Ambulance", value: "nicu" },
  { label: "CCU Ambulance", value: "ccu" },
  { label: "Air Ambulance", value: "air" },
];

export const AMBULANCE_EQUIPMENT_FILTERS: TFilterOption[] = [
  { label: "Oxygen", value: "oxygen" },
  { label: "Ventilator", value: "ventilator" },
  { label: "Monitor", value: "monitor" },
  { label: "Suction Machine", value: "suction" },
];
