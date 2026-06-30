export type TDoctorDetails = {
  id: string;
  displayId: string;
  name: string;
  image: string;
  degrees: string[];
  specialty: string;
  experienceYears: number;
  bmdcReg: string;
  about: string;
  education: string[];
  fieldOfConcentration: string[];
  specializations: string[];
  chambers: {
    id: string;
    name: string;
    address: string;
    mapUrl?: string;
    availability: string[];
    consultationMethod: string[];
    appointmentTypes: string[];
  }[];
  services: string[];
  videos?: {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
  }[];
};

export const DOCTOR_DETAILS_DATA: TDoctorDetails[] = [
  {
    id: "dr-sania-sultana",
    displayId: "D93CT81",
    name: "Dr. Sania Sultana",
    image: "/images/doctors/default-doctor.webp",
    degrees: ["MBBS", "BCS", "MCPS"],
    specialty: "Gynecologists",
    experienceYears: 8,
    bmdcReg: "Coming Soon",
    about: "Dr. Sania Sultana Gynecologists in Dhaka. Her credentials are MBBS, BCS, MCPS. She is employed at Aalok Healthcare Ltd. She treats her patients at Aalok Healthcare Ltd. | (Branch 03) - Pallabi on a regular basis. For appointments or additional information please contact us at: 09611530530.",
    education: [
      "MBBS - Bachelor of Medicine, Bachelor of Surgery",
      "BCS(Health) - Bangladesh Civil Service",
      "MCPS - Member of the College of Physicians and Surgeons"
    ],
    fieldOfConcentration: [
      "Bacterial Vaginosis",
      "Dysmenorrhea (Menstrual Disorder)",
      "Embolization",
      "Female Sexual Dysfunction",
      "Gynae Problems",
      "Hormone Dirtubances",
      "Hysteroscopy",
      "Menorrhagia (Menstrual Disorder)",
      "Obstetric Trauma",
      "Ovarian Cystectomy",
      "Ovarian Cysts",
      "Pelvic Inflammatory Disease (PID)",
      "Polycystic Ovary Syndrome (PCOS)",
      "Pregnancy Care & Check-up",
      "Premenstrual Syndrome (PMS)",
      "Recurrent Miscarriages",
      "Sexually Transmitted Disease (STD) Treatment",
      "Uterine Fibroids",
      "Vaginal Infection Treatment",
      "Menopause & Perimenopausal Symptoms"
    ],
    specializations: ["Gynaecologist"],
    chambers: [
      {
        id: "14002",
        name: "Aalok Healthcare Ltd. | (Branch 03) - Pallabi",
        address: "2/6 Pallabi, Mirpur (11-1/2), Dhaka-1221, Bangladesh",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25016.769706931398!2d90.32598297431643!3d23.8234682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1e6f9be6b0f%3A0xfb8ec10397dc4bdb!2sAalok%20Healthcare%20Ltd.%20(Pallabi)!5e1!3m2!1sen!2sbd!4v1754669704112!5m2!1sen!2sbd",
        availability: ["Sun Mon Wed Thur 06:00 PM - 09:00 PM"],
        consultationMethod: ["Face to Face"],
        appointmentTypes: ["New Patient", "Follow Up", "Report Show", "Reference"]
      }
    ],
    services: [
        "Bacterial Vaginosis",
        "Dysmenorrhea (Menstrual Disorder)",
        "Embolization",
        "Female Sexual Dysfunction",
        "Gynae Problems"
    ],
    videos: [
        {
            id: "1",
            title: "Understanding Women's Health",
            thumbnail: "/images/videos/thumb-1.webp",
            url: "https://youtube.com/..."
        }
    ]
  },
];
