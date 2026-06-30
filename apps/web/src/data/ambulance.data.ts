export type TAmbulanceType = {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  features: string[];
};

export type TAmbulanceCard = {
  id: string;
  title: string;
  image: string;
  href: string;
  features: string[];
};

export const AMBULANCE_TYPES: TAmbulanceType[] = [
  {
    id: "1",
    slug: "ac-ambulance",
    title: "AC Ambulance Service",
    description:
      "AC ambulances are also called Basic Life Support Ambulance, which are primarily used for transporting patients who are medically stable and do not require constant monitoring. AC Ambulances equipped with general equipment like oxygen, stethoscope, and equipment to check the blood pressure, etc. This ambulance is best for transfer of patients in nearby areas.",
    images: [
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/thumbnails/1/7ZvEZhBXV4fqdGGhrh1N20TgPm2GKM20jX9M4yLJ/ac-ambulance.webp",
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/1/5hqfvC5E6l9UTpV8ayFSbbGs4tNjoUnAAkp1PXqi/ac-ambulance.webp",
    ],
    features: [
      "Get ambulance within 30 minutes*",
      "24/7 affordable quality service",
      "We are just a call away: 01405600700",
    ],
  },
  {
    id: "8",
    slug: "acls-ambulance",
    title: "ACLS Ambulance Service",
    description:
      "The assignment of the ACLS emergency vehicle is to carry patients who are extremely harmed or enduring a heart assault, cardiac capture, asthma assault, stroke, respiratory disappointment, serious dying, obviousness, seizures... Our ACLS rescue vehicle is prepared with a biphasic defibrillator, ventilator gadget...",
    images: [
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/thumbnails/8/J19y6GHtC0fiOs7SFXnEH6vShF7nepwGsEeeK6CS/acls-ambulance-service.webp",
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/8/Fn2INaUeAHj13Md4RWpJSXac1uVi9IlQiOYwzyFe/acls-ambulance-service.webp",
    ],
    features: [
      "24/7 affordable quality service",
      "We are just a call away: 01405600700",
      "Get ambulance within 30 minutes*",
    ],
  },
  {
    id: "6",
    slug: "air-ambulance",
    title: "AIR Ambulance Service",
    description:
      "Today aeromedical transport is possible using air ambulance service to transfer critically ill as well as medically stable patients over long distances. Like ground ambulances, air ambulances are equipped with medical equipment’s vital to monitoring and treating injured or ill patients.",
    images: [
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/thumbnails/6/SvYe9QKfrYB3t3hMa3mzwztcSBYyf7bx7tTMhRgl/air-ambulance.webp",
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCwhlWD0/ambulances/6/Yg7JsmVAuLwKW5Gi8CyWsQ05EE7FcF5OTtWauY5p/air-ambulance.webp",
    ],
    features: [
      "Get ambulance within 60 minutes*",
      "24/7 affordable quality service",
      "We are just a call away: 01405600700",
    ],
  },
  {
    id: "5",
    slug: "als-ambulance",
    title: "ALS Ambulance Service",
    description:
      "ALS Ambulance means an ambulance in which Advanced Life Support (ALS) is provided in situations where the patient being transported is in a more critical condition and a paramedic is required to assist in the treatment of the patient before and/or during transport.",
    images: [
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCwhlWD0/ambulances/5/ewX2AotbjrTJz3BrB4aeyAWRKEzTBpbZBlr03hvB/als-ambulance.webp",
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCwhlWD0/ambulances/5/CYxicTgJYTLCAaEzkh6pinw2IBFZQCC8kssMGKW8/als-ambulance.webp",
    ],
    features: [
      "Get ambulance within 30 minutes*",
      "24/7 affordable quality service",
      "We are just a call away: 01405600700",
    ],
  },
  {
    id: "7",
    slug: "freezing-ambulance",
    title: "Freezing Ambulance Service",
    description:
      "Dead body carrier freezer van / ambulances, also known as mortuary ambulances. These ambulances are equipped with ice boxes. This is the freezer installed inside the hearse van freezer vehicles to keep the human remains inside it.",
    images: [
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/thumbnails/7/jAwjFbURGT8I4TjBY7A6zURUbRZ7fdQ5xiUgsjed/freezing-ambulance.webp",
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/7/UPZJLumyWi0L9ZzOGKIhIa5wFrj531PlTStGy8gh/freezing-ambulance.webp",
    ],
    features: [
      "Get ambulance within 30 minutes*",
      "24/7 affordable quality service",
      "We are just a call away: 01405600700",
    ],
  },
  {
    id: "3",
    slug: "icu-ambulance",
    title: "ICU Ambulance Service",
    description:
      "The task of the ICU ambulance is to carry the patients who are severely injured or suffering from a heart attack, cardiac arrest, asthma attack, stroke, respiratory failure, severe bleeding, unconsciousness, seizures, burn, poisoning, head injury.",
    images: [
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/thumbnails/3/gx7SpGbWxEzypVKbiMahOSl7l52Oru0olSDFq4uy/icu-ambulance.webp",
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCwhlWD0/ambulances/3/zUnzWQoGCJnayXIxJTCKJKTXVqMxRUdvFae2AsV8/icu-ambulance.webp",
    ],
    features: [
      "Get ambulance within 30 minutes*",
      "24/7 affordable quality service",
      "We are just a call away: 01405600700",
    ],
  },
  {
    id: "4",
    slug: "nicu-ambulance",
    title: "NICU Ambulance Service",
    description:
      "We have advanced our ambulance into a neonatal incubator care unit for critically ill infants. Our neonatal ambulances are well equipped with ICU monitoring facilities, incubators, continuous oxygen administration, IV therapy etc.",
    images: [
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/thumbnails/4/KVbFoyfzAgKctlKL89bfESWA5mFFefMbnnxRULXi/nicu-ambulance.webp",
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/4/H6vwoIjcRdkbZ7qEyH73L7d87oDr13jp3YZSmOci/nicu-ambulance.webp",
    ],
    features: [
      "Get ambulance within 30 minutes*",
      "24/7 affordable quality service",
      "We are just a call away: 01405600700",
    ],
  },
  {
    id: "2",
    slug: "non-ac-ambulance",
    title: "Non Ac Ambulance Service",
    description:
      "NON-AC ambulances are also called Basic Life Support Ambulances, which are primarily used for transporting patients who are medically stable and do not require constant monitoring.",
    images: [
      "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhlWD0/ambulances/thumbnails/2/Z0OM7oYSJ74LbbIUwGcnqNeRtWBf4uq1FCikKdia/non-ac-ambulance.webp",
      "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCwhlWD0/ambulances/2/mqLpNZgXoxpH8TNZhLyzAJkTP6dWbWPQt6Yu3Hzb/non-ac-ambulance.webp",
    ],
    features: [
      "Get ambulance within 30 minutes*",
      "24/7 affordable quality service",
      "We are just a call away: 01405600700",
    ],
  },
];

export const AMBULANCE_CARDS: TAmbulanceCard[] = AMBULANCE_TYPES.map((type) => ({
  id: type.id,
  title: type.title,
  image: type.images[0],
  href: `/ambulance#${type.slug}`,
  features: type.features,
}));
