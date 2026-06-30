import { useQuery } from "@tanstack/react-query";
import { doctorService } from "@/services/doctor.service";
import { DoctorReview } from "@/types/doctor.type";

export const doctorMockKeys = {
  reviews: (doctorId: string) => ["doctor-reviews", doctorId] as const,
};

export const useDoctorReviews = (doctorId: string) =>
  useQuery<DoctorReview[]>({
    queryKey: doctorMockKeys.reviews(doctorId),
    queryFn: async () => {
      const { data } = await doctorService.getReviews(doctorId);
      return data.map((r) => ({
        id: r._id || "",
        patientName: r.patientName || "",
        patientInitials: r.patientInitials || "",
        rating: r.rating || 0,
        date: r.createdAt || "",
        condition: r.condition || "",
        text: r.text || "",
        isVerified: r.isVerified ?? false,
        helpfulCount: r.helpfulCount || 0,
        consultationType: r.consultationType,
      }));
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!doctorId,
  });
