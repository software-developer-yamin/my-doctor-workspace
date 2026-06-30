"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateProfile } from "@/hooks/queries/use-customer";
import { RootState } from "@/redux/store";
import {
  BloodBagIcon,
  Calendar03Icon,
  CheckmarkBadge01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useSelector } from "react-redux";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const safeCallbackUrl = (url: string): string => {
  if (!url.startsWith("/") || url.startsWith("//")) return "/";
  return url;
};

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl") ?? "/");

  const user = useSelector((state: RootState) => state.auth.user);
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    dob: "",
    bloodGroup: "",
    address: "",
    isBloodDonor: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, any> = {
      isBloodDonor: formData.isBloodDonor,
    };
    if (formData.dob) payload.dob = new Date(formData.dob).toISOString();
    if (formData.bloodGroup) payload.bloodGroup = formData.bloodGroup;
    if (formData.address.trim()) payload.address = formData.address.trim();

    updateMutation.mutate(payload as any, {
      onSuccess: () => {
        router.push(callbackUrl);
      },
    });
  };

  const handleSkip = () => {
    router.push(callbackUrl);
  };

  return (
    <main className="bg-muted/30 min-h-screen w-full lg:flex">
      {/* ── Left Side Banner (lg+) ── */}
      <div className="bg-primary/5 relative hidden flex-1 flex-col justify-center overflow-hidden p-12 lg:flex xl:p-20">
        <div className="bg-primary absolute inset-0 -z-10 opacity-[0.03] mix-blend-multiply"></div>

        <div className="mb-12">
          <Link href="/" className="inline-block">
            <LogoIcon className="text-primary h-16 w-auto" />
          </Link>
        </div>

        <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight xl:text-5xl">
          One last step, <br />
          <span className="text-primary">{firstName}!</span>
        </h1>
        <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed font-medium">
          A complete profile helps us connect you with the right doctors faster
          and ensures your information is ready when you need it most.
        </p>

        <div className="mt-12 flex flex-col gap-6">
          {[
            "Faster appointment bookings",
            "Personalized doctor recommendations",
            "Emergency info always at hand",
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="bg-primary shadow-primary/20 flex h-8 w-8 items-center justify-center rounded-full shadow-lg">
                <HugeiconsIcon
                  icon={CheckmarkBadge01Icon}
                  className="text-primary-foreground h-5 w-5"
                />
              </div>
              <span className="text-foreground text-lg font-semibold">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Side Form Area ── */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-20">
        <div className="bg-card border-border w-full max-w-[500px] rounded-3xl border p-8 shadow-2xl sm:p-12">
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <LogoIcon className="text-primary h-12 w-auto" />
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              Complete Your Profile
            </h2>
            <p className="text-muted-foreground mt-2 text-sm font-medium">
              Help us personalise your experience. All fields are optional.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="animate-in fade-in zoom-in-95 space-y-6 duration-500"
          >
            {/* Date of Birth */}
            <div className="space-y-2">
              <Label
                htmlFor="dob"
                className="text-foreground text-sm font-semibold tracking-tight"
              >
                Date of Birth
              </Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                />
                <Input
                  id="dob"
                  type="date"
                  className="focus:border-primary focus:ring-primary/20 h-12 pl-10 font-medium"
                  value={formData.dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label
                htmlFor="bloodGroup"
                className="text-foreground text-sm font-semibold tracking-tight"
              >
                Blood Group
              </Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={BloodBagIcon}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2"
                />
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(val) =>
                    setFormData({ ...formData, bloodGroup: val })
                  }
                >
                  <SelectTrigger
                    id="bloodGroup"
                    className="h-12! w-full! pl-10! font-medium"
                  >
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg} className="font-medium">
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-foreground text-sm font-semibold tracking-tight"
              >
                Address
              </Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Location01Icon}
                  className="text-muted-foreground absolute top-3.5 left-3 h-5 w-5"
                />
                <Input
                  id="address"
                  placeholder="Your home address"
                  className="focus:border-primary focus:ring-primary/20 h-12 pl-10 font-medium"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Blood Donor */}
            <div className="bg-muted/40 flex items-start gap-3 rounded-xl p-4">
              <Checkbox
                id="isBloodDonor"
                checked={formData.isBloodDonor}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isBloodDonor: !!checked })
                }
                className="mt-0.5"
              />
              <div>
                <Label
                  htmlFor="isBloodDonor"
                  className="text-foreground cursor-pointer text-sm font-semibold"
                >
                  I am willing to donate blood
                </Label>
                <p className="text-muted-foreground mt-0.5 text-xs font-medium">
                  Help save lives — you can be matched with patients in need.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/90 shadow-primary/20 mt-2 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
            >
              {updateMutation.isPending
                ? "Saving profile..."
                : "Complete Profile"}
            </Button>
          </form>

          <div className="border-border mt-6 border-t pt-6 text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors hover:underline"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingContent />
    </Suspense>
  );
}
