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
import {
  ArrowLeft01Icon,
  CheckmarkBadge01Icon,
  LockPasswordIcon,
  SmartPhone01Icon,
  UserEdit01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type SubmitEvent, Suspense, useState } from "react";

import { CONSTANT } from "@/config/constant";
import { setCredentials } from "@/redux/slices/auth-slice";
import { authService } from "@/services/auth.service";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { PhoneInput } from "@/components/ui/phone-input";

const safeCallbackUrl = (url: string): string => {
  if (!url.startsWith("/") || url.startsWith("//")) return "/";
  return url;
};

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl") ?? "/");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    gender?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const validateStep1 = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters.";
    if (!formData.gender) newErrors.gender = "Please select your gender.";
    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 7)
      newErrors.phone = "Please enter a valid phone number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: typeof errors = {};
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Step 1: Request OTP
    if (step === 1) {
      if (!validateStep1()) return;
      setIsLoading(true);
      try {
        const otpResponse = await authService.requestRegistrationOtp(formData.phone);
        if (!otpResponse.success) {
          toast.error(otpResponse.message || "Failed to send OTP. Please check your phone number.");
          return;
        }
        toast.success("OTP sent successfully to your phone");
        setStep(2);
      } catch (error: any) {
        if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
          toast.error("Request timed out. Please check your connection and try again.");
        } else {
          toast.error(error.response?.data?.message || "Failed to send OTP. Please check your phone number.");
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Step 2: Just proceed to Step 3 (We verify OTP during final registration call)
    if (step === 2) {
      if (formData.otp.length < 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }
      setStep(3);
    }
  };

  const handleFinalSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    const fullPhone = formData.phone;

    try {
      // 1. Verify OTP and Register
      const regResponse = await authService.verifyOtpAndRegister({
        name: formData.name,
        phone: fullPhone,
        otp: formData.otp,
        password: formData.password,
        gender: formData.gender,
        email: formData.email || undefined,
      });

      if (regResponse.success) {
        toast.success("Account created successfully! Logging you in...");

        // 2. Auto Login to get tokens
        const loginResponse = await authService.customerLogin({
          phone: fullPhone,
          password: formData.password,
        });

        if (loginResponse.success && loginResponse.data) {
          const { accessToken, refreshToken, customer } = loginResponse.data;

          const userData = {
            id: customer?._id || "",
            name: customer?.name || "",
            phone: customer?.phone,
            email: customer?.email,
            role: "customer" as const,
          };

          queryClient.clear();
          dispatch(setCredentials({ user: userData, token: accessToken, refreshToken }));

          if (typeof window !== "undefined") {
            setCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN, accessToken);
            setCookie("my-doctor-refresh-token", refreshToken);
            setCookie(
              CONSTANT.LOCAL_STORAGE_KEYS.USER_DATA,
              encodeURIComponent(JSON.stringify(userData)),
            );
          }

          toast.success(`Welcome ${customer?.name}!`);
          router.push(`/onboarding?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        } else {
          toast.error(loginResponse.message || "Account created but auto-login failed. Please log in manually.");
          router.push(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        }
      } else {
        toast.error(regResponse.message || "Registration failed. Please check your details and OTP.");
      }
    } catch (error: any) {
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        toast.error("Request timed out. Please check your connection and try again.");
      } else {
        toast.error(error.response?.data?.message || "Registration failed. Please check your details and OTP.");
      }
    } finally {
      setIsLoading(false);
    }
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
          Join My Doctor &amp; <br />
          <span className="text-primary">Transform your healthcare</span>
        </h1>
        <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed font-medium">
          Get instant access to top hospitals, verify specialized doctors, book
          home care nurses, and request emergency ambulances all in one place.
        </p>

        <div className="mt-12 flex flex-col gap-6">
          {[
            "Instant Appointments Booking",
            "Secure Medical Records Vault",
            "Emergency Services 24/7",
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
              {step === 1 && "Create Account"}
              {step === 2 && "Verify Phone"}
              {step === 3 && "Secure Password"}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm font-medium">
              {step === 1 && "Enter your details to register as a patient."}
              {step === 2 &&
                `We sent a 6-digit code to ${formData.phone}`}
              {step === 3 &&
                "Create a strong password to protect your account."}
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-1 items-center">
                  <div
                    className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? "bg-primary" : "bg-muted"}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              {["Personal Info", "Verify Phone", "Set Password"].map((label, i) => (
                <span
                  key={i}
                  className={`flex-1 text-center text-micro font-medium transition-colors ${step >= i + 1 ? "text-primary" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <form
              onSubmit={handleNext}
              className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-foreground text-sm font-semibold tracking-tight"
                >
                  Full Name <span className="text-destructive ml-0.5">*</span>
                </Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={UserEdit01Icon}
                    className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                  />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className={`h-12 pl-10 font-medium focus:ring-primary/20 ${errors.name ? "border-destructive focus:border-destructive" : "focus:border-primary"}`}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      clearError("name");
                    }}
                  />
                </div>
                {errors.name && <p className="text-destructive text-xs font-medium">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="text-foreground text-sm font-semibold tracking-tight"
                  >
                    Gender <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) => {
                      setFormData({ ...formData, gender: val });
                      clearError("gender");
                    }}
                  >
                    <SelectTrigger
                      id="gender"
                      className={`h-12! w-full! font-medium ${errors.gender ? "border-destructive!" : ""}`}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male" className="font-medium">
                        Male
                      </SelectItem>
                      <SelectItem value="Female" className="font-medium">
                        Female
                      </SelectItem>
                      <SelectItem value="Other" className="font-medium">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-destructive text-xs font-medium">{errors.gender}</p>}
                </div>

                <div className="space-y-4">
                  <Label
                    htmlFor="email"
                    className="text-foreground text-sm font-semibold tracking-tight"
                  >
                    Email{" "}
                    <span className="text-muted-foreground font-medium">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                    className="focus:border-primary focus:ring-primary/20 h-12 font-medium"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-foreground text-sm font-semibold tracking-tight"
                >
                  Phone Number <span className="text-destructive ml-0.5">*</span>
                </Label>
                <PhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={(val) => {
                    setFormData({ ...formData, phone: val as string || "" });
                    clearError("phone");
                  }}
                  placeholder="Enter phone number"
                  className={`[&_input]:h-12 [&_button]:h-12 ${errors.phone ? "[&_input]:border-destructive" : ""}`}
                />
                {errors.phone && <p className="text-destructive text-xs font-medium">{errors.phone}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 shadow-primary/20 mt-4 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
              >
                {isLoading ? "Proceeding..." : "Send OTP"}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Info */}
          {step === 2 && (
            <form
              onSubmit={handleNext}
              className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500"
            >
              <div className="space-y-4">
                <Label
                  htmlFor="otp"
                  className="text-foreground text-sm font-semibold tracking-tight"
                >
                  Enter OTP Code <span className="text-destructive ml-0.5">*</span>
                </Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                  />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="6-digit code"
                    maxLength={6}
                    required
                    className="focus:border-primary focus:ring-primary/20 h-14 pl-11 text-center text-2xl font-bold tracking-[0.3em]"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({ ...formData, otp: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={isLoading || formData.otp.length < 6}
                  className="bg-primary hover:bg-primary/90 shadow-primary/20 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
                >
                  {isLoading ? "Verifying..." : "Verify Number"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-foreground h-12 w-full font-semibold"
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    className="mr-2 h-4 w-4"
                  />
                  Change Phone Number
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <form
              onSubmit={handleFinalSubmit}
              className="animate-in fade-in slide-in-from-right-8 space-y-6 duration-500"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="pass"
                  className="text-foreground text-sm font-semibold tracking-tight"
                >
                  Set Password <span className="text-destructive ml-0.5">*</span>
                </Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={LockPasswordIcon}
                    className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                  />
                  <Input
                    id="pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`h-12 px-10 font-medium focus:ring-primary/20 ${errors.password ? "border-destructive focus:border-destructive" : "focus:border-primary"}`}
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
                    <HugeiconsIcon
                      icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                      className="h-5 w-5"
                    />
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs font-medium">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cpass"
                  className="text-foreground text-sm font-semibold tracking-tight"
                >
                  Confirm Password <span className="text-destructive ml-0.5">*</span>
                </Label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={LockPasswordIcon}
                    className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                  />
                  <Input
                    id="cpass"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    className={`h-12 px-10 font-medium focus:ring-primary/20 ${errors.confirmPassword ? "border-destructive focus:border-destructive" : "focus:border-primary"}`}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      clearError("confirmPassword");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="text-muted-foreground hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
                  >
                    <HugeiconsIcon
                      icon={showConfirmPassword ? ViewOffSlashIcon : ViewIcon}
                      className="h-5 w-5"
                    />
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-destructive text-xs font-medium">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 shadow-primary/20 mt-4 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
              >
                {isLoading ? "Creating Account..." : "Complete Sign Up"}
              </Button>
            </form>
          )}

          <div className="border-border mt-10 border-t pt-8 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              Already have an account?{" "}
              <Link
                href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="text-primary hover:text-primary/80 font-bold transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpContent />
    </Suspense>
  );
}
