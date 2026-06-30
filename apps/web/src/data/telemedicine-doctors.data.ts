import { TDoctor } from "./doctors.data";

export const TELEMEDICINE_DOCTORS_DATA: TDoctor[] = [
  {
    id: "dr-md-monzurul-haque",
    slug: "dr-md-monzurul-haque",
    name: "Dr. Md Monzurul Haque",
    image:
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVWUGCwhmWz0/doctors/6958/BGmtQDaOkM2BgctS8N2x5oafUonw4UY6M6WcoW1A/dr-dr-md-monzurul-haque.webp",
    specialties: [
      "Dermatologist",
      "Allergy Skin-VD",
      "Aesthetic Dermatologist",
      "Sexual Medicine Specialist",
      "Laser Dermatosurgeon",
      "Pediatric Dermatologist",
      "Dermatosurgeon",
    ],
    specialty: "Dermatologist",
    degrees: ["MBBS", "DDV", "MRCP (FP)"],
    fee: 400,
    isOnline: true,
    rating: 4.3,
    ratingCount: 6,
    experienceYears: 10, // Added to satisfy TDoctor if needed or just optional
    specializationSlug: "aesthetic-dermatologist",
  },
  {
    id: "prof-dr-md-hadiuzzaman",
    slug: "prof-dr-md-hadiuzzaman",
    name: "Prof. Dr. Md Hadiuzzaman",
    image:
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVWUGCwhmWz0/doctors/9404/YWwfyusopC6Lom4x2V8PYOSY6qJrnAJDF5XI6miC/prof-dr-md-hadiuzzaman.webp",
    specialties: [
      "Dermatologist",
      "Dermatosurgeon",
      "Allergy Skin-VD",
      "Aesthetic Dermatologist",
      "Cosmetologist",
      "Infertility Specialist",
      "Laser Dermatosurgeon",
      "Sexual Medicine Specialist",
    ],
    specialty: "Dermatologist",
    degrees: ["MBBS", "FCPS (Skin and VD)"],
    fee: 200,
    isOnline: true,
    experienceYears: 7,
    specializationSlug: "aesthetic-dermatologist",
  },
];
