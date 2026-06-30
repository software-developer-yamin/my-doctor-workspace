"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  LockPasswordIcon,
  SmartPhone01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, Suspense, useState } from "react";

import { authService } from "@/services/auth.service";
import { toast } from "sonner";

function ForgotPasswordContent() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    phone?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleRequestOtp = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      setErrors({ phone: "Please enter a valid phone number." });
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.requestPasswordResetOtp(phone);
      if (!response.success) {
        toast.error(response.message || "Failed to send OTP. Please check your phone number.");
        return;
      }
      toast.success(response.message || "If this number is registered, you will receive an OTP shortly.");
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
  };

  const handleVerifyOtp = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP." });
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.resetPassword({ phone, otp, newPassword: password });
      if (!response.success) {
        toast.error(response.message || "Failed to reset password. Please try again.");
        return;
      }
      setStep(4);
    } catch (error: any) {
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        toast.error("Request timed out. Please check your connection and try again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-muted/30 min-h-screen w-full lg:flex">
      {/* ── Left Side Banner (lg+) ── */}
      <div className="bg-primary/5 relative hidden flex-1 flex-col justify-center overflow-hidden p-12 lg:flex xl:p-20">
        <div className="bg-primary absolute inset-0 -z-10 opacity-[0.03] mix-blend-multiply" />

        <div className="mb-12">
          <Link href="/" className="inline-block">
            <LogoIcon className="text-primary h-16 w-auto" />
          </Link>
        </div>

        <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight xl:text-5xl">
          Reset your <br />
          <span className="text-primary">password</span>
        </h1>
        <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed font-medium">
          Enter your registered phone number and we'll send you a one-time code
          to securely reset your password.
        </p>

        <div className="mt-12 flex flex-col gap-4">
          {[
            { step: 1, label: "Enter your phone number" },
            { step: 2, label: "Verify with OTP code" },
            { step: 3, label: "Set a new password" },
          ].map(({ step: s, label }) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  step > s
                    ? "bg-primary text-primary-foreground"
                    : step === s
                      ? "bg-primary text-primary-foreground shadow-primary/30 shadow-lg"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? (
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4" />
                ) : (
                  s
                )}
              </div>
              <span
                className={`text-base font-semibold ${
                  step >= s ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
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

          {/* Step indicator (mobile) */}
          {step < 4 && (
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          )}

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verify Phone"}
              {step === 3 && "New Password"}
              {step === 4 && "Password Reset!"}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm font-medium">
              {step === 1 && "Enter your registered phone number to receive a reset code."}
              {step === 2 && `We sent a 6-digit code to ${phone}`}
              {step === 3 && "Create a strong new password for your account."}
              {step === 4 && "Your password has been reset successfully."}
            </p>
          </div>

          {/* Step 1: Phone Number */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground text-sm font-semibold tracking-tight">
                  Phone Number <span className="text-destructive ml-0.5">*</span>
                </Label>
                <PhoneInput
                  id="phone"
                  value={phone}
                  onChange={(val) => {
                    setPhone((val as string) || "");
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
                className="bg-primary hover:bg-primary/90 shadow-primary/20 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>

              <div className="text-center">
                <Link
                  href="/sign-in"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
                  Back to Log In
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="animate-in fade-in slide-in-from-right-8 space-y-8 duration-500">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground text-sm font-semibold tracking-tight">
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
                    className={`h-14 pl-11 text-center text-2xl font-bold tracking-[0.3em] focus:ring-primary/20 ${errors.otp ? "border-destructive focus:border-destructive" : "focus:border-primary"}`}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      clearError("otp");
                    }}
                  />
                </div>
                {errors.otp && <p className="text-destructive text-xs font-medium">{errors.otp}</p>}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 shadow-primary/20 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
                >
                  Verify Code
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-foreground h-12 w-full font-semibold"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 h-4 w-4" />
                  Change Phone Number
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="animate-in fade-in slide-in-from-right-8 space-y-6 duration-500">
              <div className="space-y-2">
                <Label htmlFor="pass" className="text-foreground text-sm font-semibold tracking-tight">
                  New Password <span className="text-destructive ml-0.5">*</span>
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
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

              <div className="space-y-2">
                <Label htmlFor="cpass" className="text-foreground text-sm font-semibold tracking-tight">
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
                    placeholder="Re-enter new password"
                    className={`h-12 px-10 font-medium focus:ring-primary/20 ${errors.confirmPassword ? "border-destructive focus:border-destructive" : "focus:border-primary"}`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError("confirmPassword");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="text-muted-foreground hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
                  >
                    <HugeiconsIcon icon={showConfirmPassword ? ViewOffSlashIcon : ViewIcon} className="h-5 w-5" />
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-destructive text-xs font-medium">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 shadow-primary/20 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-6 text-center duration-500">
              <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="text-primary h-10 w-10" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  You can now log in with your new password.
                </p>
              </div>
              <Button
                onClick={() => router.push("/sign-in")}
                className="bg-primary hover:bg-primary/90 shadow-primary/20 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
              >
                Go to Log In
              </Button>
            </div>
          )}

          {step < 4 && (
            <div className="border-border mt-10 border-t pt-8 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                Remember your password?{" "}
                <Link href="/sign-in" className="text-primary hover:text-primary/80 font-bold transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordContent />
    </Suspense>
  );
}
