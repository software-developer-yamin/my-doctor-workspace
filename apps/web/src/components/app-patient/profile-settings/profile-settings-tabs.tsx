"use client";

import { PersonalInfoForm } from "@/components/app-patient/profile-settings/personal-info-form";
import { SecuritySection } from "@/components/app-patient/profile-settings/security-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileSettingsTabsProps {
  profile: any;
}

export function ProfileSettingsTabs({ profile }: ProfileSettingsTabsProps) {
  return (
    <Tabs defaultValue="personal" className="w-full space-y-6">
      <TabsList className="bg-muted/50 border border-border/50 h-12 sm:h-14 w-full justify-start gap-1 sm:gap-2 rounded-xl p-1 sm:p-1.5">
        <TabsTrigger
          value="personal"
          className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full flex-1 rounded-lg px-4 sm:px-8 text-2xs sm:text-xs font-bold transition-all text-muted-foreground/70 hover:text-foreground"
        >
          Personal Info
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full flex-1 rounded-lg px-4 sm:px-8 text-2xs sm:text-xs font-bold transition-all text-muted-foreground/70 hover:text-foreground"
        >
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <PersonalInfoForm profile={profile} />
      </TabsContent>

      <TabsContent value="security">
        <SecuritySection />
      </TabsContent>
    </Tabs>
  );
}
