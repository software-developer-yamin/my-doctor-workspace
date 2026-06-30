import { useQuery } from "@tanstack/react-query";
import { medicalRecordsService, MyPrescriptionsParams } from "@/services/medical-records.service";
import { useAuth } from "@/hooks/use-auth";

export const medicalRecordsKeys = {
  myPrescriptions: (params?: MyPrescriptionsParams) => ["my-prescriptions", params] as const,
};

export const useMyPrescriptions = (params?: MyPrescriptionsParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: medicalRecordsKeys.myPrescriptions(params),
    queryFn: () => medicalRecordsService.getMyPrescriptions(params),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });
};
