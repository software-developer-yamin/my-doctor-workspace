export type THospitalDetails = {
  id: string;
  displayId: string;
  name: string;
  image: string;
  yearsInService?: number;
  address: string;
  mapUrl?: string;
  about: string;
  mission?: string;
  vision?: string;
  specialties: string[];
  facilities: string[];
  contact: {
    phones: string[];
    emails: string[];
    website?: string;
    emergency?: string;
  };
  stats?: {
    totalBeds?: number;
    icuBeds?: number;
    doctorsCount?: number;
    patientSatisfied?: string;
  };
  openingHours?: {
    day: string;
    time: string;
    isClosed?: boolean;
  }[];
  insurancePartners?: {
    name: string;
    logo?: string;
  }[];
  awards?: string[];
  doctors: {
    id: string;
    slug?: string;
    name: string;
    specialty: string;
    image: string;
    degrees: string[];
  }[];
  nurses?: {
    id: string;
    slug?: string;
    name: string;
    specialty: string;
    image: string;
    certifications: string[];
  }[];
  services: {
    name: string;
    description?: string;
  }[];
};

export const HOSPITAL_DETAILS_DATA: THospitalDetails[] = [
  {
    id: "aalok-healthcare-ltd-branch-03-pallabi",
    displayId: "HPL-001",
    name: "Aalok Healthcare Ltd. | (Branch 03) - Pallabi",
    image: "/images/hospitals/aalok-pallabi.webp",
    yearsInService: 15,
    address: "2/6 Pallabi, Mirpur (11-1/2), Dhaka-1221, Bangladesh",
    mapUrl: "https://www.google.com/maps/embed/v1/place?key=AIzaSyCCz5He9-emL9wHLDx35EXQEsGYRny-Utc&q=Aalok+Healthcare+Ltd.+Pallabi",
    about: "Aalok Healthcare Ltd. is a leading healthcare provider in Bangladesh, committed to providing world-class medical services at an affordable cost. Our Pallabi branch is equipped with state-of-the-art diagnostic facilities and a team of highly experienced doctors and nurses. We prioritize patient care and safety above all else, ensuring a comfortable and healing environment for everyone who walks through our doors.",
    mission: "To deliver high-quality, cost-effective healthcare services to our community through excellence in medical practice, advanced technology, and compassionate care.",
    vision: "To be the most trusted healthcare partner in the region, known for our clinical excellence and patient-centric approach.",
    specialties: ["Gynaecology", "Pediatrics", "Cardiology", "Medicine", "Surgery", "Orthopedics"],
    facilities: ["24/7 Emergency", "ICU", "Diagnostic Center", "Pharmacy", "Ambulance", "Cafeteria", "Prayer Room"],
    contact: {
      phones: ["09611530530", "01712345678"],
      emails: ["info@aalokhealthcare.com", "pallabi@aalokhealthcare.com"],
      website: "https://aalokhealthcare.com",
      emergency: "01999999999"
    },
    stats: {
      totalBeds: 150,
      icuBeds: 12,
      doctorsCount: 45,
      patientSatisfied: "98%"
    },
    openingHours: [
      { day: "Saturday", time: "Open 24 Hours" },
      { day: "Sunday", time: "Open 24 Hours" },
      { day: "Monday", time: "Open 24 Hours" },
      { day: "Tuesday", time: "Open 24 Hours" },
      { day: "Wednesday", time: "Open 24 Hours" },
      { day: "Thursday", time: "Open 24 Hours" },
      { day: "Friday", time: "Emergency Only", isClosed: false }
    ],
    insurancePartners: [
      { name: "MetLife Insurance" },
      { name: "Green Delta Insurance" },
      { name: "Pragati Life Insurance" },
      { name: "Delta Life Insurance" }
    ],
    awards: [
      "Best Specialized Hospital 2023 - Health Awards",
      "Excellence in Patient Care 2022",
      "ISO 9001:2015 Certified"
    ],
    doctors: [
      {
        id: "dr-sania-sultana",
        name: "Dr. Sania Sultana",
        specialty: "Gynecologists",
        image: "/images/doctors/default-doctor.webp",
        degrees: ["MBBS", "BCS", "MCPS"]
      }
    ],
    nurses: [
      {
        id: "n-001",
        slug: "nurse-fatima-begum",
        name: "Fatima Begum",
        specialty: "ICU / Critical Care Nursing",
        image: "/images/doctors/default-doctor.webp",
        certifications: ["B.Sc. in Nursing", "ICU Certified"]
      }
    ],
    services: [
      { name: "Indoor & Outdoor Consultation", description: "Expert medical advice and follow-up care for both admitted patients and outpatients." },
      { name: "Advanced Diagnostic Imaging", description: "State-of-the-art MRI, CT scan, and X-ray facilities for accurate diagnosis." },
      { name: "Critical Care (ICU & NICU)", description: "Round-the-clock monitoring and specialized care for patients in critical condition." },
      { name: "24/7 Pharmacy & Ambulance", description: "Immediate access to medications and emergency transport services anytime." },
      { name: "Modern Operation Theatres", description: "Fully equipped surgical suites with advanced sterilization and technology." },
      { name: "Physiotherapy & Rehabilitation", description: "Customized therapy sessions to help patients recover and regain mobility." }
    ]
  },
  {
    id: "ibn-sina-primary-healthcare-centres-narail",
    displayId: "HPL-002",
    name: "Ibn Sina Primary Healthcare Centres, Narail",
    image: "/images/hospitals/default-hospital.webp",
    yearsInService: 11,
    address: "Old Bus Terminal, Narail, Narail-7500, Bangladesh",
    mapUrl: "https://www.google.com/maps/embed/v1/place?key=AIzaSyCCz5He9-emL9wHLDx35EXQEsGYRny-Utc&q=Ibn%20Sina%20Primary%20Healthcare%20Centres%2C%20Narail",
    about: "Ibn Sina Primary Healthcare Centre in Narail provides essential medical services with a focus on accessibility and excellence. Part of the renowned Ibn Sina Trust, this facility offers primary care, diagnostics, and specialist consultations to the regional community.",
    mission: "To provide quality healthcare services at an affordable cost for all levels of society.",
    vision: "To establish a healthcare system based on ethics and excellence.",
    specialties: ["Endocrinologist", "General Medicine", "Pediatrics"],
    facilities: ["24/7 Emergency", "Diagnostic Center", "Pharmacy", "Ambulance"],
    contact: {
      phones: ["09611530530"],
      emails: ["info@ibnsinanarail.com"],
      website: "https://ibnsinahospital.com",
      emergency: "09611530531"
    },
    stats: {
      totalBeds: 50,
      icuBeds: 4,
      doctorsCount: 15,
      patientSatisfied: "95%"
    },
    openingHours: [
      { day: "Saturday", time: "08:00 AM - 10:00 PM" },
      { day: "Sunday", time: "08:00 AM - 10:00 PM" },
      { day: "Monday", time: "08:00 AM - 10:00 PM" },
      { day: "Tuesday", time: "08:00 AM - 10:00 PM" },
      { day: "Wednesday", time: "08:00 AM - 10:00 PM" },
      { day: "Thursday", time: "08:00 AM - 10:00 PM" },
      { day: "Friday", time: "Emergency Only" }
    ],
    doctors: [
      {
        id: "dr-example-endocrinologist",
        name: "Dr. Example Name",
        specialty: "Endocrinologist",
        image: "/images/doctors/default-doctor.webp",
        degrees: ["MBBS", "FCPS"]
      }
    ],
    nurses: [
       {
        id: "n-002",
        slug: "nurse-sohel-rana",
        name: "Sohel Rana",
        specialty: "General & Elderly Care",
        image: "/images/doctors/default-doctor.webp",
        certifications: ["Diploma in Nursing", "BNC Registered"]
       }
    ],
    services: [
      { name: "GP Consultation", description: "General primary healthcare consultations for all ages." },
      { name: "Pathology & Radiology", description: "Comprehensive laboratory and imaging services for diagnostic accuracy." },
      { name: "Vaccination Center", description: "Essential immunization services for children and adults." },
      { name: "Pharmacy Services", description: "In-house pharmacy with a wide range of genuine medications." }
    ]
  },
];
