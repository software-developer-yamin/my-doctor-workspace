import { Ambulance, BackendAmbulance } from "@/types/ambulance.type";

export const ambulanceAdapter = (raw: BackendAmbulance): Ambulance => {
  const bdLocationObj = typeof raw.bdLocation === "object" && raw.bdLocation ? raw.bdLocation : null;

  return {
    id: raw._id,
    name: raw.name,
    bdLocation: bdLocationObj ?? undefined,
    upazila: raw.upazila,
    image: raw.image,
    phone: raw.phone,
    rating: Number(raw.rating) || 0,
    responseTime: raw.responseTime,
    services: raw.services,
    drivingLicenseNumber: raw.driving_license_number,
    ambulanceType: raw.ambulance_type,
    ambulanceNumber: raw.ambulance_number,
    status: raw.status,
  };
};

export const ambulancesAdapter = (raws: BackendAmbulance[]): Ambulance[] =>
  raws.map(ambulanceAdapter);
