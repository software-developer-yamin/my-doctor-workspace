"use client";

import { useMemo, useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { hospitalKeys, useHospitalDetails } from "@/hooks/queries/use-hospitals";
import { doctorScheduleKeys } from "@/hooks/queries/use-doctor-schedules";
import { doctorScheduleService } from "@/services/doctor-schedule.service";
import { hospitalService } from "@/services/hospital.service";
import { doctorAdapter } from "@/adapters/doctor.adapter";
import { HospitalInfoCard } from "./hospital-info-card";
import { HospitalProfileTabs } from "./hospital-profile-tabs";
import { HospitalPatientReviews } from "./hospital-patient-reviews";
import { HospitalReview } from "@/types/hospital.type";
import { ApiMeta } from "@/types/api.type";

type Props = { slug: string };

export const HospitalDetailsClient = ({ slug }: Props) => {
  const [doctorSearch, setDoctorSearch] = useState("");
  const debouncedSearch = useDebounce(doctorSearch, 350);
  const [doctorPage, setDoctorPage] = useQueryState("doctorPage", parseAsInteger.withDefault(1));
  const [doctorSpecialty, setDoctorSpecialty] = useQueryState("specialty", parseAsString);
  const [doctorGender, setDoctorGender] = useQueryState("gender", parseAsString);
  const [doctorAvailability, setDoctorAvailability] = useQueryState("availability", parseAsString);
  const [doctorMinFee, setDoctorMinFee] = useQueryState("minFee", parseAsInteger);
  const [doctorMaxFee, setDoctorMaxFee] = useQueryState("maxFee", parseAsInteger);
  const [doctorMinExp, setDoctorMinExp] = useQueryState("minExperience", parseAsInteger);
  const [doctorMaxExp, setDoctorMaxExp] = useQueryState("maxExperience", parseAsInteger);
  const [doctorConsultationType, setDoctorConsultationType] = useQueryState("consultationType", parseAsString);
  const DOCTOR_LIMIT = 10;

  // Reset to page 1 when search or any filter changes
  useEffect(() => {
    setDoctorPage(1);
  }, [debouncedSearch, doctorSpecialty, doctorGender, doctorAvailability, doctorMinFee, doctorMaxFee, doctorMinExp, doctorMaxExp, doctorConsultationType]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    data: hospital,
    isLoading: hospitalLoading,
    isError,
  } = useHospitalDetails(slug);

  const { data: filterOptions } = useQuery({
    queryKey: [...doctorScheduleKeys.all, "filter-options", hospital?.id],
    queryFn: () => doctorScheduleService.getFilterOptions(hospital!.id),
    enabled: !!hospital?.id,
    staleTime: 15 * 60 * 1000,
  });

  const { data: activeDoctorsData } = useQuery({
    queryKey: [...doctorScheduleKeys.all, "active-today", hospital?.id],
    queryFn: () => doctorScheduleService.getAll({
      hospitalId: hospital!.id,
      isAvailableToday: "true",
      limit: 2,
      page: 1,
    }),
    enabled: !!hospital?.id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: schedulesData } = useQuery({
    queryKey: [
      ...doctorScheduleKeys.all, "by-hospital", hospital?.id,
      debouncedSearch, doctorPage,
      doctorSpecialty, doctorGender, doctorAvailability,
      doctorMinFee, doctorMaxFee, doctorMinExp, doctorMaxExp, doctorConsultationType,
    ],
    queryFn: () => doctorScheduleService.getAll({
      hospitalId: hospital!.id,
      page: doctorPage,
      limit: DOCTOR_LIMIT,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(doctorSpecialty ? { specialty: doctorSpecialty } : {}),
      ...(doctorGender ? { gender: doctorGender } : {}),
      ...(doctorAvailability === "today" ? { isAvailableToday: "true" } : {}),
      ...(doctorMinFee != null ? { minFee: doctorMinFee } : {}),
      ...(doctorMaxFee != null ? { maxFee: doctorMaxFee } : {}),
      ...(doctorMinExp != null ? { minExperience: doctorMinExp } : {}),
      ...(doctorMaxExp != null ? { maxExperience: doctorMaxExp } : {}),
      ...(doctorConsultationType ? { consultationType: doctorConsultationType } : {}),
    }),
    enabled: !!hospital?.id,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const { data: reviewsData } = useQuery({
    queryKey: [...hospitalKeys.all, "reviews", hospital?.id],
    queryFn: () => hospitalService.getReviews(hospital!.id, { limit: 20 }),
    enabled: !!hospital?.id,
    staleTime: 5 * 60 * 1000,
  });

  const mapScheduleToDoctor = (schedule: any) => {
    const doc = doctorAdapter(schedule.doctor);
    return {
      id: doc.id,
      slug: doc.id,
      name: doc.name,
      specialty: doc.primarySpecialty,
      image: doc.photo,
      degrees: doc.degrees,
      bmdc: doc.bmdcRegNo,
      experience: doc.experience,
      fee: schedule.consultationFee ?? doc.fee,
      consultationFee: schedule.consultationFee,
      followUpFee: schedule.followUpFee,
      schedules: schedule.schedules || [],
      status: schedule.status || "Active",
      consultationTypes: schedule.consultationTypes || [],
      isAvailableToday: schedule.isAvailableToday ?? false,
      nextAvailableSchedule: schedule.nextAvailableSchedule ?? null,
      todaySerial: schedule.todaySerialCount != null ? { booked: schedule.todaySerialCount, total: schedule.todaySerialTotal ?? null } : null,
      languages: schedule.languages || [],
      shortDescription: doc.shortDescription || "",
    };
  };

  const allDoctors = useMemo(() => {
    if (!schedulesData?.data?.length) return [];
    return schedulesData.data.map(mapScheduleToDoctor);
  }, [schedulesData]);

  const activeDoctors = useMemo(() => {
    if (!activeDoctorsData?.data?.length) return [];
    return activeDoctorsData.data.map(mapScheduleToDoctor);
  }, [activeDoctorsData]);

  const reviews = useMemo(() => {
    if (!reviewsData?.data?.length) return [];
    return (reviewsData.data as HospitalReview[]).map((r) => ({
      id: r._id,
      name: r.patientName,
      timeAgo: new Date(r.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      text: r.text,
    }));
  }, [reviewsData]);

  const hospitalWithDoctors = useMemo(() => {
    if (!hospital) return null;
    return { ...hospital, doctors: allDoctors };
  }, [hospital, allDoctors]);

  if (hospitalLoading) {
    return (
      <main className="container mx-auto px-4 py-6 lg:py-12">
        <div className="flex w-full flex-col gap-6">
          <div className="h-[380px] w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-[600px] w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </main>
    );
  }

  if (isError || !hospitalWithDoctors) {
    return (
      <main className="container mx-auto px-4 py-6 lg:py-12">
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <p className="text-lg font-semibold text-foreground">Hospital not found</p>
          <p className="text-sm text-muted-foreground">
            The hospital you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 lg:py-12">
      <div className="flex w-full flex-col gap-6">
        <HospitalInfoCard hospital={hospitalWithDoctors} />
        <HospitalProfileTabs
          hospital={hospitalWithDoctors}
          activeDoctors={activeDoctors}
          doctorSearch={doctorSearch}
          onDoctorSearchChange={setDoctorSearch}
          doctorsMeta={schedulesData?.meta as ApiMeta | undefined}
          doctorsPage={doctorPage}
          onDoctorsPageChange={setDoctorPage}
          doctorSpecialty={doctorSpecialty}
          onDoctorSpecialtyChange={setDoctorSpecialty}
          doctorGender={doctorGender}
          onDoctorGenderChange={setDoctorGender}
          doctorAvailability={doctorAvailability}
          onDoctorAvailabilityChange={setDoctorAvailability}
          doctorMinFee={doctorMinFee}
          doctorMaxFee={doctorMaxFee}
          onDoctorFeeRangeChange={(min, max) => { setDoctorMinFee(min); setDoctorMaxFee(max); }}
          doctorMinExp={doctorMinExp}
          doctorMaxExp={doctorMaxExp}
          onDoctorExperienceChange={(min, max) => { setDoctorMinExp(min); setDoctorMaxExp(max); }}
          doctorConsultationType={doctorConsultationType}
          onDoctorConsultationTypeChange={setDoctorConsultationType}
          filterOptions={filterOptions}
        />
        <HospitalPatientReviews reviews={reviews} />
      </div>
    </main>
  );
};
