import { BackendHospital, Hospital } from "@/types/hospital.type";

export const hospitalAdapter = (data: BackendHospital): Hospital => {
  if (!data) throw new Error("Hospital adapter received null/undefined data");

  const thumbnail = data.logo || data.images?.[0] || "";

  const allImages: string[] = [];
  if (data.logo) allImages.push(data.logo);
  if (data.cover_photo) allImages.push(data.cover_photo);
  if (Array.isArray(data.images)) allImages.push(...data.images);

  const lat = data.location?.coordinates?.[1] ?? (parseFloat(data.lat || "0") || 0);
  const lng = data.location?.coordinates?.[0] ?? (parseFloat(data.lon || "0") || 0);

  const bdLocationObj = typeof data.bdLocation === "object" && data.bdLocation ? data.bdLocation : null;

  const phones = data.hotline
    ? [data.hotline]
    : data.contactNumber
    ? [data.contactNumber]
    : [];

  const specialityStats = Array.isArray(data.specialities) && data.specialities.length > 0
    ? data.specialities
        .map((s) => (typeof s === "object" ? s.name : s))
        .slice(0, 3)
        .join(", ")
    : "";

  return {
    id: data._id || "",
    name: data.name || "",
    slug: data.slug || data._id || "",
    thumbnail,
    allImages,
    address: data.address || "",
    bdLocation: bdLocationObj ?? undefined,
    upazila: data.upazila,
    coordinates: { lat, lng },
    description: data.description || "",
    about: data.about || data.description || "",
    type: data.type || "",
    rating: Number(data.rating) || 0,
    reviewCount: Number(data.totalReviews) || 0,
    isEmergency: !!data.isEmergencyAvailable,
    hasAmbulance: !!data.hasAmbulance,
    hasCabinFacility: !!data.hasCabinFacility,
    emergencyMessage: data.emergencyMessage || "",
    visitingHours: data.visitingHours || "",
    faqs: Array.isArray(data.faqs) ? data.faqs : [],
    insurances: Array.isArray(data.insurances) ? data.insurances : [],
    accreditations: Array.isArray(data.accreditations) ? data.accreditations : [],
    isVerified: !!data.isVerified,
    contact: {
      phones,
      emails: data.email ? [data.email] : [],
      web: data.website || "",
      emergency: data.hotline || "",
    },
    specialtyStats: specialityStats,
    specialities: Array.isArray(data.specialities)
      ? data.specialities.map(s => typeof s === 'object' ? { _id: s._id, name: s.name } : { _id: s, name: '' })
      : [],
    feeRange: "",
    patientOpinions: `${data.totalReviews || 0} patient opinions`,
    services: (data.services || [])
      .filter((s) => !s.endsWith(' Consultation'))
      .map((s) => ({ name: s, description: "" })),
    facilities: data.facilities || [],
    coverPhoto: data.cover_photo || "",
    socials: {
      facebook: data.facebook,
      youtube: data.youtube,
      instagram: data.instagram,
      linkedin: data.linkedin,
    },
    mission: data.mission || "",
    vision: data.vision || "",
    yearsInService: data.yearsInService || 0,
    stats: {
      totalBeds: data.stats?.totalBeds || 0,
      doctorsCount: data.stats?.doctorsCount || 0,
      icuBeds: data.stats?.icuBeds || 0,
      avgWaitingTime: data.stats?.avgWaitingTime ? Math.round(Number(data.stats.avgWaitingTime)) : undefined,
    },
    mapUrl: lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : "",
    openingHours: Array.isArray(data.openingHours) ? data.openingHours : [],
    doctors: [],
    nurses: [],
  };
};

export const hospitalsAdapter = (data: BackendHospital[]): Hospital[] => {
  if (!Array.isArray(data)) return [];
  return data.map(hospitalAdapter);
};
