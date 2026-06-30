export type TPressRelease = {
  id: string;
  date: string;
  headline: string;
  summary: string;
  relatedHospital?: string;
  downloadUrl?: string;
};

export type TMediaContact = {
  name: string;
  title: string;
  email: string;
  phone: string;
};

export type TNewsItem = {
  id: string;
  source: string;
  headline: string;
  url: string;
  date: string;
};

export const PRESS_MEDIA_CONTACT: TMediaContact = {
  name: "Tasnim Hossain",
  title: "Head of Communications, My Doctor",
  email: "press@mydoctor.com.bd",
  phone: "+8801974-200905",
};

export const PRESS_RELEASES: TPressRelease[] = [
  {
    id: "pr1",
    date: "2026-06-15",
    headline:
      "My Doctor Expands Telemedicine Coverage to 8 New Districts, Reaching Over 10 Million New Patients",
    summary:
      "My Doctor announced today the expansion of its telemedicine services to Sylhet, Rajshahi, Barishal, Khulna, Mymensingh, Rangpur, Comilla, and Gazipur. Starting July 2026, patients in these regions can connect with verified physicians via voice and video consultation.",
    relatedHospital: "My Doctor Network",
  },
  {
    id: "pr2",
    date: "2026-05-20",
    headline:
      "My Doctor Partners with 50 New Hospitals Across Bangladesh in Q2 2026",
    summary:
      "My Doctor has onboarded 50 additional hospitals and diagnostic centres to its platform in the second quarter of 2026, bringing the total partner network to over 200 verified facilities nationwide.",
    relatedHospital: "Multiple Partners",
  },
  {
    id: "pr3",
    date: "2026-04-10",
    headline:
      "My Doctor Launches Live Queue Management System for Doctor Chambers",
    summary:
      "My Doctor introduced its live serial queue feature, enabling patients to track their appointment position in real time and receive updates via SMS before visiting their doctor's chamber.",
    relatedHospital: "Narsingdi General Hospital",
  },
  {
    id: "pr4",
    date: "2026-03-05",
    headline:
      "My Doctor Crosses 500,000 Patient Registrations Milestone",
    summary:
      "My Doctor has surpassed 500,000 registered patients on its platform, making it one of Bangladesh's fastest-growing digital healthcare services. The platform facilitates over 15,000 consultations per month.",
    relatedHospital: "My Doctor Platform",
  },
  {
    id: "pr5",
    date: "2026-02-14",
    headline:
      "My Doctor Secures Series A Funding to Expand Rural Healthcare Access",
    summary:
      "My Doctor announced the successful close of a Series A funding round to accelerate rural healthcare access, with a focus on connecting patients in underserved upazila-level communities with specialist physicians.",
    relatedHospital: "My Doctor HQ, Narsingdi",
  },
  {
    id: "pr6",
    date: "2026-01-20",
    headline:
      "My Doctor Introduces Ambulance Tracking and Emergency Booking Feature",
    summary:
      "My Doctor's new ambulance module enables patients to book certified emergency vehicles, track arrival in real time, and confirm patient handover — all within the My Doctor app.",
    relatedHospital: "My Doctor Platform",
  },
];

export const PRESS_NEWS_ITEMS: TNewsItem[] = [
  {
    id: "n1",
    source: "The Daily Star",
    headline: "Tech Startup My Doctor is Reshaping Healthcare Access in Bangladesh",
    url: "#",
    date: "2026-05-28",
  },
  {
    id: "n2",
    source: "Prothom Alo",
    headline: "ডিজিটাল স্বাস্থ্যসেবায় নতুন দিগন্ত — মাই ডক্টর",
    url: "#",
    date: "2026-04-15",
  },
  {
    id: "n3",
    source: "bdnews24",
    headline: "My Doctor Brings Specialist Consultations to Remote Bangladesh",
    url: "#",
    date: "2026-03-22",
  },
];
