"use client";

import { ProfileHeader } from "@/components/app-patient/profile-settings/profile-header";
import { ProfileSettingsTabs } from "@/components/app-patient/profile-settings/profile-settings-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomer } from "@/hooks/queries/use-customer";

export default function ProfileSettingsPage() {
  const { data: customerResponse, isLoading } = useCustomer();
  const profile = customerResponse?.data;

  if (isLoading) {
    return (
      <div className="w-full space-y-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-10 w-80 rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full py-20 text-center">
        <p className="text-muted-foreground font-semibold">Unable to load your profile.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <ProfileHeader profile={profile} />
      <ProfileSettingsTabs profile={profile} />
    </div>
  );
}
