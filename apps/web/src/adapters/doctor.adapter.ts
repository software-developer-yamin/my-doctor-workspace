import { BackendDoctor, Doctor } from "@/types/doctor.type";
import { specialtiesAdapter } from "./specialty.adapter";
import { parse, format } from "date-fns";

const DEFAULT_DOCTOR_IMAGE = "/images/profile.jpeg";

const DAY_SHORT: Record<string, string> = {
  Saturday: "Sat", Sunday: "Sun", Monday: "Mon", Tuesday: "Tue",
  Wednesday: "Wed", Thursday: "Thu", Friday: "Fri",
};

function getTodayName(): string {
  return format(new Date(), "EEEE");
}

function to12h(time: string): string {
  if (!time || !time.includes(":")) return time;
  try { return format(parse(time, "HH:mm", new Date()), "h:mm a"); } catch { return time; }
}

export const doctorAdapter = (data: BackendDoctor): Doctor => {
  const name = data.name || "Unknown Doctor";
  const slug = data.slug || data._id || "";
  const specializations = specialtiesAdapter(data.specializations || []);
  const primarySpecialty = specializations.length > 0 ? specializations[0].name : "";

  const hospitalSchedules = data.hospitalSchedules || [];
  const today = getTodayName();

  const chambers = hospitalSchedules.map((hs, idx) => {
    const todayEntry = Array.isArray(hs.schedules)
      ? hs.schedules.find((s) => s.day === today && s.isAvailable)
      : undefined;

    const todayTimeSlot = todayEntry?.startTime && todayEntry?.endTime
      ? `${to12h(todayEntry.startTime)} - ${to12h(todayEntry.endTime)}`
      : undefined;

    const allSlots = Array.isArray(hs.schedules)
      ? hs.schedules
          .filter((s): s is typeof s & { day: string; startTime: string; endTime: string } =>
            !!(s.isAvailable && s.day && s.startTime && s.endTime))
          .map((s) => `${DAY_SHORT[s.day] ?? s.day.slice(0, 3)} ${to12h(s.startTime)} - ${to12h(s.endTime)}`)
      : [];

    const consultationMethod = Array.isArray(hs.consultationTypes) && hs.consultationTypes.length > 0
      ? hs.consultationTypes.map((ct) => ct === 'online' ? 'VIRTUAL' : 'ON_PREMISES')
      : ["ON_PREMISES"];

    if (data.homeSchedule && !consultationMethod.includes("VIRTUAL")) {
      consultationMethod.push("VIRTUAL");
    }

    return {
      id: hs._id || String(idx),
      name: hs.hospital?.name || "General Hospital",
      address: hs.hospital?.address || "Dhaka, Bangladesh",
      phone: hs.hospital?.hotline || (hs.hospital as any)?.contactNumber || undefined,
      mapUrl: hs.hospital?.mapUrl,
      availability: allSlots,
      consultationMethod: [...new Set(consultationMethod)],
      appointmentTypes: hs.appointmentTypes?.length ? hs.appointmentTypes : [],
      isActiveToday: !!todayEntry,
      todayTimeSlot,
    };
  });

  const sortedChambers = [...chambers].sort(
    (a, b) => (b.isActiveToday ? 1 : 0) - (a.isActiveToday ? 1 : 0),
  );

  const isAvailableToday = chambers.some((ch) => ch.isActiveToday);

  const locationSchedules = hospitalSchedules.map((hs) => ({
    hospitalId: hs.hospital?._id || "",
    hospitalName: hs.hospital?.name || "",
    hospitalLogo: hs.hospital?.logo,
    hospitalAddress: hs.hospital?.address,
    hospitalPhone: hs.hospital?.hotline || (hs.hospital as any)?.contactNumber || undefined,
    hospitalEmail: hs.hospital?.email,
    hospitalMapUrl: hs.hospital?.mapUrl,
    schedules: Array.isArray(hs.schedules)
      ? hs.schedules.map((s) => ({
          day: s.day || "",
          startTime: s.startTime || "",
          endTime: s.endTime || "",
          isAvailable: !!s.isAvailable,
        }))
      : [],
  }));

  const homeSchedule = data.homeSchedule
    ? {
        homeVisitFee: data.homeSchedule.homeVisitFee,
        followUpFee: data.homeSchedule.followUpFee,
        schedules: Array.isArray(data.homeSchedule.schedules)
          ? data.homeSchedule.schedules.map((s) => ({
              day: s.day || "",
              startTime: s.startTime || "",
              endTime: s.endTime || "",
              isAvailable: !!s.isAvailable,
            }))
          : [],
      }
    : undefined;

  const awards = Array.isArray(data.awards)
    ? data.awards.map((a, i) => ({
        id: (a as any)._id?.toString() ?? String(i),
        title: a.title || "",
        year: a.year || "",
        organization: a.organization || "",
      }))
    : [];

  const publications = Array.isArray(data.publications)
    ? data.publications.map((p, i) => ({
        id: (p as any)._id?.toString() ?? String(i),
        title: p.title || "",
        journal: p.journal || "",
        year: p.year || "",
        link: p.link,
      }))
    : [];

  const faqs = Array.isArray(data.faqs)
    ? data.faqs.map((f, i) => ({
        id: (f as any)._id?.toString() ?? String(i),
        question: f.question || "",
        answer: f.answer || "",
        votes: f.votes ?? 0,
        askedDate: f.askedDate || "",
        category: f.category || "General",
      }))
    : [];

  const videos = Array.isArray(data.videos)
    ? data.videos.map((v, i) => ({
        id: (v as any)._id?.toString() ?? String(i),
        title: v.title || "",
        url: v.url || "",
        thumbnail: v.thumbnail,
      }))
    : [];

  return {
    id: data._id || "",
    name,
    slug,
    gender: data.gender,
    photo: data.photo || DEFAULT_DOCTOR_IMAGE,
    coverPhoto: data.cover_photo,
    gallery: data.gallery,
    degrees: data.degrees ? data.degrees.split(",").map((d) => d.trim()).filter(Boolean) : [],
    primarySpecialty,
    shortDescription: data.short_description || "",
    bmdcRegNo: data.BMDC_REG_NO || "N/A",
    about: data.about || "No description available.",
    email: data.email || "",
    phone: data.phone || "N/A",
    isAvailableHome: data.homeSchedule ? true : !!data.isAvailableHome,
    isVerified: !!data.isVerified,
    isFeatured: !!data.isFeatured,
    isAvailableToday,
    languages: data.languages,
    socialLinks: data.social_links,
    specializations,
    educations: (() => {
      const fromEducations = Array.isArray(data.educations)
        ? data.educations.filter((e: any) => typeof e === "string" && e.trim())
        : [];
      if (fromEducations.length > 0) return fromEducations;
      return data.degrees ? data.degrees.split(",").map((d) => d.trim()).filter(Boolean) : [];
    })(),
    awards,
    publications,
    faqs,
    conditionsTreated: data.conditions_treated ?? [],
    insuranceAccepted: data.insurance_accepted ?? [],
    videos,
    services: data.services?.length
      ? data.services
      : data.field_of_concentration?.map((c) => (typeof c === "string" ? c : c.name)) || [],
    fee: Number(data.avgConsultationFee) || 0,
    minFee: Number(data.minConsultationFee) || Number(data.avgConsultationFee) || 0,
    avgWaitingTime: data.avgWaitingTime ? Math.round(Number(data.avgWaitingTime)) : undefined,
    rating: Number(data.rating) || 0,
    reviewCount: Number(data.totalReviews) || 0,
    totalPatients: data.totalPatients,
    positiveReviewPercentage: data.positiveReviewPercentage ?? undefined,
    experience: data.years_of_experience ? String(data.years_of_experience) : "",
    chamber: sortedChambers[0]
      ? { name: sortedChambers[0].name, address: sortedChambers[0].address }
      : undefined,
    chambers: sortedChambers,
    availability: hospitalSchedules
      .flatMap((hs) =>
        Array.isArray(hs.schedules)
          ? hs.schedules
              .filter((s): s is typeof s & { day: string; startTime: string; endTime: string } =>
                !!(s.isAvailable && s.day && s.startTime && s.endTime))
              .map((s) => `${DAY_SHORT[s.day] ?? s.day.slice(0, 3)} ${to12h(s.startTime)} - ${to12h(s.endTime)}`)
          : [],
      )
      .slice(0, 3),
    locationSchedules: locationSchedules.length > 0 ? locationSchedules : undefined,
    homeSchedule,
  };
};

export const doctorsAdapter = (data: BackendDoctor[]): Doctor[] => {
  if (!Array.isArray(data)) {
    console.warn("doctorsAdapter received non-array data:", data);
    return [];
  }
  return data.map(doctorAdapter);
};
