"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile } from "@/hooks/queries/use-customer";
import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

interface PersonalInfoFormProps {
  profile: any;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const toDateInput = (d?: string) => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export function PersonalInfoForm({ profile }: PersonalInfoFormProps) {
  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    gender: profile?.gender || "",
    dob: toDateInput(profile?.dob),
    bloodGroup: profile?.bloodGroup || "",
    nid: profile?.nid || "",
    passport: profile?.passport || "",
    address: profile?.address || "",
    isBloodDonor: !!profile?.isBloodDonor,
  });

  useEffect(() => {
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
      gender: profile?.gender || "",
      dob: toDateInput(profile?.dob),
      bloodGroup: profile?.bloodGroup || "",
      nid: profile?.nid || "",
      passport: profile?.passport || "",
      address: profile?.address || "",
      isBloodDonor: !!profile?.isBloodDonor,
    });
  }, [profile]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send only non-empty fields
    const payload: Record<string, any> = {
      name: formData.name,
      isBloodDonor: formData.isBloodDonor,
    };
    if (formData.email) payload.email = formData.email;
    if (formData.gender) payload.gender = formData.gender;
    if (formData.dob) payload.dob = new Date(formData.dob).toISOString();
    if (formData.bloodGroup) payload.bloodGroup = formData.bloodGroup;
    if (formData.nid) payload.nid = formData.nid;
    if (formData.passport) payload.passport = formData.passport;
    if (formData.address) payload.address = formData.address;

    updateMutation.mutate(payload);
  };

  return (
    <Card className="border-border/50 rounded-md border shadow-xs">
      <CardHeader className="border-border/40 border-b px-6 py-5 sm:px-8">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <HugeiconsIcon icon={UserIcon} size={18} className="text-primary" />
          Personal Information
        </CardTitle>
        <p className="text-muted-foreground text-xs font-medium">
          Keep your personal details up to date for a better experience.
        </p>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identity */}
          <section className="space-y-5">
            <h3 className="text-foreground/70 text-micro font-bold tracking-widest uppercase">
              Identity
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Full Name" required>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="h-11 rounded-xl font-medium"
                  required
                />
              </Field>

              <Field label="Gender">
                <Select
                  value={formData.gender}
                  onValueChange={(v) => handleChange("gender", v)}
                >
                  <SelectTrigger className="h-11! rounded-xl font-medium">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Date of Birth">
                <Input
                  type="date"
                  value={formData.dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="h-11 rounded-xl font-medium"
                />
              </Field>

              <Field label="Blood Group">
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(v) => handleChange("bloodGroup", v)}
                >
                  <SelectTrigger className="h-11! rounded-xl font-medium">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-5">
            <h3 className="text-foreground/70 text-micro font-bold tracking-widest uppercase">
              Contact
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Phone" hint="Cannot be changed">
                <Input
                  value={profile?.phone || ""}
                  disabled
                  className="bg-muted/30 text-muted-foreground h-11 cursor-not-allowed rounded-xl font-medium"
                />
              </Field>

              <Field label="Email">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className="h-11 rounded-xl font-medium"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Address">
                  <Textarea
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Your current address"
                    rows={2}
                    className="resize-none rounded-xl font-medium"
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Identification */}
          <section className="space-y-5">
            <h3 className="text-foreground/70 text-micro font-bold tracking-widest uppercase">
              Identification
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="NID Number">
                <Input
                  value={formData.nid}
                  onChange={(e) => handleChange("nid", e.target.value)}
                  placeholder="National ID number"
                  className="h-11 rounded-xl font-medium"
                />
              </Field>

              <Field label="Passport Number">
                <Input
                  value={formData.passport}
                  onChange={(e) => handleChange("passport", e.target.value)}
                  placeholder="Passport number"
                  className="h-11 rounded-xl font-medium"
                />
              </Field>
            </div>
          </section>

          {/* Donor preference */}
          <section>
            <label
              htmlFor="blood-donor"
              className="border-border/40 hover:border-primary/30 flex cursor-pointer items-start gap-4 rounded-2xl border bg-card p-5 transition-colors"
            >
              <Checkbox
                id="blood-donor"
                checked={formData.isBloodDonor}
                onCheckedChange={(v) => handleChange("isBloodDonor", !!v)}
                className="mt-0.5 h-5 w-5 rounded-md"
              />
              <div className="space-y-1">
                <p className="text-foreground text-sm font-semibold">
                  Register as a blood donor
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Your contact info will only be used to reach you during
                  emergencies for blood donation requests.
                </p>
              </div>
            </label>
          </section>

          {/* Actions */}
          <div className="border-border/40 flex justify-end gap-3 border-t pt-6">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="h-11 rounded-xl px-8 text-sm font-semibold"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-foreground text-xs font-semibold">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {hint && (
          <span className="text-muted-foreground text-micro font-medium">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
