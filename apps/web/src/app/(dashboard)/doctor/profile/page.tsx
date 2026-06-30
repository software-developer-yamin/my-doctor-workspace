"use client";

import { useMyDoctorProfile } from "@/hooks/queries/use-doctor-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API } from "@/config/api";
import { CONSTANT } from "@/config/constant";

export default function DoctorProfilePage() {
  const { data, isLoading } = useMyDoctorProfile();
  const doctor = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {[1, 2, 3].map((i) => <div key={i} className="bg-card border h-16 animate-pulse rounded-xl" />)}
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-foreground text-2xl font-bold tracking-tight">Profile</h1>

      <Card>
        <CardContent className="space-y-5">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            <AvatarImage src={doctor.photo ? `${API.ASSETS_URL}${doctor.photo}` : undefined} alt={doctor.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {doctor.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-foreground text-xl font-bold">{doctor.name}</h2>
            <p className="text-muted-foreground text-sm">{doctor.email}</p>
            {doctor.BMDC_REG_NO && (
              <p className="text-muted-foreground text-xs mt-1">BMDC: {doctor.BMDC_REG_NO}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: "Gender", value: doctor.gender },
            { label: "Experience", value: doctor.years_of_experience ? `${doctor.years_of_experience} years` : "—" },
            { label: "Phone", value: doctor.phone ?? "—" },
            { label: "Rating", value: doctor.rating ? `${doctor.rating} / 5` : "—" },
            { label: "Total Patients", value: doctor.totalPatients ?? 0 },
            { label: "Total Reviews", value: doctor.totalReviews ?? 0 },
            { label: "Verified", value: doctor.isVerified ? "Yes" : "No" },
            { label: "Home Visits", value: doctor.isAvailableHome ? "Available" : "Not Available" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted/20 rounded-lg p-3">
              <p className="text-muted-foreground text-xs font-medium">{label}</p>
              <p className="text-foreground font-semibold mt-0.5">{String(value)}</p>
            </div>
          ))}
        </div>

        {doctor.specializations?.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Specializations</p>
            <div className="flex flex-wrap gap-2">
              {doctor.specializations.map((s: any) => (
                <Badge key={s._id ?? s} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {s.name ?? s}
                </Badge>
              ))}
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
