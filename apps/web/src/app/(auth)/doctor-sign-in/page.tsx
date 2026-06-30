"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckmarkBadge01Icon,
  LockPasswordIcon,
  Mail01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import { CONSTANT } from "@/config/constant";
import { setCredentials } from "@/redux/slices/auth-slice";
import { authService } from "@/services/auth.service";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

function DoctorSignInContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address.";
    if (!formData.password)
      newErrors.password = "Password is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);

    try {
      const response = await authService.doctorLogin({
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.data) {
        const { accessToken, refreshToken, doctor } = response.data;

        const userData = {
          id: doctor?._id || "",
          name: doctor?.name || "",
          email: doctor?.email,
          role: "doctor" as const,
          photo: doctor?.photo,
        };

        queryClient.clear();
        dispatch(setCredentials({ user: userData, token: accessToken, refreshToken }));

        setCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN, accessToken);
        setCookie("my-doctor-refresh-token", refreshToken);
        setCookie(
          CONSTANT.LOCAL_STORAGE_KEYS.USER_DATA,
          encodeURIComponent(JSON.stringify(userData))
        );

        toast.success(`Welcome back, Dr. ${doctor?.name}!`);
        router.push("/doctor/appointments");
      } else {
        toast.error(response.message || "Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        toast.error("Request timed out. Please check your connection and try again.");
      } else {
        toast.error(
          error.response?.data?.message || "Login failed. Please check your credentials."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-muted/30 min-h-screen w-full lg:flex">
      {/* Left Side Banner */}
      <div className="bg-primary/5 relative hidden flex-1 flex-col justify-center overflow-hidden p-12 lg:flex xl:p-20">
        <div className="bg-primary absolute inset-0 -z-10 opacity-[0.03] mix-blend-multiply" />
        <div className="mb-12">
          <Link href="/" className="inline-block">
            <LogoIcon className="text-primary h-16 w-auto" />
          </Link>
        </div>
        <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight xl:text-5xl">
          Doctor Portal <br />
          <span className="text-primary">My Doctor</span>
        </h1>
        <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed font-medium">
          Manage your appointments, write prescriptions, and track your patients all in one place.
        </p>
        <div className="mt-12 flex flex-col gap-6">
          {[
            "View Today's Appointments",
            "Write Digital Prescriptions",
            "Track Your Patient History",
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="bg-primary shadow-primary/20 flex h-8 w-8 items-center justify-center rounded-full shadow-lg">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-foreground text-lg font-semibold">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-20">
        <div className="bg-card border-border w-full max-w-[500px] rounded-3xl border p-8 shadow-2xl sm:p-12">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <LogoIcon className="text-primary h-12 w-auto" />
            </Link>
          </div>
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              Doctor Sign In
            </h2>
            <p className="text-muted-foreground mt-2 text-sm font-medium">
              Enter your registered email and password to access the doctor portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="animate-in fade-in zoom-in-95 space-y-5 duration-500">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm font-semibold tracking-tight">
                Email Address <span className="text-destructive ml-0.5">*</span>
              </Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`h-12 px-10 font-medium ${errors.email ? "border-destructive" : "focus:border-primary"}`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    clearError("email");
                  }}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs font-medium">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm font-semibold tracking-tight">
                Password <span className="text-destructive ml-0.5">*</span>
              </Label>
              <div className="relative">
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`h-12 px-10 font-medium ${errors.password ? "border-destructive" : "focus:border-primary"}`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    clearError("password");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted-foreground hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
                >
                  <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} className="h-5 w-5" />
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs font-medium">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 shadow-primary/20 mt-4 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="border-border mt-10 border-t pt-8 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              Not a doctor?{" "}
              <Link href="/sign-in" className="text-primary hover:text-primary/80 font-bold transition-colors">
                Patient Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DoctorSignInPage() {
  return (
    <Suspense>
      <DoctorSignInContent />
    </Suspense>
  );
}
