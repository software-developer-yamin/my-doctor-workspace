import { customerService, UpdateCustomerPayload, ChangePasswordPayload } from "@/services/customer.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const customerKeys = {
  all: ["customer"] as const,
  me: () => [...customerKeys.all, "me"] as const,
};

export const useCustomer = () => {
  return useQuery({
    queryKey: customerKeys.me(),
    queryFn: () => customerService.getMe(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCustomerPayload) =>
      customerService.updateMe(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.me() });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update profile",
      );
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      customerService.changePassword(payload),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    },
  });
};
