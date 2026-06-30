export type THospital = {
  id: string;
  name: string;
  image: string;
  specialtyStats: string;
  patientOpinions: string;
  address: string;
  feeRange: string;
  services?: string[];
  additionalServicesCount?: number;
};

export const HOSPITALS_DATA: THospital[] = [
  {
    id: "hosp-1",
    name: "Probin Hospital",
    image: "/build/q-Dz3ZyfdZ.webp", // Mock placeholder mapping to your structure
    specialtyStats: "2 Doctors with 2 specialities",
    patientOpinions: "0 patients opinion",
    address: "Sayed Mahbub Morshed Rd, Dhaka-1207, Bangladesh",
    feeRange: "1 - 1 Taka",
  },
  {
    id: "hosp-2",
    name: "Women's Children's & General Hospital",
    image:
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVWUGCwhmWz0/hospitals/340/qKPvQmerhs8huGp3ZGd97XzMpaHhgRfPdJlGBFap/womens-childrens-general-hospital.webp",
    specialtyStats: "0 Doctors with 0 specialities",
    patientOpinions: "0 patients opinion",
    address:
      "House-48/6, Road-9/A, Satmasjid Road Dhanmondi R/A, Dhaka-1209, Bangladesh",
    feeRange: "N/A - N/A Taka",
    services: [
      "Mother Care Center",
      "Child Development Center",
      "Prayer Room",
      "General Bed (Female)",
      "General Cabin",
      "Model Pharmacy",
    ],
    additionalServicesCount: 4,
  },
  {
    id: "hosp-3",
    name: "Japan Bangladesh Friendship Hospital",
    image:
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVWUGCwhmWz0/hospitals/339/jr1ZzeO6UET3LIaw7BElQ2h0Ggs8DWFEeItKlq8F/japan-bangladesh-friendship-hospital.webp",
    specialtyStats: "3 Doctors with 6 specialities",
    patientOpinions: "0 patients opinion",
    address: "Zigatola Bus Stand, 55 Satmasjid Road, Dhaka-1209, Bangladesh",
    feeRange: "700 - 2000 Taka",
    services: [
      "IPD Consultation Unit",
      "Post Operative Room",
      "Labour Room",
      "Prayer Room",
      "General Bed (Female)",
      "General Bed (Male)",
    ],
    additionalServicesCount: 25,
  },
  {
    id: "hosp-4",
    name: "Dhaka Cancer and General Hospital Ltd.",
    image:
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVWUGCwhmWz0/hospitals/338/gSCB0eFSZPviJabLnSmEFfmrQuIK2i8t4m9kYv5b/dhaka-cancer-and-general-hospital-ltd.webp",
    specialtyStats: "0 Doctors with 0 specialities",
    patientOpinions: "0 patients opinion",
    address:
      "House # 71/1, Road # 15/A (New), Shankar Bus Stand, Sat Mosjid Road Dhanmondi R/A, Dhaka-1209, Bangladesh",
    feeRange: "N/A - N/A Taka",
    services: [
      "IPD Consultation Unit",
      "Post Operative Room",
      "Prayer Room",
      "General Bed (Child)",
      "General Bed (Female)",
      "General Cabin",
    ],
    additionalServicesCount: 11,
  },
];
