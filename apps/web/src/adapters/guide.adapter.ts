import { BackendGuide, Guide, BackendGuideBooking, TGuideBooking } from "@/types/guide.type";
import { API } from "@/config/api";
import { format, parseISO } from "date-fns";

export const adaptGuide = (data: BackendGuide): Guide => {
  const hospital = typeof data.hospital === "object" && data.hospital ? data.hospital : null;
  const bdLocationObj = typeof data.bdLocation === "object" && data.bdLocation ? data.bdLocation : null;

  const photo = data.photo
    ? data.photo.startsWith("http") ? data.photo : `${API.ASSETS_URL}${data.photo}`
    : "/images/profile.jpeg";

  return {
    id: data._id,
    name: data.name,
    slug: data.slug || data._id,
    photo,
    about: data.about || "",
    hospitalId: hospital?._id || (typeof data.hospital === "string" ? data.hospital : ""),
    hospitalName: hospital?.name || "",
    hospitalAddress: hospital?.address || "",
    hospitalLogo: hospital?.logo
      ? hospital.logo.startsWith("http") ? hospital.logo : `${API.ASSETS_URL}${hospital.logo}`
      : "",
    bdLocation: bdLocationObj ?? undefined,
    upazila: data.upazila,
    languages: data.languages || [],
    expertise: data.expertise || [],
    yearsOfExperience: data.yearsOfExperience || 0,
    contactNumber: data.contactNumber || "",
    email: data.email || "",
    rating: data.rating || 0,
    totalReviews: data.totalReviews || 0,
    status: data.status,
    isVerified: data.isVerified,
    isFeatured: data.isFeatured,
  };
};

export const adaptGuides = (data: BackendGuide[]): Guide[] => {
  if (!Array.isArray(data)) return [];
  return data.map(adaptGuide);
};

export const adaptGuideBooking = (backendData: BackendGuideBooking): TGuideBooking => {
  const bdLocationObj = typeof backendData.bdLocation === "object" && backendData.bdLocation
    ? backendData.bdLocation
    : null;

  return {
    id: backendData._id,
    customerId: typeof backendData.customer === "object" ? backendData.customer?._id : backendData.customer,
    bdLocation: bdLocationObj ?? undefined,
    upazila: backendData.upazila,
    hospitalId: typeof backendData.hospital === "object" ? backendData.hospital?._id : backendData.hospital,
    hospitalName: typeof backendData.hospital === "object" ? backendData.hospital?.name : "",
    patientName: backendData.patientName ?? "",
    phoneNumber: backendData.phoneNumber ?? "",
    age: backendData.age,
    description: backendData.description,
    status: backendData.status,
    date: backendData.createdAt ? format(parseISO(backendData.createdAt), "dd MMM yyyy, p") : "-",
  };
};
