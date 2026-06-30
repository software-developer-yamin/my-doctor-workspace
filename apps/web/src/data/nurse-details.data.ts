export type TNurseDetails = {
  id: string;
  displayId: string;
  name: string;
  image: string;
  certifications: string[];
  specialty: string;
  experienceYears: number;
  bncReg: string;
  gender: "Male" | "Female";
  isAvailableForHome: boolean;
  about: string;
  education: string[];
  skills: string[];
  services: string[];
  location: {
    id: string;
    name: string;
    address: string;
    mapUrl?: string;
    availability: string[];
    visitType: string[];
  }[];
};

export const NURSE_DETAILS_DATA: TNurseDetails[] = [
  {
    id: "nurse-fatima-begum",
    displayId: "N93UR01",
    name: "Fatima Begum",
    image: "/images/doctors/default-doctor.webp",
    certifications: ["B.Sc. in Nursing", "ICU Certified", "BNC Registered"],
    specialty: "ICU / Critical Care Nursing",
    experienceYears: 7,
    bncReg: "BNC-2017-0041",
    gender: "Female",
    isAvailableForHome: true,
    about:
      "Fatima Begum is a highly experienced critical care nurse with 7 years of hands-on experience in ICU and emergency settings. She has worked with leading hospitals in Dhaka and is certified for advanced life support procedures. She is also available for home visits for post-operative care, wound dressing, and IV management.",
    education: [
      "B.Sc. in Nursing — Dhaka Nursing College",
      "ICU Critical Care Certification — Bangladesh Nursing Council",
      "Basic Life Support (BLS) Certified",
    ],
    skills: [
      "Advanced IV Cannulation",
      "ECG Monitoring",
      "Ventilator Management",
      "Infection Control",
      "Patient Communication",
      "Emergency Response",
    ],
    services: [
      "IV Cannulation",
      "Wound Dressing",
      "Medication Administration",
      "Vitals Monitoring",
      "Post-Op Care",
      "Catheter Care",
      "NG Tube Management",
      "Oxygen Therapy",
    ],
    location: [
      {
        id: "loc-001",
        name: "Dhaka Medical College Hospital",
        address: "Secretariat Rd, Dhaka-1000, Bangladesh",
        mapUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.6!2d90.3966!3d23.7261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQzJzM0LjEiTiA5MMKwMjMnNDcuMiJF!5e0!3m2!1sen!2sbd!4v1234567890",
        availability: ["Sun Mon Wed 08:00 AM – 04:00 PM", "On-call: Fri Sat"],
        visitType: ["Hospital", "Home Visit"],
      },
    ],
  },
  {
    id: "nurse-sohel-rana",
    displayId: "N93UR02",
    name: "Sohel Rana",
    image: "/images/doctors/default-doctor.webp",
    certifications: ["Diploma in Nursing", "BNC Registered"],
    specialty: "General & Elderly Care",
    experienceYears: 5,
    bncReg: "BNC-2019-0128",
    gender: "Male",
    isAvailableForHome: true,
    about:
      "Sohel Rana is a registered nurse specializing in general and elderly care. With 5 years of experience, he provides compassionate and professional nursing services. He is adept at managing chronic conditions among elderly patients and provides daily assistance including hygiene care and medication management.",
    education: [
      "Diploma in Nursing — Sylhet Nursing Institute",
      "Bangladesh Nursing Council Registered",
      "Elderly Care Certification",
    ],
    skills: [
      "Elderly Patient Handling",
      "Chronic Disease Management",
      "Medication Management",
      "Fall Prevention",
      "Empathetic Communication",
    ],
    services: [
      "Elderly Assistance",
      "Daily Hygiene Care",
      "Medication Reminders",
      "Blood Pressure Monitoring",
      "Patient Mobility Support",
      "Companion Care",
    ],
    location: [
      {
        id: "loc-002",
        name: "Square Hospital Ltd.",
        address: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, Dhaka-1205, Bangladesh",
        availability: ["Mon Tue Thu Fri 10:00 AM – 06:00 PM"],
        visitType: ["Hospital", "Home Visit"],
      },
    ],
  },
  {
    id: "nurse-nusrat-jahan",
    displayId: "N93UR03",
    name: "Nusrat Jahan",
    image: "/images/doctors/default-doctor.webp",
    certifications: [
      "B.Sc. in Nursing",
      "Neonatal Nursing Certified",
      "BNC Registered",
    ],
    specialty: "Neonatal & Pediatric Care",
    experienceYears: 9,
    bncReg: "BNC-2015-0077",
    gender: "Female",
    isAvailableForHome: false,
    about:
      "Nusrat Jahan is a highly specialized neonatal and pediatric nurse with 9 years of in-hospital experience. Her expertise lies in NICU support, newborn care, and post-delivery mother care. She has received special training in neonatal resuscitation and pediatric emergency response.",
    education: [
      "B.Sc. in Nursing — Dhaka Nursing College",
      "Neonatal Intensive Care Certification",
      "Pediatric Advanced Life Support (PALS) Certified",
    ],
    skills: [
      "Newborn Resuscitation",
      "NICU Equipment Operation",
      "Breast-feeding Support",
      "Pediatric Assessment",
      "Parent Education",
      "Infection Control",
    ],
    services: [
      "Newborn Care",
      "NICU Support",
      "Feeding Assistance",
      "Pediatric Wound Care",
      "Immunization Support",
      "Post-Delivery Mother Care",
    ],
    location: [
      {
        id: "loc-003",
        name: "Bangladesh Shishu Hospital",
        address: "Sher-e-Bangla Nagar, Dhaka-1207, Bangladesh",
        availability: ["Sat Sun Tue Wed Thu 09:00 AM – 05:00 PM"],
        visitType: ["Hospital Only"],
      },
    ],
  },
];
