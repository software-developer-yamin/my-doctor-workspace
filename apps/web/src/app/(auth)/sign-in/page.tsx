"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  CheckmarkBadge01Icon,
  LockPasswordIcon,
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

const safeCallbackUrl = (url: string): string => {
  if (!url.startsWith("/") || url.startsWith("//")) return "/";
  return url;
};

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl") ?? "/");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 7)
      newErrors.phone = "Please enter a valid phone number.";
    if (!formData.password)
      newErrors.password = "Password is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);

    try {
      const response = await authService.customerLogin({
        phone: formData.phone,
        password: formData.password,
      });

      if (response.success && response.data) {
        const { accessToken, refreshToken, customer } = response.data;

        const userData = {
          id: customer?._id || "",
          name: customer?.name || "",
          phone: customer?.phone,
          email: customer?.email,
          role: "customer" as const,
          photo: customer?.photo,
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

        toast.success(`Welcome back, ${customer?.name}!`);
        router.push(callbackUrl);
      } else {
        toast.error(response.message || "Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        toast.error("Request timed out. Please check your connection and try again.");
      } else {
        toast.error(
          error.response?.data?.message || "Login failed. Please check your credentials.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-muted/30 min-h-screen w-full flex-row-reverse lg:flex">
      {/* ── Right Side Banner (lg+) ── Note: flex-row-reverse puts it on the right to differentiate from SignUp */}
      <div className="bg-primary/5 relative hidden flex-1 flex-col justify-center overflow-hidden p-12 lg:flex xl:p-20">
        <div className="bg-primary absolute inset-0 -z-10 opacity-[0.03] mix-blend-multiply"></div>

        <div className="mb-12">
          <Link href="/" className="inline-block">
            <LogoIcon className="text-primary h-16 w-auto" />
          </Link>
        </div>

        <h1 className="text-foreground text-4xl leading-tight font-bold tracking-tight xl:text-5xl">
          Welcome back to <br />
          <span className="text-primary">My Doctor</span>
        </h1>
        <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed font-medium">
          Log in to access your medical records, track appointments, and consult
          with the best doctors in Bangladesh.
        </p>

        <div className="mt-12 flex flex-col gap-6">
          {[
            "Real-time Appointments Update",
            "Safe & Encrypted Data",
            "Priority Support Access",
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

      {/* ── Left Side Form Area ── */}
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
              Log In
            </h2>
            <p className="text-muted-foreground mt-2 text-sm font-medium">
              Enter your phone number and password to access your account.
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="animate-in fade-in zoom-in-95 space-y-5 duration-500"
          >
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="pass"
                  className="text-foreground text-sm font-semibold tracking-tight"
                >
                  Password <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2"
                />
                <Input
                  id="pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 shadow-primary/20 mt-4 h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all active:scale-95"
            >
              {isLoading ? "Authenticating..." : "Log In"}
            </Button>
          </form>

          <div className="border-border mt-10 border-t pt-8 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              Don't have an account?{" "}
              <Link
                href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="text-primary hover:text-primary/80 font-bold transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
