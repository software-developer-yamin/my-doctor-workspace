export type TNurse = {
  id: string;
  slug: string;
  name: string;
  image: string;
  certifications: string[];
  specialty: string;
  experienceYears: number;
  location: {
    name: string;
    address: string;
  };
  availability: string[];
  services: string[];
  gender: "Male" | "Female";
  isAvailableForHome: boolean;
};

export const NURSES_DATA: TNurse[] = [
  {
    id: "n-001",
    slug: "nurse-fatima-begum",
    name: "Fatima Begum",
    image: "/images/doctors/default-doctor.webp",
    certifications: ["B.Sc. in Nursing", "ICU Certified", "BNC Registered"],
    specialty: "ICU / Critical Care Nursing",
    experienceYears: 7,
    gender: "Female",
    isAvailableForHome: true,
    location: {
      name: "Dhaka Medical College Hospital",
      address: "Secretariat Rd, Dhaka-1000, Bangladesh",
    },
    availability: ["Sun Mon Wed 08:00 AM – 04:00 PM", "On-call: Fri Sat"],
    services: [
      "IV Cannulation",
      "Wound Dressing",
      "Medication Administration",
      "Vitals Monitoring",
      "Post-Op Care",
      "Catheter Care",
    ],
  },
  {
    id: "n-002",
    slug: "nurse-sohel-rana",
    name: "Sohel Rana",
    image: "/images/doctors/default-doctor.webp",
    certifications: ["Diploma in Nursing", "BNC Registered"],
    specialty: "General & Elderly Care",
    experienceYears: 5,
    gender: "Male",
    isAvailableForHome: true,
    location: {
      name: "Square Hospital Ltd.",
      address: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, Dhaka-1205, Bangladesh",
    },
    availability: ["Mon Tue Thu Fri 10:00 AM – 06:00 PM"],
    services: [
      "Elderly Assistance",
      "Daily Hygiene Care",
      "Medication Reminders",
      "Blood Pressure Monitoring",
      "Patient Mobility Support",
    ],
  },
  {
    id: "n-003",
    slug: "nurse-nusrat-jahan",
    name: "Nusrat Jahan",
    image: "/images/doctors/default-doctor.webp",
    certifications: ["B.Sc. in Nursing", "Neonatal Nursing Certified", "BNC Registered"],
    specialty: "Neonatal & Pediatric Care",
    experienceYears: 9,
    gender: "Female",
    isAvailableForHome: false,
    location: {
      name: "Bangladesh Shishu Hospital",
      address: "Sher-e-Bangla Nagar, Dhaka-1207, Bangladesh",
    },
    availability: ["Sat Sun Tue Wed Thu 09:00 AM – 05:00 PM"],
    services: [
      "Newborn Care",
      "NICU Support",
      "Feeding Assistance",
      "Pediatric Wound Care",
      "Immunization Support",
      "Post-Delivery Mother Care",
    ],
  },
];
