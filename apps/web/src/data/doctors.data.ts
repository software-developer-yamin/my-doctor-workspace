export type TDoctor = {
  id: string;
  slug: string;
  displayId?: string;
  name: string;
  image: string;
  degrees: string[];
  specialty: string;
  specialties?: string[];
  experienceYears: number;
  chamber?: {
    name: string;
    address: string;
    otherLocationsCount?: number;
  };
  chambers?: {
    id: string;
    name: string;
    address: string;
    mapUrl?: string;
    availability: string[];
    consultationMethod?: string[];
    appointmentTypes?: string[];
  }[];
  availability?: string[];
  services?: string[];
  bmdcReg?: string;
  about?: string;
  education?: string[];
  fieldOfConcentration?: string[];
  specializations?: string[];
  videos?: {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
  }[];
  // Telemedicine specific
  fee?: number;
  isOnline?: boolean;
  rating?: number;
  ratingCount?: number;
  specializationSlug?: string;
};

export const DOCTORS_DATA: TDoctor[] = [
  {
    id: "10243",
    slug: "dr-sania-sultana",
    name: "Dr. Sania Sultana",
    image: "/images/doctors/default-doctor.webp", // Can inject default blue illustration or real image
    degrees: ["MBBS", "BCS", "MCPS"],
    specialty: "Gynecologists",
    experienceYears: 8,
    chamber: {
      name: "Aalok Healthcare Ltd. | (Branch 03) - Pallabi",
      address: "2/6 Pallabi, Mirpur (11-1/2), Dhaka-1221, Bangladesh",
    },
    availability: ["Sun Mon Wed Thur 06:00 PM - 09:00 PM"],
    services: [
      "Bacterial Vaginosis",
      "Dysmenorrhea (Menstrual Disorder)",
      "Embolization",
      "Female Sexual Dysfunction",
      "Gynae Problems",
      "Hormone Dirtubances",
      "Hysteroscopy",
      "Menorrhagia (Menstrual Disorder)",
    ],
  },
  {
    id: "10233",
    slug: "dr-md-asaduzzaman-sumon",
    name: "Dr. Md Asaduzzaman Sumon",
    image:
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVWUGCwhmWz0/doctors/10233/avMqt0tgXX98rSRnACpf8m2105nt0VlF8DAUaB6C/dr-md-asaduzzaman-sumon.webp",
    degrees: ["MBBS", "BCS", "DEM"],
    specialty: "Endocrinologist",
    experienceYears: 10,
    chamber: {
      name: "Ibn Sina Hospital & Diagnostic Center | Jessore",
      address: "House No # 68, Jail Road, Daratana, Jessore-7400, Bangladesh",
      otherLocationsCount: 2,
    },
    availability: ["Sat Mon Wed 02:30 PM - 05:00 PM"],
    services: [
      "Adrenal Disorders",
      "Adrenal Gland Disorders",
      "Bioidentical hormone therapies",
      "Hormone-producing adrenal and pituitary glands",
      "Goiter Treatment",
    ],
  },
  {
    id: "10231",
    slug: "dr-md-zahangir-alom-moni",
    name: "Dr. Md. Zahangir Alom Moni",
    image: "/images/doctors/default-doctor.webp",
    degrees: ["MBBS", "BCS", "MS"],
    specialty: "Plastic Surgeon",
    experienceYears: 10,
    chamber: {
      name: "Aalok Hospital Ltd. | Mirpur Section - 6",
      address: "Home-1, Road-5, Block-A, Section-6, Dhaka-1216, Bangladesh",
    },
    availability: ["Sat Sun Mon Tue Wed Thur 04:00 PM - 06:00 PM"],
    services: [
      "Acell Matrix Hair Transplantation",
      "Acne Treatment",
      "Birthmark Reduction",
      "Body Contouring Surgery",
      "Burn Scar Reconstruction",
    ],
  },
];
