"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useUpdateProfile } from "@/hooks/queries/use-customer";
import { getImageUrl } from "@/lib/utils";
import {
  Call02Icon,
  CheckmarkBadge01Icon,
  Camera01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef } from "react";

interface ProfileHeaderProps {
  profile: any;
}

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateMutation = useUpdateProfile();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return;
    }
    updateMutation.mutate({ photo: file });
    e.target.value = "";
  };

  return (
    <Card className="relative overflow-hidden rounded-md border-border/50 bg-card p-6 shadow-xs sm:p-8">
      {/* Decorative gradient */}
      <div className="from-primary/10 via-primary/5 pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent" />

      <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {/* Avatar with camera overlay */}
        <div className="group relative shrink-0">
          <Avatar className="ring-background h-28 w-28 rounded-3xl! after:rounded-3xl! shadow-md ring-4 sm:h-32 sm:w-32 overflow-hidden">
            <AvatarImage
              src={getImageUrl(profile.photo) || undefined}
              alt={profile.name}
              className="rounded-3xl! object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary rounded-3xl! text-3xl font-bold">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={updateMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground ring-background absolute right-0 bottom-0 flex h-10 w-10 items-center justify-center rounded-full shadow-md ring-4 transition-all active:scale-95 disabled:opacity-60"
            aria-label="Change photo"
          >
            <HugeiconsIcon icon={Camera01Icon} size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        {/* Name + meta */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-foreground truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {profile.name || "Unnamed Patient"}
            </h1>
            <Badge className="border-primary/20 bg-primary/500/10 text-primary dark:text-primary-light pointer-events-none gap-1 rounded-full border px-3 py-1 text-micro font-bold tracking-wider uppercase shadow-none">
              <HugeiconsIcon icon={CheckmarkBadge01Icon} size={12} />
              Patient
            </Badge>
            {profile.isBloodDonor && (
              <Badge className="border-destructive/20 bg-destructive/500/10 text-destructive dark:text-red-400 pointer-events-none rounded-full border px-3 py-1 text-micro font-bold tracking-wider uppercase shadow-none">
                Blood Donor
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-medium">
            {profile.phone && (
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Call02Icon} size={14} />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Mail01Icon} size={14} />
                <span className="truncate">{profile.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
