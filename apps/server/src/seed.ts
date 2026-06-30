import dotenv from "dotenv";
import mongoose from "mongoose";

import City from "./modules/cities/Cities.model.js";
import Speciality from "./modules/specialities/Specialities.model.js";
import Concentration from "./modules/concentrations/Concentrations.model.js";
import DiagnosticTest from "./modules/diagnostic-tests/DiagnosticTests.model.js";
import Hospital from "./modules/hospitals/Hospitals.model.js";
import Lab from "./modules/labs/Labs.model.js";
import Ambulance from "./modules/ambulances/Ambulances.model.js";
import Doctor from "./modules/doctors/Doctors.model.js";
import DoctorSchedule from "./modules/doctor-schedules/DoctorSchedules.model.js";
import DoctorHomeSchedule from "./modules/doctor-home-schedules/DoctorHomeSchedules.model.js";
import DoctorReview from "./modules/doctor-reviews/DoctorReviews.model.js";

dotenv.config();

const log = (msg: string) => console.log(`[SEED] ${msg}`);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");

  await mongoose.connect(uri);
  log("Connected to MongoDB");

  // ── Clear all ──────────────────────────────────────────────
  await Promise.all([
    City.deleteMany({}),
    Speciality.deleteMany({}),
    Concentration.deleteMany({}),
    DiagnosticTest.deleteMany({}),
    Hospital.deleteMany({}),
    Lab.deleteMany({}),
    Ambulance.deleteMany({}),
    Doctor.deleteMany({}),
    DoctorSchedule.deleteMany({}),
    DoctorHomeSchedule.deleteMany({}),
    DoctorReview.deleteMany({}),
  ]);
  log("Cleared all collections");

  // ── 1. Cities ──────────────────────────────────────────────
  const cities = await City.insertMany([
    { name: "Dhaka" },
    { name: "Chittagong" },
    { name: "Sylhet" },
    { name: "Rajshahi" },
    { name: "Khulna" },
    { name: "Comilla" },
    { name: "Mymensingh" },
  ]);
  log(`Cities: ${cities.length}`);

  const [dhaka, chittagong, sylhet, rajshahi, khulna] = cities;

  // ── 2. Specialities ────────────────────────────────────────
  const specialities = await Speciality.insertMany([
    { name: "Cardiology" },
    { name: "Neurology" },
    { name: "Orthopedics" },
    { name: "Pediatrics" },
    { name: "Gynecology & Obstetrics" },
    { name: "Dermatology" },
    { name: "Gastroenterology" },
    { name: "General Medicine" },
    { name: "Ophthalmology" },
    { name: "ENT" },
  ]);
  log(`Specialities: ${specialities.length}`);

  const [cardiology, neurology, orthopedics, pediatrics, gynecology, dermatology, gastro, general, ophthalmology, ent] = specialities;

  // ── 3. Concentrations ──────────────────────────────────────
  const concentrations = await Concentration.insertMany([
    { name: "Interventional Cardiology" },
    { name: "Stroke Medicine" },
    { name: "Spine Surgery" },
    { name: "Neonatal Care" },
    { name: "Maternal-Fetal Medicine" },
    { name: "Cosmetic Dermatology" },
    { name: "Hepatology" },
    { name: "Internal Medicine" },
    { name: "Retina Surgery" },
    { name: "Rhinology" },
  ]);
  log(`Concentrations: ${concentrations.length}`);

  const [interCardiology, strokeMed, spineSurgery, neonatal, maternal, cosmeticDerm, hepatology, internalMed, retina, rhinology] = concentrations;

  // ── 4. Diagnostic Tests ────────────────────────────────────
  const diagnosticTests = await DiagnosticTest.insertMany([
    { name: "Complete Blood Count (CBC)", description: "Measures all components of blood including RBC, WBC, platelets.", price_start_from: 350 },
    { name: "Blood Glucose Fasting", description: "Measures blood sugar level after fasting for 8 hours.", price_start_from: 150 },
    { name: "Lipid Profile", description: "Measures cholesterol and triglyceride levels in blood.", price_start_from: 600 },
    { name: "Liver Function Test (LFT)", description: "Evaluates how well the liver is working.", price_start_from: 800 },
    { name: "Kidney Function Test (KFT)", description: "Checks kidney health including creatinine and urea levels.", price_start_from: 700 },
    { name: "Thyroid Function Test (TFT)", description: "Measures thyroid hormone levels (T3, T4, TSH).", price_start_from: 900 },
    { name: "Urine Routine Examination (URE)", description: "Analyzes urine for infection, kidney disease and diabetes.", price_start_from: 200 },
    { name: "ECG", description: "Records electrical activity of the heart.", price_start_from: 300 },
    { name: "Chest X-Ray", description: "Imaging of lungs, heart and chest bones.", price_start_from: 400 },
    { name: "Ultrasound Abdomen", description: "Imaging of abdominal organs including liver, kidney, gallbladder.", price_start_from: 1200 },
    { name: "HbA1c", description: "Measures average blood sugar over past 2-3 months.", price_start_from: 750 },
    { name: "Hepatitis B Surface Antigen (HBsAg)", description: "Detects hepatitis B virus infection.", price_start_from: 400 },
  ]);
  log(`Diagnostic Tests: ${diagnosticTests.length}`);

  // ── 5. Hospitals ───────────────────────────────────────────
  const hospitals = await Hospital.insertMany([
    {
      name: "Dhaka Medical College Hospital",
      description: "One of the largest public hospitals in Bangladesh, established in 1946.",
      hotline: "01799-999999",
      email: "info@dmch.gov.bd",
      password: "hospital123",
      address: "Bakshibazar, Dhaka 1000",
      city: dhaka._id,
      lat: "23.7254",
      lon: "90.3954",
      location: { type: "Point", coordinates: [90.3954, 23.7254] },
      website: "https://dmch.gov.bd",
      about: "Dhaka Medical College Hospital (DMCH) is a public medical school hospital established in 1946 with over 2600 beds.",
      mission: "Providing quality healthcare to all citizens regardless of economic status.",
      vision: "To be the leading public healthcare institution in Bangladesh.",
      specialities: [cardiology._id, neurology._id, orthopedics._id, pediatrics._id, gynecology._id, general._id],
      type: "Hospital",
      isEmergencyAvailable: true,
      isVerified: true,
      yearsInService: 1946,
      openingHours: [
        { day: "Saturday",  time: "24 Hours", isClosed: false },
        { day: "Sunday",    time: "24 Hours", isClosed: false },
        { day: "Monday",    time: "24 Hours", isClosed: false },
        { day: "Tuesday",   time: "24 Hours", isClosed: false },
        { day: "Wednesday", time: "24 Hours", isClosed: false },
        { day: "Thursday",  time: "24 Hours", isClosed: false },
        { day: "Friday",    time: "24 Hours", isClosed: false },
      ],
      services: ["Emergency", "ICU", "Surgery", "Pathology", "Digital X-Ray"],
      facilities: ["ICU", "CCU", "Cabin", "Emergency", "Pharmacy", "Cafeteria", "Parking", "Blood Bank"],
      stats: { totalBeds: 2600, icuBeds: 50 },
      rating: 4.1,
      totalReviews: 1250,
    },
    {
      name: "Square Hospital",
      description: "A leading private tertiary care hospital offering world-class healthcare with 500 beds.",
      hotline: "10616",
      email: "info@squarehospital.com",
      password: "hospital123",
      address: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka 1205",
      city: dhaka._id,
      lat: "23.7511",
      lon: "90.3869",
      location: { type: "Point", coordinates: [90.3869, 23.7511] },
      website: "https://squarehospital.com",
      about: "Square Hospital is a 500-bed tertiary care hospital providing comprehensive medical services since 2006.",
      mission: "Delivering patient-centered care with cutting-edge technology.",
      vision: "To be the most trusted healthcare provider in South Asia.",
      specialities: [cardiology._id, neurology._id, gastro._id, dermatology._id, ophthalmology._id, ent._id],
      type: "Specialized Center",
      isEmergencyAvailable: true,
      isVerified: true,
      yearsInService: 2006,
      openingHours: [
        { day: "Saturday",  time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Sunday",    time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Monday",    time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Tuesday",   time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Wednesday", time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Thursday",  time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Friday",    time: "08:00 AM - 10:00 PM", isClosed: true  },
      ],
      services: ["Emergency", "ICU", "Surgery", "Pathology", "Digital X-Ray"],
      facilities: ["ICU", "CCU", "NICU", "Cabin", "Emergency", "Pharmacy", "Cafeteria", "Parking", "Blood Bank", "Prayer Room"],
      stats: { totalBeds: 500, icuBeds: 30 },
      rating: 4.7,
      totalReviews: 3200,
    },
    {
      name: "Chittagong Medical College Hospital",
      description: "Premier public hospital serving Chittagong division since 1957.",
      hotline: "031-630000",
      email: "info@cmch.gov.bd",
      password: "hospital123",
      address: "K. B. Fazlul Kader Road, Chittagong 4203",
      city: chittagong._id,
      lat: "22.3569",
      lon: "91.8037",
      location: { type: "Point", coordinates: [91.8037, 22.3569] },
      website: "https://cmch.gov.bd",
      about: "CMCH is a major public hospital in Chittagong with over 1300 beds providing specialized medical care.",
      mission: "Providing accessible and affordable healthcare to people of Chittagong.",
      vision: "Excellence in medical education and patient care.",
      specialities: [cardiology._id, orthopedics._id, pediatrics._id, gynecology._id, general._id],
      type: "Hospital",
      isEmergencyAvailable: true,
      isVerified: true,
      yearsInService: 1957,
      openingHours: [
        { day: "Saturday",  time: "24 Hours", isClosed: false },
        { day: "Sunday",    time: "24 Hours", isClosed: false },
        { day: "Monday",    time: "24 Hours", isClosed: false },
        { day: "Tuesday",   time: "24 Hours", isClosed: false },
        { day: "Wednesday", time: "24 Hours", isClosed: false },
        { day: "Thursday",  time: "24 Hours", isClosed: false },
        { day: "Friday",    time: "24 Hours", isClosed: false },
      ],
      services: ["Emergency", "ICU", "Surgery", "Pathology", "Digital X-Ray"],
      facilities: ["ICU", "Cabin", "Emergency", "Pharmacy", "Parking", "Blood Bank"],
      stats: { totalBeds: 1320, icuBeds: 30 },
      rating: 3.9,
      totalReviews: 890,
    },
    {
      name: "Islami Bank Hospital Sylhet",
      description: "Modern private hospital serving Sylhet region with compassionate care.",
      hotline: "0821-720900",
      email: "info@ibhsylhet.com",
      password: "hospital123",
      address: "East Dargah Gate, Sylhet 3100",
      city: sylhet._id,
      lat: "24.8998",
      lon: "91.8687",
      location: { type: "Point", coordinates: [91.8687, 24.8998] },
      website: "",
      about: "A comprehensive private hospital offering modern diagnostic and treatment facilities since 1995.",
      mission: "Quality healthcare with Islamic values and compassionate service.",
      vision: "Healthcare excellence for the people of Sylhet.",
      specialities: [general._id, gynecology._id, pediatrics._id, dermatology._id],
      type: "Clinic",
      isEmergencyAvailable: true,
      isVerified: true,
      yearsInService: 1995,
      openingHours: [
        { day: "Saturday",  time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Sunday",    time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Monday",    time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Tuesday",   time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Wednesday", time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Thursday",  time: "08:00 AM - 10:00 PM", isClosed: false },
        { day: "Friday",    time: "",                     isClosed: true  },
      ],
      services: ["Emergency", "Surgery", "Pathology", "Digital X-Ray"],
      facilities: ["Cabin", "Emergency", "Pharmacy", "Prayer Room", "Parking"],
      stats: { totalBeds: 200, icuBeds: 10 },
      rating: 4.2,
      totalReviews: 560,
    },
    {
      name: "Rajshahi Medical College Hospital",
      description: "Government medical college hospital serving north Bengal with 1000 beds.",
      hotline: "0721-772150",
      email: "info@rmch.gov.bd",
      password: "hospital123",
      address: "Laxmipur, Rajshahi 6000",
      city: rajshahi._id,
      lat: "24.3636",
      lon: "88.6241",
      location: { type: "Point", coordinates: [88.6241, 24.3636] },
      website: "https://rmch.gov.bd",
      about: "RMCH is a 1000-bed tertiary care hospital serving the people of Rajshahi division since 1958.",
      mission: "Delivering high-quality healthcare and medical education.",
      vision: "To be the center of excellence for healthcare in north Bengal.",
      specialities: [cardiology._id, neurology._id, orthopedics._id, general._id, pediatrics._id],
      type: "Diagnostic Center",
      isEmergencyAvailable: true,
      isVerified: true,
      yearsInService: 1958,
      openingHours: [
        { day: "Saturday",  time: "24 Hours", isClosed: false },
        { day: "Sunday",    time: "24 Hours", isClosed: false },
        { day: "Monday",    time: "24 Hours", isClosed: false },
        { day: "Tuesday",   time: "24 Hours", isClosed: false },
        { day: "Wednesday", time: "24 Hours", isClosed: false },
        { day: "Thursday",  time: "24 Hours", isClosed: false },
        { day: "Friday",    time: "24 Hours", isClosed: false },
      ],
      services: ["Emergency", "ICU", "Surgery", "Pathology", "Digital X-Ray"],
      facilities: ["ICU", "Cabin", "Emergency", "Pharmacy", "Cafeteria", "Parking", "Blood Bank"],
      stats: { totalBeds: 1000, icuBeds: 25 },
      rating: 4.0,
      totalReviews: 720,
    },
  ]);
  log(`Hospitals: ${hospitals.length}`);

  const [dmch, squareHospital, cmch, ibhSylhet, rmch] = hospitals;

  // ── 6. Labs ────────────────────────────────────────────────
  await Lab.insertMany([
    {
      name: "Popular Diagnostic Centre",
      description: "Leading diagnostic laboratory chain in Bangladesh.",
      hotline: "16484",
      address: "House 16, Road 2, Dhanmondi, Dhaka 1205",
      city: dhaka._id,
      about: "Popular Diagnostic Centre is one of the largest diagnostic chains with modern equipment.",
      location: { type: "Point", coordinates: [90.3742, 23.7461] },
    },
    {
      name: "Ibn Sina Diagnostic",
      description: "Trusted diagnostic centre with ISO certified labs.",
      hotline: "10610",
      address: "Road 4, Dhanmondi R/A, Dhaka 1205",
      city: dhaka._id,
      about: "Ibn Sina provides comprehensive diagnostic services with over 500 tests available.",
      location: { type: "Point", coordinates: [90.3758, 23.7489] },
    },
    {
      name: "Chittagong Diagnostic Centre",
      description: "Comprehensive diagnostic services in Chittagong.",
      hotline: "031-2860001",
      address: "OR Nizam Road, Chittagong 4100",
      city: chittagong._id,
      about: "Providing quality diagnostic services to the people of Chittagong.",
      location: { type: "Point", coordinates: [91.8123, 22.3475] },
    },
    {
      name: "Sylhet Diagnostic Lab",
      description: "Modern diagnostic facility in Sylhet city.",
      hotline: "0821-716001",
      address: "Zindabazar, Sylhet 3100",
      city: sylhet._id,
      about: "Full service diagnostic lab serving Sylhet with advanced equipment.",
      location: { type: "Point", coordinates: [91.8667, 24.8953] },
    },
  ]);
  log(`Labs: 4`);

  // ── 7. Ambulances ──────────────────────────────────────────
  await Ambulance.insertMany([
    { name: "Rahim Ambulance Service", city: dhaka._id, driving_license_number: "DHA-2021-001", ambulance_type: "Advanced Life Support", ambulance_number: "DHA-AMB-0001", status: "Active" },
    { name: "Karim Emergency Transport", city: dhaka._id, driving_license_number: "DHA-2021-002", ambulance_type: "Basic Life Support", ambulance_number: "DHA-AMB-0002", status: "Active" },
    { name: "CTG Ambulance Service", city: chittagong._id, driving_license_number: "CTG-2022-001", ambulance_type: "Advanced Life Support", ambulance_number: "CTG-AMB-0001", status: "Active" },
    { name: "Sylhet Quick Response", city: sylhet._id, driving_license_number: "SYL-2022-001", ambulance_type: "Basic Life Support", ambulance_number: "SYL-AMB-0001", status: "Active" },
    { name: "Rajshahi Emergency", city: rajshahi._id, driving_license_number: "RAJ-2023-001", ambulance_type: "Basic Life Support", ambulance_number: "RAJ-AMB-0001", status: "Inactive" },
    { name: "Khulna Lifeline", city: khulna._id, driving_license_number: "KHL-2023-001", ambulance_type: "Advanced Life Support", ambulance_number: "KHL-AMB-0001", status: "Active" },
  ]);
  log(`Ambulances: 6`);

  // ── 8. Doctors (with rich profile data) ────────────────────
  const doctors = await Doctor.insertMany([
    {
      name: "Dr. Ahmed Hussain",
      slug: "dr-ahmed-hussain",
      degrees: "MBBS, MD (Cardiology), FCPS",
      short_description: "Senior Cardiologist with 20 years of experience in interventional cardiology and heart failure management.",
      BMDC_REG_NO: "BMDC-A-12345",
      about: "Dr. Ahmed Hussain is a renowned cardiologist with over 20 years of clinical experience. He specializes in interventional cardiology, coronary artery disease, and heart failure management. He has performed over 5,000 cardiac catheterizations and is proficient in complex PCI procedures. Dr. Ahmed has trained at leading institutions in Europe and has published extensively in peer-reviewed journals.",
      email: "ahmed.hussain@mydoctor.com.bd",
      phone: "+8801711000001",
      password: "doctor123",
      gender: "Male",
      years_of_experience: 20,
      isAvailableHome: false,
      isFeatured: true,
      isVerified: true,
      totalPatients: 4800,
      rating: 4.8,
      totalReviews: 312,
      languages: ["Bengali", "English"],
      social_links: {
        facebook: "https://facebook.com/dr.ahmedhussain",
        linkedin: "https://linkedin.com/in/ahmedhussain",
        youtube: "https://youtube.com/@drAhmedHussain",
      },
      services: ["ECG", "Echocardiography", "Coronary Angiography", "PCI", "Pacemaker Implantation", "Holter Monitoring", "Stress Test"],
      conditions_treated: ["Coronary Artery Disease", "Heart Failure", "Arrhythmia", "Hypertension", "Valve Disease", "Angina", "Myocardial Infarction", "Atrial Fibrillation", "Heart Attack", "Chest Pain"],
      insurance_accepted: ["Green Delta Insurance", "MetLife", "Guardian Life", "Delta Life", "Popular Life", "Pragati Insurance"],
      awards: [
        { title: "Best Cardiologist Award", year: "2022", organization: "Bangladesh Medical Association" },
        { title: "Excellence in Interventional Cardiology", year: "2019", organization: "Asia Pacific Society of Cardiology" },
        { title: "Outstanding Contribution in Cardiac Care", year: "2017", organization: "Bangladesh Society of Cardiology" },
      ],
      publications: [
        { title: "Outcomes of Primary PCI in STEMI Patients in Bangladesh", journal: "Bangladesh Medical Research Council Bulletin", year: "2021", link: "" },
        { title: "Prevalence of Coronary Artery Disease in Urban Bangladesh", journal: "Journal of Cardiovascular Disease", year: "2018", link: "" },
        { title: "Long-term Outcomes of Drug-eluting Stents in Bangladeshi Patients", journal: "Asian Cardiovascular and Thoracic Annals", year: "2015", link: "" },
      ],
      faqs: [
        { question: "When should I see a cardiologist?", answer: "You should see a cardiologist if you have chest pain, shortness of breath, palpitations, dizziness, or a family history of heart disease. Also if you have risk factors like diabetes, hypertension, or high cholesterol.", votes: 124, category: "General", askedDate: "2024-08-15" },
        { question: "How often should I get a cardiac checkup?", answer: "If you're under 40 with no risk factors, every 5 years is generally fine. Over 40, or with risk factors like diabetes or hypertension, annual checkups are recommended.", votes: 98, category: "Preventive Care", askedDate: "2024-06-20" },
        { question: "What is the recovery time after coronary angiography?", answer: "Most patients can go home the same day or after one night's stay. Recovery is typically 24-48 hours for the puncture site. You should avoid strenuous activity for a week.", votes: 87, category: "Procedures", askedDate: "2024-05-10" },
        { question: "Can heart disease be reversed with lifestyle changes?", answer: "Yes, to a significant extent. A healthy diet, regular exercise, smoking cessation, and stress management can slow progression and even partially reverse some effects of coronary artery disease.", votes: 76, category: "Lifestyle", askedDate: "2024-03-22" },
        { question: "What symptoms indicate a heart attack?", answer: "Classic symptoms include chest pain or pressure, pain radiating to left arm or jaw, sweating, nausea, and shortness of breath. Women may experience atypical symptoms like fatigue and back pain. Call emergency services immediately.", votes: 143, category: "Emergency", askedDate: "2024-01-05" },
      ],
      field_of_concentration: [interCardiology._id],
      specializations: [cardiology._id],
      educations: ["MBBS - Dhaka Medical College, 2000", "MD Cardiology - BSMMU, 2005", "FCPS - BCPS, 2007", "Fellowship in Interventional Cardiology - Germany, 2009"],
    },
    {
      name: "Dr. Fatema Begum",
      slug: "dr-fatema-begum",
      degrees: "MBBS, FCPS (Gynecology & Obstetrics)",
      short_description: "Experienced Gynecologist specializing in high-risk pregnancy and minimally invasive surgery.",
      BMDC_REG_NO: "BMDC-A-23456",
      about: "Dr. Fatema Begum is a highly experienced obstetrician and gynecologist with 15 years of practice. She has special expertise in managing high-risk pregnancies, maternal-fetal medicine, and laparoscopic gynecological surgeries. She is passionate about women's health and provides compassionate, evidence-based care to her patients.",
      email: "fatema.begum@mydoctor.com.bd",
      phone: "+8801711000002",
      password: "doctor123",
      gender: "Female",
      years_of_experience: 15,
      isAvailableHome: true,
      isFeatured: true,
      isVerified: true,
      totalPatients: 6200,
      rating: 4.9,
      totalReviews: 428,
      languages: ["Bengali", "English", "Hindi"],
      social_links: {
        facebook: "https://facebook.com/dr.fatemabegum",
        instagram: "https://instagram.com/drfatemabegum",
      },
      services: ["Antenatal Care", "High-Risk Pregnancy Management", "Laparoscopic Surgery", "Hysterectomy", "Colposcopy", "Infertility Evaluation", "Normal Delivery", "Caesarean Section", "Menopause Management"],
      conditions_treated: ["High-Risk Pregnancy", "PCOS", "Endometriosis", "Uterine Fibroids", "Ovarian Cysts", "Infertility", "Menstrual Disorders", "Cervical Cancer Screening", "Gestational Diabetes", "Preeclampsia"],
      insurance_accepted: ["MetLife", "Guardian Life", "Delta Life", "Popular Life", "Green Delta Insurance"],
      awards: [
        { title: "Best Gynecologist Award", year: "2023", organization: "Bangladesh Obstetric and Gynecological Society" },
        { title: "Excellence in Maternal Healthcare", year: "2020", organization: "WHO Bangladesh Chapter" },
      ],
      publications: [
        { title: "Management of Gestational Diabetes in Bangladesh: Current Practice", journal: "Bangladesh Medical Journal", year: "2022", link: "" },
        { title: "Laparoscopic vs Open Hysterectomy: Outcomes in a Bangladeshi Tertiary Center", journal: "Journal of Minimally Invasive Gynecology", year: "2019", link: "" },
      ],
      faqs: [
        { question: "What are signs of a high-risk pregnancy?", answer: "Signs include advanced maternal age (over 35), pre-existing conditions like diabetes or hypertension, previous pregnancy complications, multiple pregnancies (twins/triplets), or abnormal prenatal screening results. Regular monitoring is essential.", votes: 112, category: "Pregnancy", askedDate: "2024-09-01" },
        { question: "How often should I visit during pregnancy?", answer: "In the first trimester, once a month. Second trimester every 2-4 weeks. Third trimester every 1-2 weeks, or more frequently for high-risk pregnancies. Total visits are typically 8-14 depending on your health status.", votes: 95, category: "Antenatal Care", askedDate: "2024-07-15" },
        { question: "What is PCOS and can it be treated?", answer: "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder causing enlarged ovaries with small cysts. It's very manageable with lifestyle changes, hormonal therapy, and fertility treatments if needed. Most women with PCOS can have healthy pregnancies.", votes: 134, category: "General", askedDate: "2024-05-20" },
        { question: "When should I consider a C-section?", answer: "C-sections are recommended when vaginal delivery poses risk to mother or baby - such as abnormal position, placenta previa, fetal distress, or failure to progress in labor. The decision is made case by case based on medical necessity.", votes: 78, category: "Delivery", askedDate: "2024-04-10" },
      ],
      field_of_concentration: [maternal._id],
      specializations: [gynecology._id],
      educations: ["MBBS - Chittagong Medical College, 2005", "FCPS Gynecology & Obstetrics - BCPS, 2012", "Training in Maternal-Fetal Medicine - India, 2014"],
    },
    {
      name: "Dr. Karim Uddin",
      slug: "dr-karim-uddin",
      degrees: "MBBS, MS (Orthopedics)",
      short_description: "Orthopedic surgeon with expertise in spine surgery and joint replacement.",
      BMDC_REG_NO: "BMDC-A-34567",
      about: "Dr. Karim Uddin is a skilled orthopedic surgeon with 12 years of experience in spine surgery, joint replacement, and sports medicine. He has performed over 2,000 successful joint replacement surgeries and is one of the few surgeons in Bangladesh proficient in minimally invasive spine techniques.",
      email: "karim.uddin@mydoctor.com.bd",
      phone: "+8801711000003",
      password: "doctor123",
      gender: "Male",
      years_of_experience: 12,
      isAvailableHome: false,
      isVerified: true,
      totalPatients: 3100,
      rating: 4.7,
      totalReviews: 198,
      languages: ["Bengali", "English"],
      social_links: {
        linkedin: "https://linkedin.com/in/karimuddinortho",
      },
      services: ["Hip Replacement", "Knee Replacement", "Spine Surgery", "Sports Injury Treatment", "Fracture Management", "Arthroscopy", "Minimally Invasive Surgery"],
      conditions_treated: ["Arthritis", "Back Pain", "Disc Herniation", "Fractures", "Sports Injuries", "Scoliosis", "Osteoporosis", "Knee Pain", "Hip Pain", "Rotator Cuff Tear"],
      insurance_accepted: ["Green Delta Insurance", "MetLife", "Pragati Insurance", "Delta Life"],
      awards: [
        { title: "Best Orthopedic Surgeon", year: "2021", organization: "Bangladesh Orthopedic Society" },
      ],
      publications: [
        { title: "Total Knee Arthroplasty Outcomes in Bangladeshi Patients", journal: "Journal of Orthopedics and Traumatology", year: "2020", link: "" },
        { title: "Minimally Invasive Lumbar Discectomy: 5-Year Follow-up", journal: "Bangladesh Journal of Neurosurgery", year: "2018", link: "" },
      ],
      faqs: [
        { question: "When is knee replacement surgery recommended?", answer: "Knee replacement is typically recommended when conservative treatments (medications, physical therapy, injections) no longer control pain, and the knee pain significantly limits daily activities. X-rays showing severe joint degeneration are also an indicator.", votes: 89, category: "Surgery", askedDate: "2024-08-05" },
        { question: "How long is recovery after joint replacement?", answer: "Most patients walk with assistance within 24 hours. Hospital stay is 3-5 days. Most daily activities resume in 3-6 weeks. Full recovery and maximum benefit takes 3-6 months, with physical therapy being crucial.", votes: 102, category: "Recovery", askedDate: "2024-06-12" },
        { question: "Can back pain be treated without surgery?", answer: "Yes, 90% of back pain cases improve with conservative treatment - rest, physiotherapy, anti-inflammatory medications, and exercises. Surgery is only considered for persistent neurological symptoms, severe disc herniation, or spinal instability not responding to conservative care.", votes: 156, category: "Treatment", askedDate: "2024-04-18" },
      ],
      field_of_concentration: [spineSurgery._id],
      specializations: [orthopedics._id],
      educations: ["MBBS - Rajshahi Medical College, 2007", "MS Orthopedics - BSMMU, 2014", "Fellowship in Spine Surgery - India, 2016"],
    },
    {
      name: "Dr. Nasreen Akter",
      slug: "dr-nasreen-akter",
      degrees: "MBBS, DCH, FCPS (Pediatrics)",
      short_description: "Pediatrician with special interest in neonatal care and childhood diseases.",
      BMDC_REG_NO: "BMDC-A-45678",
      about: "Dr. Nasreen Akter is a compassionate and highly skilled pediatrician with expertise in neonatal intensive care and childhood diseases. With 10 years of experience, she has cared for thousands of children from newborns to adolescents. She is known for her gentle approach and ability to communicate effectively with parents.",
      email: "nasreen.akter@mydoctor.com.bd",
      phone: "+8801711000004",
      password: "doctor123",
      gender: "Female",
      years_of_experience: 10,
      isAvailableHome: true,
      isVerified: true,
      totalPatients: 5400,
      rating: 4.9,
      totalReviews: 356,
      languages: ["Bengali", "English"],
      social_links: {
        facebook: "https://facebook.com/dr.nasreenakter",
      },
      services: ["Well-Baby Checkups", "Vaccination", "Neonatal Intensive Care", "Growth Monitoring", "Developmental Assessment", "Nutrition Counseling", "Allergy Testing", "Fever Management"],
      conditions_treated: ["Newborn Care", "Fever", "Diarrhea", "Pneumonia", "Asthma", "Malnutrition", "Jaundice", "Allergies", "Infections", "Developmental Delays", "Anemia", "Epilepsy in Children"],
      insurance_accepted: ["MetLife", "Guardian Life", "Popular Life", "Delta Life"],
      awards: [
        { title: "Best Pediatrician Award", year: "2023", organization: "Bangladesh Pediatrics Association" },
        { title: "Excellence in Neonatal Care", year: "2021", organization: "WHO Bangladesh" },
      ],
      publications: [
        { title: "Neonatal Sepsis in NICU: Risk Factors and Outcomes", journal: "Bangladesh Journal of Child Health", year: "2022", link: "" },
        { title: "Childhood Malnutrition Interventions in Rural Bangladesh", journal: "International Journal of Pediatrics", year: "2020", link: "" },
      ],
      faqs: [
        { question: "When should I take my newborn to a pediatrician?", answer: "The first visit should be within 3-5 days after birth. Then at 1 month, 2 months, 4 months, 6 months, 9 months, 12 months, 15 months, 18 months, and 2 years. Emergency visits for fever over 38°C in newborns, difficulty breathing, or poor feeding.", votes: 178, category: "Newborn Care", askedDate: "2024-09-10" },
        { question: "Is my child's growth normal?", answer: "Growth is monitored using WHO growth charts. Weight, height, and head circumference are plotted at each visit. A growth curve following the 15th-85th percentile is generally normal. Significant drops across percentile lines warrant investigation.", votes: 134, category: "Growth", askedDate: "2024-07-08" },
        { question: "Which vaccines does my child need and when?", answer: "Bangladesh's EPI schedule includes BCG at birth, Pentavalent and PCV at 6, 10, 14 weeks, OPV at 6, 10, 14 weeks and 18 months, MR at 9 months and 15 months, and TT. Private vaccines include Varicella, Rotavirus, and Hepatitis A.", votes: 162, category: "Vaccination", askedDate: "2024-05-25" },
      ],
      field_of_concentration: [neonatal._id],
      specializations: [pediatrics._id],
      educations: ["MBBS - Sylhet MAG Osmani Medical College, 2010", "DCH - BCPS, 2014", "FCPS Pediatrics - BCPS, 2017"],
    },
    {
      name: "Dr. Rakibul Islam",
      slug: "dr-rakibul-islam",
      degrees: "MBBS, MRCP (UK), MD (Neurology)",
      short_description: "Neurologist specializing in stroke management, epilepsy, and neurodegenerative disorders.",
      BMDC_REG_NO: "BMDC-A-56789",
      about: "Dr. Rakibul Islam is a UK-trained neurologist with 18 years of experience in treating stroke, epilepsy, multiple sclerosis, Parkinson's disease, and other neurological conditions. He is one of the few neurologists in Bangladesh with formal training in neuro-intensive care. He leads the stroke unit at a major Dhaka hospital.",
      email: "rakibul.islam@mydoctor.com.bd",
      phone: "+8801711000005",
      password: "doctor123",
      gender: "Male",
      years_of_experience: 18,
      isAvailableHome: false,
      isFeatured: true,
      isVerified: true,
      totalPatients: 4200,
      rating: 4.8,
      totalReviews: 287,
      languages: ["Bengali", "English"],
      social_links: {
        linkedin: "https://linkedin.com/in/rakibulislamneuro",
        website: "https://drrakibulislam.com",
      },
      services: ["EEG", "EMG/NCS", "Brain MRI Interpretation", "Stroke Management", "Epilepsy Treatment", "Headache Management", "Memory Assessment", "Botox for Migraine"],
      conditions_treated: ["Stroke", "Epilepsy", "Migraine", "Parkinson's Disease", "Multiple Sclerosis", "Dementia", "Neuropathy", "Brain Tumor", "Meningitis", "Vertigo", "Tremor", "Muscle Weakness"],
      insurance_accepted: ["Green Delta Insurance", "MetLife", "Guardian Life", "Pragati Insurance", "Delta Life", "Popular Life"],
      awards: [
        { title: "Best Neurologist Award", year: "2022", organization: "Bangladesh Neurological Society" },
        { title: "Distinguished Service in Stroke Medicine", year: "2020", organization: "World Stroke Organization" },
        { title: "MRCP Excellence Award", year: "2008", organization: "Royal College of Physicians, UK" },
      ],
      publications: [
        { title: "Stroke Burden in Bangladesh: Epidemiology and Risk Factors", journal: "International Journal of Stroke", year: "2021", link: "" },
        { title: "Thrombolysis for Acute Ischemic Stroke in Bangladesh: Safety and Efficacy", journal: "Bangladesh Journal of Neurology", year: "2019", link: "" },
        { title: "Epilepsy Management in Resource-Limited Settings", journal: "Epilepsia", year: "2016", link: "" },
      ],
      faqs: [
        { question: "What are warning signs of a stroke (FAST)?", answer: "Use FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency. Other signs include sudden severe headache, vision problems, loss of balance, or confusion. Stroke is a medical emergency - every minute matters. Call 999 immediately.", votes: 198, category: "Emergency", askedDate: "2024-09-05" },
        { question: "Can epilepsy be cured?", answer: "About 70% of people with epilepsy can achieve seizure control with medication. About 10-15% are candidates for surgery that can be curative. For others, the goal is maximum seizure control with minimum side effects. Many people with epilepsy live full, active lives.", votes: 134, category: "Epilepsy", askedDate: "2024-07-20" },
        { question: "What causes migraines and how are they treated?", answer: "Migraines are caused by complex brain changes involving serotonin. Triggers include stress, hormonal changes, certain foods, sleep disruption, and sensory stimuli. Treatment involves acute medications (triptans) and preventive medications (beta-blockers, topiramate). Botox injections work for chronic migraines.", votes: 112, category: "Headache", askedDate: "2024-06-01" },
      ],
      field_of_concentration: [strokeMed._id],
      specializations: [neurology._id],
      educations: ["MBBS - Dhaka Medical College, 2002", "MRCP - Royal College of Physicians UK, 2008", "MD Neurology - BSMMU, 2010", "Fellowship in Neuro-Intensive Care - UK, 2011"],
    },
    {
      name: "Dr. Shirin Sultana",
      slug: "dr-shirin-sultana",
      degrees: "MBBS, DDV (Dermatology)",
      short_description: "Dermatologist with expertise in cosmetic and medical dermatology.",
      BMDC_REG_NO: "BMDC-A-67890",
      about: "Dr. Shirin Sultana provides comprehensive skin care with expertise in both medical and cosmetic dermatology. Over 8 years, she has helped thousands of patients with skin conditions ranging from acne and eczema to advanced cosmetic procedures. She is known for her aesthetic sense and careful patient evaluation.",
      email: "shirin.sultana@mydoctor.com.bd",
      phone: "+8801711000006",
      password: "doctor123",
      gender: "Female",
      years_of_experience: 8,
      isAvailableHome: true,
      isVerified: true,
      totalPatients: 3800,
      rating: 4.7,
      totalReviews: 241,
      languages: ["Bengali", "English"],
      social_links: {
        instagram: "https://instagram.com/drshrinsultana",
        facebook: "https://facebook.com/dr.shirinsultana",
      },
      services: ["Acne Treatment", "Chemical Peels", "Laser Therapy", "Botox", "Dermal Fillers", "PRP Therapy", "Skin Tag Removal", "Vitiligo Treatment", "Hair Loss Treatment", "Allergy Testing"],
      conditions_treated: ["Acne", "Eczema", "Psoriasis", "Vitiligo", "Rosacea", "Skin Infections", "Hair Loss", "Pigmentation Disorders", "Fungal Infections", "Urticaria", "Warts", "Contact Dermatitis"],
      insurance_accepted: ["MetLife", "Guardian Life", "Popular Life"],
      awards: [
        { title: "Rising Star in Dermatology", year: "2022", organization: "Bangladesh Association of Dermatologists" },
      ],
      publications: [
        { title: "Acne Vulgaris in Bangladeshi Adolescents: Prevalence and Management", journal: "Bangladesh Journal of Dermatology", year: "2021", link: "" },
      ],
      faqs: [
        { question: "How do I treat acne effectively?", answer: "Acne treatment depends on severity. Mild acne: topical retinoids and benzoyl peroxide. Moderate acne: add topical or oral antibiotics. Severe acne: oral isotretinoin (Accutane). Consistency is key - treatments take 6-8 weeks to show results. Don't squeeze pimples.", votes: 198, category: "Acne", askedDate: "2024-08-20" },
        { question: "Is it safe to have chemical peels?", answer: "Yes, when performed by a trained dermatologist. Superficial peels are very safe for most skin types. Medium and deep peels require more caution, especially for darker skin tones. Always use sunscreen afterwards. Side effects are usually temporary redness and peeling.", votes: 87, category: "Procedures", askedDate: "2024-06-30" },
        { question: "What causes hair loss and how can it be treated?", answer: "Common causes include androgenetic alopecia (genetic), stress, nutritional deficiency, thyroid disorders, and post-pregnancy changes. Treatment depends on cause: minoxidil, finasteride, PRP therapy, or hair transplant. Early treatment gives better results.", votes: 134, category: "Hair", askedDate: "2024-04-15" },
      ],
      field_of_concentration: [cosmeticDerm._id],
      specializations: [dermatology._id],
      educations: ["MBBS - Mymensingh Medical College, 2012", "DDV Dermatology - BSMMU, 2017", "Diploma in Cosmetic Dermatology - India, 2018"],
    },
    {
      name: "Dr. Mahbubur Rahman",
      slug: "dr-mahbubur-rahman",
      degrees: "MBBS, MRCP, MD (Gastroenterology)",
      short_description: "Gastroenterologist and hepatologist with extensive endoscopy experience.",
      BMDC_REG_NO: "BMDC-A-78901",
      about: "Dr. Mahbubur Rahman is a leading gastroenterologist and hepatologist with 14 years of experience treating digestive diseases, liver disorders, and performing therapeutic endoscopy. He has performed over 10,000 endoscopic procedures and specializes in managing complex liver diseases including hepatitis B and C, cirrhosis, and gastrointestinal cancers.",
      email: "mahbubur.rahman@mydoctor.com.bd",
      phone: "+8801711000007",
      password: "doctor123",
      gender: "Male",
      years_of_experience: 14,
      isAvailableHome: false,
      isVerified: true,
      totalPatients: 3600,
      rating: 4.8,
      totalReviews: 219,
      languages: ["Bengali", "English"],
      social_links: {
        linkedin: "https://linkedin.com/in/mahbuburgastro",
      },
      services: ["Upper GI Endoscopy", "Colonoscopy", "ERCP", "Liver Biopsy", "Hepatitis Management", "IBD Treatment", "H. pylori Eradication", "Capsule Endoscopy"],
      conditions_treated: ["Hepatitis B", "Hepatitis C", "Liver Cirrhosis", "GERD", "Peptic Ulcer", "IBD", "IBS", "Colon Cancer Screening", "Gallstones", "Pancreatitis", "Fatty Liver", "Colorectal Polyps"],
      insurance_accepted: ["Green Delta Insurance", "MetLife", "Pragati Insurance", "Delta Life", "Guardian Life"],
      awards: [
        { title: "Best Endoscopist Award", year: "2021", organization: "Bangladesh Society of Gastroenterology" },
        { title: "Excellence in Hepatology", year: "2019", organization: "Asian Pacific Association for the Study of the Liver" },
      ],
      publications: [
        { title: "Hepatitis B Burden in Bangladesh: A Systematic Review", journal: "Journal of Hepatology", year: "2021", link: "" },
        { title: "Endoscopic Management of GI Bleeding in Bangladesh", journal: "Bangladesh Medical Journal", year: "2018", link: "" },
        { title: "Non-alcoholic Fatty Liver Disease in Urban Bangladesh", journal: "World Journal of Gastroenterology", year: "2016", link: "" },
      ],
      faqs: [
        { question: "What are symptoms of liver disease?", answer: "Early liver disease may have no symptoms. Later signs include fatigue, jaundice (yellow eyes/skin), abdominal swelling, dark urine, pale stool, easy bruising, and loss of appetite. If you have these symptoms, seek medical evaluation promptly.", votes: 167, category: "Liver", askedDate: "2024-09-15" },
        { question: "Is endoscopy (gastroscopy) painful?", answer: "Upper GI endoscopy is generally well tolerated. It's done under sedation, so most patients feel minimal discomfort. The procedure takes 10-15 minutes. You may feel mild bloating afterwards. Throat can be slightly sore for 24 hours. Most people recover quickly.", votes: 145, category: "Procedures", askedDate: "2024-07-22" },
        { question: "Can fatty liver be reversed?", answer: "Yes, fatty liver (NAFLD) is often reversible with lifestyle changes. Losing 5-10% of body weight significantly reduces liver fat. A healthy diet, regular exercise, and avoiding alcohol are key. Medications are being developed but lifestyle remains the primary treatment.", votes: 123, category: "Liver", askedDate: "2024-05-30" },
      ],
      field_of_concentration: [hepatology._id],
      specializations: [gastro._id],
      educations: ["MBBS - Dhaka Medical College, 2005", "MRCP - BCPS, 2011", "MD Gastroenterology - BSMMU, 2014"],
    },
    {
      name: "Dr. Roksana Parvin",
      slug: "dr-roksana-parvin",
      degrees: "MBBS, FCPS (General Medicine)",
      short_description: "General physician with expertise in chronic disease management and preventive care.",
      BMDC_REG_NO: "BMDC-A-89012",
      about: "Dr. Roksana Parvin provides comprehensive primary care with a focus on managing chronic conditions such as diabetes, hypertension, and thyroid disorders. With 11 years of experience, she emphasizes preventive care and patient education. She is known for her thorough approach and dedication to building long-term patient relationships.",
      email: "roksana.parvin@mydoctor.com.bd",
      phone: "+8801711000008",
      password: "doctor123",
      gender: "Female",
      years_of_experience: 11,
      isAvailableHome: true,
      isVerified: true,
      totalPatients: 7100,
      rating: 4.6,
      totalReviews: 384,
      languages: ["Bengali", "English"],
      social_links: {
        facebook: "https://facebook.com/dr.roksanaparvin",
      },
      services: ["General Checkup", "Diabetes Management", "Hypertension Control", "Thyroid Disorders", "Health Screening", "Prescription Management", "Travel Medicine", "Preventive Care Counseling"],
      conditions_treated: ["Diabetes", "Hypertension", "Hypothyroidism", "Hyperthyroidism", "Fever", "Anemia", "Obesity", "Vitamin Deficiency", "Upper Respiratory Infections", "Urinary Tract Infections", "Gout", "Dyslipidemia"],
      insurance_accepted: ["MetLife", "Guardian Life", "Green Delta Insurance", "Delta Life", "Popular Life", "Pragati Insurance"],
      awards: [
        { title: "Excellence in Primary Care", year: "2022", organization: "Bangladesh Medical Association" },
      ],
      publications: [
        { title: "Type 2 Diabetes Control in Primary Care Settings in Dhaka", journal: "Bangladesh Medical Research Council Bulletin", year: "2020", link: "" },
        { title: "Hypertension Awareness and Control in Urban Bangladesh", journal: "Bangladesh Journal of Internal Medicine", year: "2018", link: "" },
      ],
      faqs: [
        { question: "What blood sugar level indicates diabetes?", answer: "Diabetes is diagnosed when fasting blood glucose ≥7.0 mmol/L (126 mg/dL), or 2-hour post-meal glucose ≥11.1 mmol/L, or HbA1c ≥6.5%. Pre-diabetes is fasting glucose 5.6-6.9 mmol/L or HbA1c 5.7-6.4%. Annual screening is recommended for adults over 45.", votes: 234, category: "Diabetes", askedDate: "2024-09-01" },
        { question: "How can I manage high blood pressure naturally?", answer: "Lifestyle changes can lower blood pressure significantly: reduce salt intake, follow DASH diet, exercise 30 minutes daily, maintain healthy weight, limit alcohol, quit smoking, and manage stress. These changes can reduce systolic BP by 10-15 mmHg. Medication may still be needed.", votes: 189, category: "Hypertension", askedDate: "2024-07-10" },
        { question: "How often should I get a health checkup?", answer: "Adults 18-39 with no risk factors: every 3-5 years. Adults 40-49: every 1-2 years. Adults 50+: annually. More frequent if you have chronic conditions. Checkups should include BP, blood sugar, cholesterol, BMI, and age-appropriate cancer screenings.", votes: 145, category: "Preventive Care", askedDate: "2024-05-15" },
        { question: "What are symptoms of thyroid problems?", answer: "Hypothyroidism (underactive): fatigue, weight gain, cold sensitivity, dry skin, hair loss, depression, slow heartbeat. Hyperthyroidism (overactive): weight loss, rapid heartbeat, anxiety, heat sensitivity, tremors, sweating. A simple blood test (TSH) can diagnose thyroid disorders.", votes: 178, category: "Thyroid", askedDate: "2024-03-20" },
      ],
      field_of_concentration: [internalMed._id],
      specializations: [general._id],
      educations: ["MBBS - Sir Salimullah Medical College, 2009", "FCPS General Medicine - BCPS, 2016"],
    },
  ]);
  log(`Doctors: ${doctors.length}`);

  const [drAhmed, drFatema, drKarim, drNasreen, drRakibul, drShirin, drMahbubur, drRoksana] = doctors;

  // ── 9. Doctor Schedules with consultationTypes and languages ─
  await DoctorSchedule.insertMany([
    {
      doctor: drAhmed._id,
      hospital: dmch._id,
      consultationFee: 800,
      followUpFee: 400,
      consultationTypes: ["in-person"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English"],
      schedules: [
        { day: "Saturday", startTime: "09:00", endTime: "13:00", isAvailable: true },
        { day: "Monday", startTime: "09:00", endTime: "13:00", isAvailable: true },
        { day: "Wednesday", startTime: "09:00", endTime: "13:00", isAvailable: true },
      ],
    },
    {
      doctor: drAhmed._id,
      hospital: squareHospital._id,
      consultationFee: 1500,
      followUpFee: 800,
      consultationTypes: ["in-person", "online"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English"],
      schedules: [
        { day: "Sunday", startTime: "17:00", endTime: "20:00", isAvailable: true },
        { day: "Tuesday", startTime: "17:00", endTime: "20:00", isAvailable: true },
        { day: "Thursday", startTime: "17:00", endTime: "20:00", isAvailable: true },
      ],
    },
    {
      doctor: drFatema._id,
      hospital: dmch._id,
      consultationFee: 700,
      followUpFee: 350,
      consultationTypes: ["in-person", "online"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English", "Hindi"],
      schedules: [
        { day: "Sunday", startTime: "10:00", endTime: "14:00", isAvailable: true },
        { day: "Tuesday", startTime: "10:00", endTime: "14:00", isAvailable: true },
        { day: "Thursday", startTime: "10:00", endTime: "14:00", isAvailable: true },
      ],
    },
    {
      doctor: drFatema._id,
      hospital: cmch._id,
      consultationFee: 600,
      followUpFee: 300,
      consultationTypes: ["in-person"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "Hindi"],
      schedules: [
        { day: "Saturday", startTime: "14:00", endTime: "18:00", isAvailable: true },
        { day: "Wednesday", startTime: "14:00", endTime: "18:00", isAvailable: true },
      ],
    },
    {
      doctor: drKarim._id,
      hospital: dmch._id,
      consultationFee: 900,
      followUpFee: 450,
      consultationTypes: ["in-person"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English"],
      schedules: [
        { day: "Saturday", startTime: "08:00", endTime: "12:00", isAvailable: true },
        { day: "Monday", startTime: "08:00", endTime: "12:00", isAvailable: true },
      ],
    },
    {
      doctor: drKarim._id,
      hospital: rmch._id,
      consultationFee: 700,
      followUpFee: 350,
      consultationTypes: ["in-person"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali"],
      schedules: [
        { day: "Friday", startTime: "10:00", endTime: "14:00", isAvailable: true },
      ],
    },
    {
      doctor: drNasreen._id,
      hospital: dmch._id,
      consultationFee: 600,
      followUpFee: 300,
      consultationTypes: ["in-person", "online"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English"],
      schedules: [
        { day: "Saturday", startTime: "09:00", endTime: "13:00", isAvailable: true },
        { day: "Monday", startTime: "09:00", endTime: "13:00", isAvailable: true },
        { day: "Wednesday", startTime: "09:00", endTime: "13:00", isAvailable: true },
      ],
    },
    {
      doctor: drNasreen._id,
      hospital: ibhSylhet._id,
      consultationFee: 500,
      followUpFee: 250,
      consultationTypes: ["in-person"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali"],
      schedules: [
        { day: "Friday", startTime: "14:00", endTime: "18:00", isAvailable: true },
      ],
    },
    {
      doctor: drRakibul._id,
      hospital: dmch._id,
      consultationFee: 1000,
      followUpFee: 500,
      consultationTypes: ["in-person"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English"],
      schedules: [
        { day: "Sunday", startTime: "09:00", endTime: "13:00", isAvailable: true },
        { day: "Tuesday", startTime: "09:00", endTime: "13:00", isAvailable: true },
      ],
    },
    {
      doctor: drRakibul._id,
      hospital: squareHospital._id,
      consultationFee: 2000,
      followUpFee: 1000,
      consultationTypes: ["in-person", "online"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English"],
      schedules: [
        { day: "Thursday", startTime: "17:00", endTime: "20:00", isAvailable: true },
        { day: "Saturday", startTime: "17:00", endTime: "20:00", isAvailable: true },
      ],
    },
    {
      doctor: drShirin._id,
      hospital: squareHospital._id,
      consultationFee: 1200,
      followUpFee: 600,
      consultationTypes: ["in-person", "online"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English"],
      schedules: [
        { day: "Saturday", startTime: "10:00", endTime: "14:00", isAvailable: true },
        { day: "Monday", startTime: "10:00", endTime: "14:00", isAvailable: true },
        { day: "Wednesday", startTime: "10:00", endTime: "14:00", isAvailable: true },
      ],
    },
    {
      doctor: drMahbubur._id,
      hospital: squareHospital._id,
      consultationFee: 1300,
      followUpFee: 650,
      consultationTypes: ["in-person", "online"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English"],
      schedules: [
        { day: "Sunday", startTime: "15:00", endTime: "19:00", isAvailable: true },
        { day: "Tuesday", startTime: "15:00", endTime: "19:00", isAvailable: true },
        { day: "Thursday", startTime: "15:00", endTime: "19:00", isAvailable: true },
      ],
    },
    {
      doctor: drRoksana._id,
      hospital: dmch._id,
      consultationFee: 500,
      followUpFee: 250,
      consultationTypes: ["in-person", "online"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
      avgWaitingTime: 30,
      languages: ["Bengali", "English"],
      schedules: [
        { day: "Saturday", startTime: "08:00", endTime: "14:00", isAvailable: true },
        { day: "Sunday", startTime: "08:00", endTime: "14:00", isAvailable: true },
        { day: "Monday", startTime: "08:00", endTime: "14:00", isAvailable: true },
        { day: "Tuesday", startTime: "08:00", endTime: "14:00", isAvailable: true },
        { day: "Wednesday", startTime: "08:00", endTime: "14:00", isAvailable: true },
      ],
    },
  ]);
  log(`Doctor Schedules: 13`);

  // ── 10. Doctor Home Schedules ──────────────────────────────
  await DoctorHomeSchedule.insertMany([
    {
      doctor: drFatema._id,
      homeVisitFee: 2000,
      followUpFee: 1000,
      schedules: [
        { day: "Friday", startTime: "10:00", endTime: "14:00", isAvailable: true },
        { day: "Saturday", startTime: "16:00", endTime: "20:00", isAvailable: true },
      ],
    },
    {
      doctor: drNasreen._id,
      homeVisitFee: 1500,
      followUpFee: 750,
      schedules: [
        { day: "Friday", startTime: "09:00", endTime: "13:00", isAvailable: true },
        { day: "Saturday", startTime: "15:00", endTime: "19:00", isAvailable: true },
      ],
    },
    {
      doctor: drShirin._id,
      homeVisitFee: 2500,
      followUpFee: 1200,
      schedules: [
        { day: "Friday", startTime: "14:00", endTime: "18:00", isAvailable: true },
        { day: "Sunday", startTime: "16:00", endTime: "20:00", isAvailable: true },
      ],
    },
    {
      doctor: drRoksana._id,
      homeVisitFee: 1200,
      followUpFee: 600,
      schedules: [
        { day: "Friday", startTime: "09:00", endTime: "17:00", isAvailable: true },
        { day: "Saturday", startTime: "14:00", endTime: "18:00", isAvailable: true },
        { day: "Sunday", startTime: "14:00", endTime: "18:00", isAvailable: true },
      ],
    },
  ]);
  log(`Doctor Home Schedules: 4`);

  // ── 11. Doctor Reviews ─────────────────────────────────────
  await DoctorReview.insertMany([
    // Dr. Ahmed Hussain (Cardiology)
    { doctor: drAhmed._id, patientName: "Rafiqul Islam", patientInitials: "RI", rating: 5, text: "Dr. Ahmed is an exceptional cardiologist. He diagnosed my heart condition that was missed by two other doctors. His expertise and thoroughness are unmatched. Highly recommend!", condition: "Coronary Artery Disease", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 23 },
    { doctor: drAhmed._id, patientName: "Shahana Khatun", patientInitials: "SK", rating: 5, text: "After my heart attack, Dr. Ahmed performed the angioplasty and I'm fully recovered. He explained every step clearly. His team is professional and caring. Life-saver!", condition: "Heart Attack", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 31 },
    { doctor: drAhmed._id, patientName: "Monirul Haque", patientInitials: "MH", rating: 4, text: "Very knowledgeable doctor. Wait time can be long but worth it. He took time to listen to all my concerns about my arrhythmia and explained the treatment plan very clearly.", condition: "Arrhythmia", consultationType: "online", isVerified: false, isApproved: true, helpfulCount: 12 },
    { doctor: drAhmed._id, patientName: "Begum Salma", patientInitials: "BS", rating: 5, text: "My husband has been his patient for 5 years for heart failure management. Dr. Ahmed's care has significantly improved his quality of life. We're very grateful.", condition: "Heart Failure", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 18 },
    { doctor: drAhmed._id, patientName: "Tariqul Alam", patientInitials: "TA", rating: 5, text: "Online consultation was very convenient. He reviewed my ECG and blood reports promptly and adjusted my medication. Excellent digital experience!", condition: "Hypertension", consultationType: "online", isVerified: false, isApproved: true, helpfulCount: 9 },

    // Dr. Fatema Begum (Gynecology)
    { doctor: drFatema._id, patientName: "Nasrin Akter", patientInitials: "NA", rating: 5, text: "Dr. Fatema managed my high-risk pregnancy so expertly. She was always available for questions and her calm demeanor kept me at ease throughout. Delivered a healthy baby!", condition: "High-Risk Pregnancy", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 41 },
    { doctor: drFatema._id, patientName: "Sonia Begum", patientInitials: "SB", rating: 5, text: "After years of PCOS and infertility struggles, Dr. Fatema helped me conceive naturally with proper treatment. She's not just a doctor, she's a miracle worker!", condition: "PCOS", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 55 },
    { doctor: drFatema._id, patientName: "Rehana Sultana", patientInitials: "RS", rating: 5, text: "Online consultation was so convenient for my routine pregnancy checkups. She thoroughly reviewed my reports and gave detailed advice. Perfect for busy working mothers.", condition: "Antenatal Care", consultationType: "online", isVerified: false, isApproved: true, helpfulCount: 28 },
    { doctor: drFatema._id, patientName: "Dilara Begum", patientInitials: "DB", rating: 4, text: "Very professional gynecologist. The laparoscopic surgery for my endometriosis was smooth and recovery was quick. Follow-up care has been excellent.", condition: "Endometriosis", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 19 },

    // Dr. Karim Uddin (Orthopedics)
    { doctor: drKarim._id, patientName: "Abdul Karim Mia", patientInitials: "AK", rating: 5, text: "After 3 years of knee pain stopping me from daily activities, Dr. Karim performed a total knee replacement. Now I walk without pain! Operation was smooth and recovery excellent.", condition: "Arthritis", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 36 },
    { doctor: drKarim._id, patientName: "Jahangir Ahmed", patientInitials: "JA", rating: 5, text: "Excellent spine surgeon. My disc herniation was causing unbearable pain and sciatica. Dr. Karim's minimally invasive surgery gave me my life back. 3 months post-op and feeling great.", condition: "Disc Herniation", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 24 },
    { doctor: drKarim._id, patientName: "Sumaiya Khatun", patientInitials: "SK", rating: 4, text: "Very skilled surgeon. My sports injury (ACL tear) was repaired arthroscopically. Recovery was as he predicted. His explanation of the procedure and aftercare was thorough.", condition: "Sports Injuries", consultationType: "in-person", isVerified: false, isApproved: true, helpfulCount: 11 },

    // Dr. Nasreen Akter (Pediatrics)
    { doctor: drNasreen._id, patientName: "Farida Parvin", patientInitials: "FP", rating: 5, text: "My premature baby received exceptional care in the NICU under Dr. Nasreen's supervision. She is incredibly skilled and her team was attentive around the clock. Our son is now perfectly healthy.", condition: "Newborn Care", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 67 },
    { doctor: drNasreen._id, patientName: "Rokeya Begum", patientInitials: "RB", rating: 5, text: "Dr. Nasreen diagnosed my daughter's rare allergy that had been causing chronic issues for years. She is incredibly thorough and compassionate. My daughter is thriving now!", condition: "Allergies", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 38 },
    { doctor: drNasreen._id, patientName: "Mizanur Rahman", patientInitials: "MR", rating: 5, text: "Home visit during COVID for my sick toddler was a lifesaver. Dr. Nasreen came promptly, was extremely thorough, and my son recovered quickly with her treatment.", condition: "Fever", consultationType: "home-visit", isVerified: true, isApproved: true, helpfulCount: 44 },
    { doctor: drNasreen._id, patientName: "Shireen Akter", patientInitials: "SA", rating: 4, text: "Online consultation for growth monitoring was very convenient. She explained my child's percentile charts clearly and gave detailed nutritional guidance. Very helpful!", condition: "Growth Monitoring", consultationType: "online", isVerified: false, isApproved: true, helpfulCount: 16 },

    // Dr. Rakibul Islam (Neurology)
    { doctor: drRakibul._id, patientName: "Habibur Rahman", patientInitials: "HR", rating: 5, text: "Dr. Rakibul saved my life. I had a stroke and he initiated thrombolysis within the golden hour. I've made a remarkable recovery with minimal disability. His quick action and expertise are extraordinary.", condition: "Stroke", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 89 },
    { doctor: drRakibul._id, patientName: "Kamrun Nahar", patientInitials: "KN", rating: 5, text: "My migraines were debilitating and ruining my life. After failed treatments elsewhere, Dr. Rakibul put me on Botox therapy. I've gone from 20 migraine days/month to 3. Life-changing!", condition: "Migraine", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 52 },
    { doctor: drRakibul._id, patientName: "Anisur Rahman", patientInitials: "AR", rating: 5, text: "My epilepsy was poorly controlled on my previous medications. Dr. Rakibul optimized my regimen and I've been seizure-free for 18 months. Online follow-ups make management very convenient.", condition: "Epilepsy", consultationType: "online", isVerified: true, isApproved: true, helpfulCount: 34 },
    { doctor: drRakibul._id, patientName: "Bilkis Begum", patientInitials: "BB", rating: 4, text: "Excellent neurologist for my husband's Parkinson's diagnosis. He explained the condition thoroughly and his medication management has been very effective at controlling symptoms.", condition: "Parkinson's Disease", consultationType: "in-person", isVerified: false, isApproved: true, helpfulCount: 21 },

    // Dr. Shirin Sultana (Dermatology)
    { doctor: drShirin._id, patientName: "Taslima Begum", patientInitials: "TB", rating: 5, text: "Dr. Shirin completely transformed my skin. After years of severe acne and scarring, her isotretinoin treatment and chemical peel combination has given me clear skin for the first time. Amazing!", condition: "Acne", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 47 },
    { doctor: drShirin._id, patientName: "Rubel Hossain", patientInitials: "RH", rating: 5, text: "PRP therapy for my hair loss has shown remarkable results. Dr. Shirin is very professional and the procedure was comfortable. Seeing significant hair regrowth after 3 sessions.", condition: "Hair Loss", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 33 },
    { doctor: drShirin._id, patientName: "Mariam Begum", patientInitials: "MB", rating: 4, text: "Online consultation was great for my eczema follow-up. She reviewed my photos and adjusted my treatment. Very responsive to messages and prescription was ready quickly.", condition: "Eczema", consultationType: "online", isVerified: false, isApproved: true, helpfulCount: 15 },
    { doctor: drShirin._id, patientName: "Khadija Islam", patientInitials: "KI", rating: 5, text: "Home visit for my elderly mother's chronic psoriasis was so thoughtful. Dr. Shirin was thorough and gentle. The new treatment is working wonderfully. So grateful for the convenience.", condition: "Psoriasis", consultationType: "home-visit", isVerified: true, isApproved: true, helpfulCount: 28 },

    // Dr. Mahbubur Rahman (Gastroenterology)
    { doctor: drMahbubur._id, patientName: "Shahjahan Mia", patientInitials: "SM", rating: 5, text: "Dr. Mahbubur's expertise in Hepatitis B management has significantly improved my liver health. His monitoring is meticulous and he explains everything in simple terms. Highly competent.", condition: "Hepatitis B", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 38 },
    { doctor: drMahbubur._id, patientName: "Amena Khatun", patientInitials: "AK", rating: 5, text: "The colonoscopy was completely painless under his care. He found and removed a pre-cancerous polyp that could have been serious. His skill potentially saved my life. Excellent doctor.", condition: "Colon Cancer Screening", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 45 },
    { doctor: drMahbubur._id, patientName: "Rezaul Islam", patientInitials: "RI", rating: 4, text: "Fatty liver was causing me concerns. Online consultation with Dr. Mahbubur was very informative. He reviewed my ultrasound and blood tests, gave a detailed diet and lifestyle plan. Already seeing improvement.", condition: "Fatty Liver", consultationType: "online", isVerified: false, isApproved: true, helpfulCount: 19 },

    // Dr. Roksana Parvin (General Medicine)
    { doctor: drRoksana._id, patientName: "Mofizur Rahman", patientInitials: "MR", rating: 5, text: "Dr. Roksana has been managing my diabetes for 4 years. My HbA1c has gone from 10.2 to 6.8 under her care. She's thorough, patient, and genuinely invested in my health.", condition: "Diabetes", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 52 },
    { doctor: drRoksana._id, patientName: "Nurjahan Begum", patientInitials: "NB", rating: 5, text: "Home visits for my elderly mother-in-law are such a blessing. Dr. Roksana manages her hypertension, diabetes, and thyroid all together so efficiently. Wonderful, compassionate doctor.", condition: "Hypertension", consultationType: "home-visit", isVerified: true, isApproved: true, helpfulCount: 61 },
    { doctor: drRoksana._id, patientName: "Mustafizur Rahman", patientInitials: "MR", rating: 4, text: "Online consultation for my routine thyroid checkup was convenient and efficient. She reviewed my TSH and T4 results promptly and adjusted my levothyroxine dose appropriately.", condition: "Hypothyroidism", consultationType: "online", isVerified: false, isApproved: true, helpfulCount: 22 },
    { doctor: drRoksana._id, patientName: "Fahmida Khatun", patientInitials: "FK", rating: 5, text: "Went for a general health checkup and Dr. Roksana detected early-stage hypertension I had no symptoms of. Timely detection and treatment. Very grateful for her thoroughness.", condition: "Hypertension", consultationType: "in-person", isVerified: true, isApproved: true, helpfulCount: 39 },
    { doctor: drRoksana._id, patientName: "Shahidul Islam", patientInitials: "SI", rating: 4, text: "Good general physician for chronic condition management. Very organized approach - she tracks all parameters systematically and reminds me of follow-ups. Online portal works smoothly.", condition: "Diabetes", consultationType: "online", isVerified: false, isApproved: true, helpfulCount: 14 },
  ]);
  log(`Doctor Reviews seeded`);

  log("━━━ Seed complete ━━━");
  log(`Cities: 7 | Specialities: 10 | Concentrations: 10`);
  log(`Diagnostic Tests: 12 | Hospitals: 5 | Labs: 4 | Ambulances: 6`);
  log(`Doctors: 8 | Doctor Schedules: 13 | Home Schedules: 4 | Reviews: 33`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[SEED ERROR]", err);
  process.exit(1);
});
