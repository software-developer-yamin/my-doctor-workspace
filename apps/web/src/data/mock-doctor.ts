/**
 * Comprehensive mock data for the doctor details page.
 * This data will be replaced by backend API responses later.
 * Every field is fully populated to showcase the UI at its best.
 */

import { Doctor } from "@/types/doctor.type";

/* ─── Types for new features ─── */

export interface DoctorReview {
  id: string;
  patientName: string;
  patientInitials: string;
  rating: number;
  date: string;
  condition: string;
  text: string;
  isVerified: boolean;
  helpfulCount: number;
  consultationType?: 'in-person' | 'online' | 'home-visit';
}

export interface DoctorFAQ {
  id: string;
  question: string;
  answer: string;
  votes: number;
  askedDate: string;
  category: string;
}

export interface DoctorAward {
  id: string;
  title: string;
  year: string;
  organization: string;
}

export interface DoctorPublication {
  id: string;
  title: string;
  journal: string;
  year: string;
  link?: string;
}

export interface DoctorStats {
  totalPatients: number;
  successRate: number;
  yearsExperience: number;
  averageRating: number;
  totalReviews: number;
  onlineConsults: number;
}

/* ─── Mock Reviews ─── */

export const MOCK_REVIEWS: DoctorReview[] = [
  {
    id: "r1",
    patientName: "Ahmed Rahman",
    patientInitials: "AR",
    rating: 5,
    date: "2026-04-10",
    condition: "Chest Pain Evaluation",
    text: "Dr. Rahman is exceptionally thorough. He spent over 30 minutes explaining my ECG results and medication options. The staff at Square Hospital was also very accommodating. Highly recommend for anyone dealing with cardiac concerns.",
    isVerified: true,
    helpfulCount: 24,
  },
  {
    id: "r2",
    patientName: "Fatima Begum",
    patientInitials: "FB",
    rating: 5,
    date: "2026-04-05",
    condition: "Heart Palpitations",
    text: "After visiting multiple doctors, I finally found someone who actually listened. Dr. Rahman immediately identified the issue and prescribed the right medication. Within a week, my palpitations had significantly reduced. A truly compassionate physician.",
    isVerified: true,
    helpfulCount: 18,
  },
  {
    id: "r3",
    patientName: "Karim Uddin",
    patientInitials: "KU",
    rating: 4,
    date: "2026-03-28",
    condition: "Hypertension Management",
    text: "Very knowledgeable doctor. The only minor issue was the waiting time, but the consultation itself was excellent. He adjusted my blood pressure medication and gave detailed lifestyle advice.",
    isVerified: true,
    helpfulCount: 12,
  },
  {
    id: "r4",
    patientName: "Nasreen Akter",
    patientInitials: "NA",
    rating: 5,
    date: "2026-03-20",
    condition: "Post-Surgery Follow-up",
    text: "Had my follow-up after a cardiac procedure. Dr. Rahman was very reassuring and reviewed all my reports meticulously. The home visit option was a lifesaver as I couldn't travel easily post-surgery.",
    isVerified: true,
    helpfulCount: 31,
  },
  {
    id: "r5",
    patientName: "Mizanur Hoque",
    patientInitials: "MH",
    rating: 5,
    date: "2026-03-15",
    condition: "Arrhythmia Diagnosis",
    text: "Outstanding care from start to finish. The booking process through MyDoctor was seamless, and the live queue feature saved me hours of waiting. Dr. Rahman diagnosed my arrhythmia correctly when two other specialists missed it.",
    isVerified: true,
    helpfulCount: 45,
  },
  {
    id: "r6",
    patientName: "Tania Islam",
    patientInitials: "TI",
    rating: 4,
    date: "2026-03-08",
    condition: "Cholesterol Management",
    text: "Professional and well-organized practice. Dr. Rahman took the time to explain the difference between good and bad cholesterol and created a personalized diet plan alongside medication.",
    isVerified: false,
    helpfulCount: 8,
  },
  {
    id: "r7",
    patientName: "Rafiq Ahmed",
    patientInitials: "RA",
    rating: 5,
    date: "2026-02-25",
    condition: "Heart Failure Management",
    text: "My father has been seeing Dr. Rahman for the past 2 years for heart failure. His condition has improved dramatically. The doctor always makes time for our questions and ensures we understand every aspect of the treatment.",
    isVerified: true,
    helpfulCount: 56,
  },
  {
    id: "r8",
    patientName: "Shirin Sultana",
    patientInitials: "SS",
    rating: 5,
    date: "2026-02-18",
    condition: "Preventive Cardiac Screening",
    text: "Had a comprehensive cardiac screening done. Dr. Rahman was incredibly meticulous with the Echo and stress test interpretations. He found early signs of valve issues that other doctors had missed during routine checkups.",
    isVerified: true,
    helpfulCount: 29,
  },
];

/* ─── Mock FAQs ─── */

export const MOCK_FAQS: DoctorFAQ[] = [
  {
    id: "faq1",
    question: "What conditions does the doctor specialize in treating?",
    answer:
      "The doctor specializes in a comprehensive range of cardiovascular conditions including coronary artery disease, heart failure, arrhythmias, valvular heart disease, hypertension, and preventive cardiology. The practice also covers cardiac rehabilitation and post-surgical follow-up care.",
    votes: 42,
    askedDate: "2026-03-01",
    category: "Specialization",
  },
  {
    id: "faq2",
    question: "How long does a typical consultation take?",
    answer:
      "A first-time consultation typically takes 20-30 minutes, which includes a thorough review of your medical history, physical examination, and discussion of treatment options. Follow-up visits usually take 10-15 minutes unless additional testing is required.",
    votes: 38,
    askedDate: "2026-02-20",
    category: "Appointments",
  },
  {
    id: "faq3",
    question: "Do I need to bring any reports for my first visit?",
    answer:
      "Yes, please bring all previous medical records, recent blood test results, ECG reports, and imaging studies (if any). Also bring a list of current medications with dosages. This helps provide the most accurate diagnosis and treatment plan from the very first visit.",
    votes: 35,
    askedDate: "2026-02-15",
    category: "Preparation",
  },
  {
    id: "faq4",
    question: "Is online consultation available?",
    answer:
      "Yes, online video consultations are available for follow-up visits and non-emergency consultations. You can select the 'Online' option during booking. A stable internet connection and a device with a camera are required. Prescriptions will be sent digitally after the session.",
    votes: 56,
    askedDate: "2026-01-10",
    category: "Appointments",
  },
  {
    id: "faq5",
    question: "What is the cancellation and rescheduling policy?",
    answer:
      "Appointments can be cancelled or rescheduled up to 4 hours before the scheduled time at no charge. Late cancellations or no-shows may result in a partial fee. We recommend rescheduling early to allow other patients to use the slot.",
    votes: 28,
    askedDate: "2026-01-05",
    category: "Policy",
  },
  {
    id: "faq6",
    question: "Does the doctor accept insurance or offer payment plans?",
    answer:
      "The consultation fee is payable directly. However, most health insurance providers reimburse specialist consultations. We provide detailed receipts for insurance claims. For patients requiring extensive treatment, we can discuss flexible payment arrangements.",
    votes: 33,
    askedDate: "2025-12-20",
    category: "Payment",
  },
];

/* ─── Mock Awards ─── */

export const MOCK_AWARDS: DoctorAward[] = [
  {
    id: "aw1",
    title: "Best Cardiologist Award",
    year: "2025",
    organization: "Bangladesh Medical Association",
  },
  {
    id: "aw2",
    title: "Excellence in Cardiac Surgery",
    year: "2023",
    organization: "South Asian Heart Foundation",
  },
  {
    id: "aw3",
    title: "Distinguished Physician of the Year",
    year: "2021",
    organization: "Dhaka Medical College Alumni Association",
  },
];

/* ─── Mock Publications ─── */

export const MOCK_PUBLICATIONS: DoctorPublication[] = [
  {
    id: "pub1",
    title: "Advances in Minimally Invasive Cardiac Interventions in South Asia",
    journal: "Bangladesh Journal of Cardiology",
    year: "2025",
  },
  {
    id: "pub2",
    title: "Prevalence and Risk Factors of Hypertension Among Urban Populations",
    journal: "Journal of Preventive Medicine",
    year: "2024",
  },
  {
    id: "pub3",
    title: "Outcomes of Coronary Artery Bypass Grafting: A 5-Year Follow-up Study",
    journal: "Asian Cardiovascular & Thoracic Annals",
    year: "2023",
  },
];

/* ─── Mock Stats ─── */

export const MOCK_STATS: DoctorStats = {
  totalPatients: 12500,
  successRate: 98.7,
  yearsExperience: 15,
  averageRating: 4.9,
  totalReviews: 847,
  onlineConsults: 3200,
};

/* ─── Mock Schedule Data ─── */

export const MOCK_LOCATION_SCHEDULES = [
  {
    hospitalId: "h1",
    hospitalName: "Square Hospital",
    hospitalLogo: "",
    hospitalCover: "",
    hospitalAddress: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka 1205",
    hospitalPhone: "+880 2-8159457",
    hospitalEmail: "info@squarehospital.com",
    hospitalMapUrl: "https://maps.google.com/?q=Square+Hospital+Dhaka",
    schedules: [
      { day: "Saturday", startTime: "05:00 PM", endTime: "09:00 PM", isAvailable: true },
      { day: "Sunday", startTime: "05:00 PM", endTime: "09:00 PM", isAvailable: true },
      { day: "Monday", startTime: "05:00 PM", endTime: "09:00 PM", isAvailable: true },
      { day: "Tuesday", startTime: "05:00 PM", endTime: "09:00 PM", isAvailable: false },
      { day: "Wednesday", startTime: "05:00 PM", endTime: "09:00 PM", isAvailable: true },
      { day: "Thursday", startTime: "05:00 PM", endTime: "09:00 PM", isAvailable: false },
      { day: "Friday", startTime: "10:00 AM", endTime: "02:00 PM", isAvailable: true },
    ],
  },
  {
    hospitalId: "h2",
    hospitalName: "Evercare Hospital",
    hospitalLogo: "",
    hospitalCover: "",
    hospitalAddress: "Plot 81, Block E, Bashundhara R/A, Dhaka 1229",
    hospitalPhone: "+880 2-8431661",
    hospitalEmail: "info@evercarebd.com",
    hospitalMapUrl: "https://maps.google.com/?q=Evercare+Hospital+Dhaka",
    schedules: [
      { day: "Saturday", startTime: "10:00 AM", endTime: "01:00 PM", isAvailable: false },
      { day: "Sunday", startTime: "10:00 AM", endTime: "01:00 PM", isAvailable: true },
      { day: "Monday", startTime: "10:00 AM", endTime: "01:00 PM", isAvailable: false },
      { day: "Tuesday", startTime: "10:00 AM", endTime: "01:00 PM", isAvailable: true },
      { day: "Wednesday", startTime: "10:00 AM", endTime: "01:00 PM", isAvailable: false },
      { day: "Thursday", startTime: "10:00 AM", endTime: "01:00 PM", isAvailable: true },
      { day: "Friday", startTime: "10:00 AM", endTime: "01:00 PM", isAvailable: false },
    ],
  },
];

/* ─── Conditions Treated (mock) ─── */

export const MOCK_CONDITIONS = [
  "Coronary Artery Disease",
  "Heart Failure",
  "Atrial Fibrillation",
  "Hypertension",
  "Aortic Stenosis",
  "Mitral Valve Prolapse",
  "Cardiomyopathy",
  "Angina Pectoris",
  "Deep Vein Thrombosis",
  "Peripheral Artery Disease",
  "Cardiac Arrhythmia",
  "Congestive Heart Failure",
];

/* ─── Insurances Accepted (mock) ─── */

export const MOCK_INSURANCES = [
  "MetLife Bangladesh",
  "Green Delta Insurance",
  "Pragati Life Insurance",
  "Guardian Life Insurance",
  "Meghna Life Insurance",
  "Delta Life Insurance",
];

/* ─── Full Mock Doctor ─── */

export const MOCK_DOCTOR: Doctor = {
  id: "mock-doctor-001",
  name: "Prof. Dr. Md. Abdur Rahman",
  slug: "prof-dr-md-abdur-rahman",
  photo: "/images/doctor-placeholder.jpg",
  degrees: ["MBBS", "FCPS (Medicine)", "MD (Cardiology)", "FACC (USA)"],
  primarySpecialty: "Cardiology",
  shortDescription:
    "Senior Consultant & Chief of Cardiac Surgery with 15+ years of experience in interventional cardiology and heart failure management.",
  bmdcRegNo: "A-32451",
  about:
    "Prof. Dr. Md. Abdur Rahman is a highly acclaimed cardiologist and cardiac surgeon with over 15 years of dedicated experience in treating complex cardiovascular conditions. A graduate of Dhaka Medical College with advanced training from the Royal College of Physicians (UK) and the American College of Cardiology, he has performed over 5,000 successful cardiac interventions.\n\nHis clinical approach combines cutting-edge technology with personalized patient care, ensuring each treatment plan is tailored to the individual's unique medical profile. He is particularly known for his expertise in minimally invasive cardiac procedures and his compassionate bedside manner.\n\nBeyond clinical practice, Prof. Rahman is an active researcher and educator, having published numerous papers in international medical journals and mentored the next generation of cardiologists across Bangladesh.",
  email: "dr.rahman@example.com",
  phone: "+880 1711-XXXXXX",
  isAvailableHome: true,
  specializations: [
    { id: "spec1", name: "Interventional Cardiology", slug: "interventional-cardiology", image: "" },
    { id: "spec2", name: "Heart Failure Management", slug: "heart-failure-management", image: "" },
    { id: "spec3", name: "Cardiac Electrophysiology", slug: "cardiac-electrophysiology", image: "" },
    { id: "spec4", name: "Preventive Cardiology", slug: "preventive-cardiology", image: "" },
    { id: "spec5", name: "Echocardiography", slug: "echocardiography", image: "" },
  ],
  educations: [
    "MBBS — Dhaka Medical College, University of Dhaka (2005)",
    "FCPS (Medicine) — Bangladesh College of Physicians & Surgeons (2010)",
    "MD (Cardiology) — National Heart Foundation Hospital (2013)",
    "Fellowship (FACC) — American College of Cardiology, USA (2015)",
    "Advanced Training — Royal Brompton Hospital, London, UK (2016)",
  ],
  chambers: [
    {
      id: "h1",
      name: "Square Hospital",
      address: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka 1205",
      mapUrl: "https://maps.google.com/?q=Square+Hospital+Dhaka",
      availability: ["Saturday: 5:00 PM – 9:00 PM", "Sunday: 5:00 PM – 9:00 PM", "Monday: 5:00 PM – 9:00 PM"],
      consultationMethod: ["Face to Face", "Online"],
      appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"],
    },
    {
      id: "h2",
      name: "Evercare Hospital",
      address: "Plot 81, Block E, Bashundhara R/A, Dhaka 1229",
      mapUrl: "https://maps.google.com/?q=Evercare+Hospital+Dhaka",
      availability: ["Sunday: 10:00 AM – 1:00 PM", "Tuesday: 10:00 AM – 1:00 PM"],
      consultationMethod: ["Face to Face"],
      appointmentTypes: ["New Patient", "Follow Up", "Reference"],
    },
  ],
  services: [
    "Angioplasty",
    "Cardiac Catheterization",
    "Echocardiography",
    "Stress Testing",
    "Holter Monitoring",
    "Pacemaker Implantation",
    "Heart Valve Repair",
    "Coronary Bypass Surgery",
  ],
  videos: [
    {
      id: "v1",
      title: "Understanding Coronary Artery Disease: Prevention & Treatment",
      thumbnail: "",
      url: "https://youtube.com/watch?v=example1",
    },
    {
      id: "v2",
      title: "Heart Attack Warning Signs You Should Never Ignore",
      thumbnail: "",
      url: "https://youtube.com/watch?v=example2",
    },
    {
      id: "v3",
      title: "Living with Heart Failure: A Patient's Guide",
      thumbnail: "",
      url: "https://youtube.com/watch?v=example3",
    },
  ],
  fee: 1500,
  rating: 4.9,
  reviewCount: 847,
  experience: "15+ Years",
  locationSchedules: MOCK_LOCATION_SCHEDULES,
};
