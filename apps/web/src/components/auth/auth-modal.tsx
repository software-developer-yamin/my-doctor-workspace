"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Smartphone,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  Clock,
  Calendar,
  Check,
  Hospital,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { setCredentials } from "@/redux/slices/auth-slice";
import { CONSTANT } from "@/config/constant";
import { setCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const phoneSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const emailSchema = z.object({
  identifier: z.string().min(1, "Please enter your phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const benefits = [
  {
    title: "Doctor Appointment",
    description:
      "Book your appointment easily with few clicks and choose your preferred specialist with a hassle-free experience.",
    icon: Calendar,
  },
  {
    title: "Guide Service",
    description:
      "Request a personal assistant for your hospital visit to help you navigate through medical procedures and departments.",
    icon: User,
  },
  {
    title: "Doctor At Home",
    description:
      "Book a certified doctor to visit you at home for your convenience and specialized care without leaving your house.",
    icon: Smartphone,
  },
  {
    title: "Ambulance Service",
    description:
      "Access 24/7 emergency ambulance services instantly to ensure rapid response and professional medical transportation.",
    icon: Clock,
  },
];

const stats = [
  { label: "Verified Doctors", value: "1,700+", icon: UserCheck },
  { label: "People Trusted", value: "700K+", icon: ShieldCheck },
  { label: "Partner Hospitals", value: "250+", icon: Hospital },
];

type ModalMode = "login" | "signup" | "forgot-password";
type LoginType = "patient" | "doctor";
type SignUpStep = 1 | 2 | 3;

export function AuthModal({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled
    ? (controlledOnOpenChange ?? (() => {}))
    : setInternalOpen;
  const [modalMode, setModalMode] = useState<ModalMode>("login");
  const [loginType, setLoginType] = useState<LoginType>("patient");
  const [loginMethod, setLoginMethod] = useState<"mobile" | "email">("mobile");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Forgot password state
  const [fpStep, setFpStep] = useState<1 | 2 | 3 | 4>(1);
  const [fpPhone, setFpPhone] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpShowPassword, setFpShowPassword] = useState(false);
  const [fpShowConfirmPassword, setFpShowConfirmPassword] = useState(false);
  const [fpErrors, setFpErrors] = useState<{
    phone?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [fpIsLoading, setFpIsLoading] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Sign-up state
  const [signUpStep, setSignUpStep] = useState<SignUpStep>(1);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] =
    useState(false);
  const [signUpErrors, setSignUpErrors] = useState<{
    name?: string;
    gender?: string;
    phone?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    reset: resetPhoneForm,
    formState: { errors: phoneErrors },
  } = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    reset: resetOtpForm,
    formState: { errors: otpErrors },
  } = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    reset: resetEmailForm,
    formState: { errors: emailErrors },
  } = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onPhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    try {
      const res = await authService.requestLoginOtp(values.phone);
      if (!res.success) {
        toast.error(res.message || "Failed to send OTP.");
        return;
      }
      toast.success("OTP sent to your phone!");
      setPhoneNumber(values.phone);
      setStep("otp");
      setResendTimer(60); // Start 60s countdown
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || !phoneNumber) return;
    setIsLoading(true);
    try {
      const res = await authService.requestLoginOtp(phoneNumber);
      if (!res.success) {
        toast.error(res.message || "Failed to resend OTP.");
        return;
      }
      toast.success("OTP resent successfully!");
      setResendTimer(60);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const onOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyLoginOtp({
        phone: phoneNumber,
        otp: values.otp,
      });
      if (response.success && response.data) {
        const { accessToken, refreshToken, customer } = response.data;
        const userData = {
          id: customer?._id || "",
          name: customer?.name || "",
          phone: customer?.phone,
          email: customer?.email,
          role: "customer" as const,
        };
        queryClient.clear();
        dispatch(
          setCredentials({ user: userData, token: accessToken, refreshToken }),
        );
        setCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN, accessToken);
        setCookie("my-doctor-refresh-token", refreshToken);
        setCookie(
          CONSTANT.LOCAL_STORAGE_KEYS.USER_DATA,
          encodeURIComponent(JSON.stringify(userData)),
        );
        toast.success(`Welcome back, ${customer?.name}!`);
        setIsOpen(false);
        setStep("phone");
        resetPhoneForm();
        resetOtpForm();
      } else {
        toast.error(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Login failed. Please check your OTP.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      let response;

      if (loginType === "doctor") {
        response = await authService.doctorLogin({
          email: values.identifier,
          password: values.password,
        });
      } else {
        response = await authService.customerLogin({
          phone: values.identifier,
          password: values.password,
        });
      }

      if (response.success && response.data) {
        const { accessToken, refreshToken, customer, doctor } = response.data;

        let userData;
        if (loginType === "doctor" && doctor) {
          userData = {
            id: doctor._id || "",
            name: doctor.name || "",
            phone: doctor.phone,
            email: doctor.email,
            photo: doctor.photo,
            role: "doctor" as const,
          };
        } else if (customer) {
          userData = {
            id: customer._id || "",
            name: customer.name || "",
            phone: customer.phone,
            email: customer.email,
            role: "customer" as const,
          };
        } else {
          toast.error("Login failed. Please check your credentials.");
          return;
        }

        queryClient.clear();
        dispatch(
          setCredentials({ user: userData, token: accessToken, refreshToken }),
        );
        setCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN, accessToken);
        setCookie("my-doctor-refresh-token", refreshToken);
        setCookie(
          CONSTANT.LOCAL_STORAGE_KEYS.USER_DATA,
          encodeURIComponent(JSON.stringify(userData)),
        );

        toast.success(`Welcome back, ${userData.name}!`);
        setIsOpen(false);
        setLoginMethod("mobile");
        setStep("phone");
        resetEmailForm();

        if (loginType === "doctor") {
          router.push("/doctor/appointments");
        }
      } else {
        toast.error(
          response.message || "Invalid credentials. Please try again.",
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearSignUpError = (field: keyof typeof signUpErrors) =>
    setSignUpErrors((prev) => ({ ...prev, [field]: undefined }));

  const validateSignUpStep1 = () => {
    const errs: typeof signUpErrors = {};
    if (!signUpData.name.trim()) errs.name = "Full name is required.";
    else if (signUpData.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters.";
    if (!signUpData.gender) errs.gender = "Please select your gender.";
    if (!signUpData.phone || signUpData.phone.replace(/\D/g, "").length < 7)
      errs.phone = "Please enter a valid phone number.";
    setSignUpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateSignUpStep3 = () => {
    const errs: typeof signUpErrors = {};
    if (!signUpData.password) errs.password = "Password is required.";
    else if (signUpData.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (!signUpData.confirmPassword)
      errs.confirmPassword = "Please confirm your password.";
    else if (signUpData.password !== signUpData.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    setSignUpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUpStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUpStep1()) return;
    setIsLoading(true);
    try {
      const res = await authService.requestRegistrationOtp(signUpData.phone);
      if (!res.success) {
        toast.error(res.message || "Failed to send OTP.");
        return;
      }
      toast.success("OTP sent to your phone!");
      setSignUpStep(2);
      setResendTimer(60); // Start 60s countdown
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSignUpOTP = async () => {
    if (resendTimer > 0 || !signUpData.phone) return;
    setIsLoading(true);
    try {
      const res = await authService.requestRegistrationOtp(signUpData.phone);
      if (!res.success) {
        toast.error(res.message || "Failed to resend OTP.");
        return;
      }
      toast.success("OTP resent successfully!");
      setResendTimer(60);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setSignUpStep(3);
  };

  const handleSignUpFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUpStep3()) return;
    setIsLoading(true);
    try {
      const regRes = await authService.verifyOtpAndRegister({
        name: signUpData.name,
        phone: signUpData.phone,
        otp: signUpData.otp,
        password: signUpData.password,
        gender: signUpData.gender,
        email: signUpData.email || undefined,
      });
      if (!regRes.success) {
        toast.error(regRes.message || "Registration failed.");
        return;
      }
      toast.success("Account created! Logging you in…");
      const loginRes = await authService.customerLogin({
        phone: signUpData.phone,
        password: signUpData.password,
      });
      if (loginRes.success && loginRes.data) {
        const { accessToken, refreshToken, customer } = loginRes.data;
        const userData = {
          id: customer?._id || "",
          name: customer?.name || "",
          phone: customer?.phone,
          email: customer?.email,
          role: "customer" as const,
        };
        queryClient.clear();
        dispatch(
          setCredentials({ user: userData, token: accessToken, refreshToken }),
        );
        setCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN, accessToken);
        setCookie("my-doctor-refresh-token", refreshToken);
        setCookie(
          CONSTANT.LOCAL_STORAGE_KEYS.USER_DATA,
          encodeURIComponent(JSON.stringify(userData)),
        );
        toast.success(`Welcome ${customer?.name}!`);
        setIsOpen(false);
        router.push("/onboarding");
      } else {
        toast.error("Account created but auto-login failed. Please log in.");
        setModalMode("login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSignUp = () => {
    setSignUpStep(1);
    setSignUpData({
      name: "",
      email: "",
      gender: "",
      phone: "",
      otp: "",
      password: "",
      confirmPassword: "",
    });
    setSignUpErrors({});
    setShowSignUpPassword(false);
    setShowSignUpConfirmPassword(false);
  };

  const clearFpError = (field: keyof typeof fpErrors) =>
    setFpErrors((prev) => ({ ...prev, [field]: undefined }));

  const resetForgotPassword = () => {
    setFpStep(1);
    setFpPhone("");
    setFpOtp("");
    setFpPassword("");
    setFpConfirmPassword("");
    setFpErrors({});
    setFpShowPassword(false);
    setFpShowConfirmPassword(false);
  };

  const handleFpRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpPhone || fpPhone.replace(/\D/g, "").length < 7) {
      setFpErrors({ phone: "Please enter a valid phone number." });
      return;
    }
    setFpIsLoading(true);
    try {
      const res = await authService.requestPasswordResetOtp(fpPhone);
      if (!res.success) {
        toast.error(res.message || "Failed to send OTP.");
        return;
      }
      toast.success(res.message || "If this number is registered, you will receive an OTP shortly.");
      setFpStep(2);
      setResendTimer(60);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setFpIsLoading(false);
    }
  };

  const handleFpResendOtp = async () => {
    if (resendTimer > 0 || !fpPhone) return;
    setFpIsLoading(true);
    try {
      const res = await authService.requestPasswordResetOtp(fpPhone);
      if (!res.success) {
        toast.error(res.message || "Failed to resend OTP.");
        return;
      }
      toast.success(res.message || "If this number is registered, you will receive an OTP shortly.");
      setResendTimer(60);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setFpIsLoading(false);
    }
  };

  const handleFpVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (fpOtp.length < 6) {
      setFpErrors({ otp: "Please enter a valid 6-digit OTP." });
      return;
    }
    setFpStep(3);
  };

  const handleFpResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof fpErrors = {};
    if (!fpPassword) errs.password = "Password is required.";
    else if (fpPassword.length < 6) errs.password = "Password must be at least 6 characters.";
    if (!fpConfirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (fpPassword !== fpConfirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (Object.keys(errs).length > 0) {
      setFpErrors(errs);
      return;
    }
    setFpIsLoading(true);
    try {
      const res = await authService.resetPassword({ phone: fpPhone, otp: fpOtp, newPassword: fpPassword });
      if (!res.success) {
        toast.error(res.message || "Failed to reset password.");
        return;
      }
      setFpStep(4);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setFpIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setModalMode("login");
        setLoginType("patient");
        setLoginMethod("mobile");
        setStep("phone");
        resetPhoneForm();
        resetOtpForm();
        resetEmailForm();
        setShowPassword(false);
        resetSignUp();
        resetForgotPassword();
      }, 300);
    }
  };

  const handleLoginTypeChange = (type: LoginType) => {
    setLoginType(type);
    if (type === "doctor") {
      setLoginMethod("email");
    } else {
      setLoginMethod("mobile");
      setStep("phone");
    }
    resetEmailForm();
  };

  const renderDividerAndSwitch = (currentMethod: "mobile" | "email") => (
    <div className="mt-6 flex flex-col">
      {/* OR Divider */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="via-border absolute h-[1px] w-full bg-gradient-to-r from-transparent to-transparent" />
        <span className="text-muted-foreground relative z-10 bg-card px-4 text-micro font-semibold tracking-widest uppercase">
          OR CONTINUE WITH
        </span>
      </div>

      {/* Switch Button */}
      <button
        type="button"
        onClick={() => {
          setLoginMethod(currentMethod === "mobile" ? "email" : "mobile");
          setStep("phone");
        }}
        className="border-border bg-card text-foreground hover:border-primary hover:bg-muted/30 mb-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border text-sm font-semibold transition-colors duration-200 active:scale-[0.98]"
      >
        {currentMethod === "mobile" ? (
          <>
            <Lock size={18} strokeWidth={2.5} />
            Login with password
          </>
        ) : (
          <>
            <Smartphone size={18} strokeWidth={2.5} />
            Login with OTP
          </>
        )}
      </button>

      {/* Sign up */}
      <p className="text-muted-foreground text-center text-sm font-medium">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => {
            setModalMode("signup");
            resetSignUp();
          }}
          className="text-primary hover:text-primary-dark cursor-pointer border-none bg-transparent p-0 font-semibold underline underline-offset-4 transition-colors duration-200"
        >
          Sign up now
        </button>
      </p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent
        showCloseButton={false}
        className="w-[95vw] !max-w-[1120px] gap-0 border-none bg-transparent p-0 shadow-none focus:outline-none"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Access your My Doctor account or create a new one to manage your
            healthcare.
          </DialogDescription>
        </DialogHeader>
        {/* Fixed Close Button */}
        <DialogClose className="text-foreground absolute top-4 right-4 z-50 rounded-full bg-white/20 p-2 backdrop-blur-md transition-all duration-300 hover:bg-white/40 sm:top-5 sm:right-5">
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="sr-only">Close</span>
        </DialogClose>
        {/* ── OUTER WRAPPER — fixed height prevents resize on step switch ── */}
        <div
          className="scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 flex max-h-[96vh] w-full overflow-y-auto rounded-2xl bg-card sm:rounded-3xl"
          style={{
            minHeight: "min(540px, 90vh)",
            height: "fit-content",
            boxShadow:
              "0 24px 80px color-mix(in oklch, var(--foreground), transparent 90%), 0 4px 24px color-mix(in oklch, var(--foreground), transparent 95%)",
          }}
        >
          {/* Support for LG height with responsive safety */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @media (min-width: 1024px) {
                .auth-modal-wrapper { min-height: min(640px, 85vh); height: fit-content !important; }
              }
              @media (max-height: 720px) {
                .auth-modal-wrapper { min-height: 0 !important; height: auto !important; }
                .auth-stats-container { display: none !important; }
              }
            `,
            }}
          />
          <div className="auth-modal-wrapper flex min-h-full w-full overflow-hidden">
            {/* ══════════════════════════════════════
                LEFT PANEL — hidden on mobile, visible md+
            ══════════════════════════════════════ */}
            <div
              className="from-primary-light/50 hidden min-h-full flex-col bg-linear-to-br to-white lg:flex"
              style={{
                width: "44.5%",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background Patterns */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Top right dots */}
                <div className="absolute top-10 right-10 opacity-[0.08]">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    {[...Array(25)].map((_, i) => (
                      <circle
                        key={i}
                        cx={(i % 5) * 16 + 8}
                        cy={Math.floor(i / 5) * 16 + 8}
                        r="2.5"
                        fill="var(--primary)"
                      />
                    ))}
                  </svg>
                </div>
                {/* Plus icons */}
                <div className="absolute top-[28%] right-14 opacity-[0.08]">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div className="absolute top-[42%] right-6 opacity-[0.05]">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>

                {/* Decorative waves/blobs */}
                <div
                  className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
                  style={{
                    background:
                      "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                  }}
                />
                <div
                  className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[80px]"
                  style={{
                    background:
                      "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                  }}
                />
              </div>

              {/* Logo */}
              <div className="z-10 pt-10 pl-10">
                <Image
                  src="/logo.svg"
                  alt="My Doctor"
                  width={160}
                  height={50}
                  className="h-11 w-auto"
                />
              </div>

              {/* Heading */}
              <div className="z-10 mt-6 pr-10 pl-10">
                <h2 className="text-foreground mb-2 text-3xl leading-[1.2] font-bold tracking-tight">
                  Benefits at <span className="text-primary">My Doctor</span>
                </h2>
                <p className="text-muted-foreground max-w-[280px] text-sm leading-relaxed font-medium">
                  You will always have the best health care from us.
                </p>
              </div>

              {/* Benefit Card Slider */}
              <div className="z-10 mt-7 px-7">
                <div className="border-primary/10 shadow-primary/5 flex min-h-[260px] flex-col items-center rounded-3xl border bg-card/70 p-8 text-center shadow-sm backdrop-blur-xl">
                  <div
                    key={currentBenefit}
                    className="flex flex-col items-center opacity-100 transition-all duration-700 ease-in-out"
                    style={{ animation: "auth-fade-in 0.6s ease-out" }}
                  >
                    <style
                      dangerouslySetInnerHTML={{
                        __html: `
                      @keyframes auth-fade-in {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                    `,
                      }}
                    />
                    {/* Icon Container */}
                    <div className="bg-primary-light mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm">
                      {(() => {
                        const Icon = benefits[currentBenefit].icon;
                        return Icon ? (
                          <Icon size={28} className="text-primary" />
                        ) : null;
                      })()}
                    </div>

                    <h3 className="text-foreground mb-3 text-xl font-semibold transition-all duration-300">
                      {benefits[currentBenefit].title}
                    </h3>
                    <p className="text-muted-foreground mb-6 min-h-[5rem] px-2 text-body-sm leading-[1.6] transition-all duration-300">
                      {benefits[currentBenefit].description}
                    </p>
                  </div>

                  {/* Pagination Dots */}
                  <div className="mt-auto flex gap-2.5">
                    {benefits.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentBenefit(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentBenefit === i
                            ? "bg-primary w-6"
                            : "bg-border w-1.5"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="auth-stats-container z-10 mt-auto flex justify-between gap-2 px-7 pt-6 pb-10">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="border-primary-light group flex flex-1 cursor-default flex-col items-center justify-center rounded-2xl border bg-card/60 py-3 backdrop-blur-md transition-all duration-300 hover:bg-card/80 hover:shadow-lg"
                  >
                    <div className="bg-primary-light group-hover:bg-primary/10 mb-1.5 flex h-8 w-8 items-center justify-center rounded-full transition-colors">
                      <s.icon size={16} className="text-primary" />
                    </div>
                    <span className="text-foreground text-2xs leading-tight font-semibold">
                      {s.value}
                    </span>
                    <span className="text-muted-foreground text-3xs font-medium">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════
                RIGHT PANEL — full width on mobile, 56% on lg+
            ══════════════════════════════════════ */}
            <div
              className="relative flex min-h-full w-full flex-col bg-card"
              style={{ flex: 1 }}
            >
              {/* ── INNER CONTENT WRAPPER ── */}
              <div className="mx-auto flex min-h-full w-full max-w-[520px] flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 lg:mx-0 lg:max-w-none lg:px-14 lg:py-12">
                {/* ── SIGN UP MODE ── */}
                {modalMode === "signup" && (
                  <div className="w-full">
                    {/* Back to login */}
                    <button
                      type="button"
                      onClick={() => {
                        setModalMode("login");
                        resetSignUp();
                      }}
                      className="text-muted-foreground hover:text-foreground mb-5 flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <ArrowLeft size={16} />
                      Back to Login
                    </button>

                    {/* Step header */}
                    <h2 className="text-foreground mb-1 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                      {signUpStep === 1 && (
                        <>
                          Create <span className="text-primary">Account</span>
                        </>
                      )}
                      {signUpStep === 2 && (
                        <>
                          Verify <span className="text-primary">Phone</span>
                        </>
                      )}
                      {signUpStep === 3 && (
                        <>
                          Set <span className="text-primary">Password</span>
                        </>
                      )}
                    </h2>
                    <p className="text-muted-foreground mb-5 text-sm">
                      {signUpStep === 1 &&
                        "Enter your details to register as a patient."}
                      {signUpStep === 2 &&
                        `We sent a 6-digit code to ${signUpData.phone}`}
                      {signUpStep === 3 &&
                        "Create a strong password to protect your account."}
                    </p>

                    {/* Stepper */}
                    <div className="mb-7">
                      <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                          <div
                            key={s}
                            className="bg-border relative h-1.5 flex-1 overflow-hidden rounded-full"
                          >
                            <div
                              className={`bg-primary absolute inset-0 transition-transform duration-500 ease-out ${signUpStep >= s ? "translate-x-0" : "-translate-x-full"}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-1.5 flex gap-1.5">
                        {["Personal Info", "Verify Phone", "Set Password"].map(
                          (label, i) => (
                            <span
                              key={i}
                              className={`flex-1 text-center text-micro font-semibold ${signUpStep >= i + 1 ? "text-primary" : "text-muted-foreground"}`}
                            >
                              {label}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Step 1 */}
                    {signUpStep === 1 && (
                      <form
                        onSubmit={handleSignUpStep1}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-foreground text-body-sm font-semibold">
                            Full Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
                              <User size={17} />
                            </div>
                            <Input
                              placeholder="Enter your full name"
                              className={`border-border bg-muted/30 h-12 rounded-xl pl-10 text-sm ${signUpErrors.name ? "border-destructive" : "focus:border-primary"}`}
                              value={signUpData.name}
                              onChange={(e) => {
                                setSignUpData((p) => ({
                                  ...p,
                                  name: e.target.value,
                                }));
                                clearSignUpError("name");
                              }}
                            />
                          </div>
                          {signUpErrors.name && (
                            <p className="text-destructive text-xs">
                              {signUpErrors.name}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-foreground text-body-sm font-semibold">
                              Gender <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={signUpData.gender}
                              onValueChange={(val) => {
                                setSignUpData((p) => ({ ...p, gender: val }));
                                clearSignUpError("gender");
                              }}
                            >
                              <SelectTrigger
                                className={`border-border bg-muted/30 h-12 rounded-xl border text-sm font-medium data-[size=default]:h-12 ${signUpErrors.gender ? "border-destructive" : ""}`}
                              >
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {signUpErrors.gender && (
                              <p className="text-destructive text-xs">
                                {signUpErrors.gender}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-foreground text-body-sm font-semibold">
                              Email{" "}
                              <span className="text-muted-foreground font-normal">
                                (Optional)
                              </span>
                            </Label>
                            <Input
                              type="email"
                              placeholder="mail@example.com"
                              className="border-border bg-muted/30 focus:border-primary h-12 rounded-xl text-sm"
                              value={signUpData.email}
                              onChange={(e) =>
                                setSignUpData((p) => ({
                                  ...p,
                                  email: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-foreground text-body-sm font-semibold">
                            Phone Number{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <PhoneInput
                            placeholder="+8801XXXXXXXXX"
                            defaultCountry="BD"
                            value={signUpData.phone}
                            onChange={(val) => {
                              setSignUpData((p) => ({
                                ...p,
                                phone: (val as string) || "",
                              }));
                              clearSignUpError("phone");
                            }}
                            className={`[&_input]:border-border [&_button]:border-border [&_input]:bg-muted/30 [&_button]:bg-muted/30 rounded-xl text-sm [&_button]:h-12 [&_button]:border [&_input]:h-12 [&_input]:border ${signUpErrors.phone ? "[&_input]:border-destructive [&_button]:border-destructive" : ""}`}
                          />
                          {signUpErrors.phone && (
                            <p className="text-destructive text-xs">
                              {signUpErrors.phone}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-primary-linear shadow-primary mt-1 h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Sending OTP…
                            </span>
                          ) : (
                            "Send OTP"
                          )}
                        </Button>
                      </form>
                    )}

                    {/* Step 2 */}
                    {signUpStep === 2 && (
                      <form
                        onSubmit={handleSignUpStep2}
                        className="flex w-full flex-col items-center gap-5"
                      >
                        <div className="flex w-full justify-center">
                          <InputOTP
                            maxLength={6}
                            value={signUpData.otp}
                            onChange={(val) => {
                              setSignUpData((p) => ({ ...p, otp: val }));
                              clearSignUpError("otp");
                            }}
                          >
                            <InputOTPGroup className="w-full justify-center gap-2 rounded-none sm:gap-3">
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                <InputOTPSlot
                                  key={i}
                                  index={i}
                                  className={`border-border focus-visible:border-primary h-12 w-10 rounded-none border-0 border-b-[2.5px] bg-transparent px-0 text-center text-2xl font-bold shadow-none first:rounded-none first:border-l-0 last:rounded-none focus-visible:ring-0 sm:w-11 ${signUpErrors.otp ? "border-destructive" : ""}`}
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        {signUpErrors.otp && (
                          <p className="text-center text-xs text-destructive">
                            {signUpErrors.otp}
                          </p>
                        )}

                        <Button
                          type="submit"
                          disabled={isLoading || signUpData.otp.length < 6}
                          className="bg-primary-linear shadow-primary mt-2 h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Verifying…
                            </span>
                          ) : (
                            "Verify Number"
                          )}
                        </Button>

                        <div className="flex w-full flex-col items-center gap-3">
                          <button
                            type="button"
                            disabled={resendTimer > 0 || isLoading}
                            onClick={handleResendSignUpOTP}
                            className={`text-sm font-semibold transition-colors ${
                              resendTimer > 0 || isLoading
                                ? "text-muted-foreground cursor-not-allowed"
                                : "text-primary hover:text-primary-dark"
                            }`}
                          >
                            {resendTimer > 0
                              ? `Resend Code in ${resendTimer}s`
                              : "Re-Send Code"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setSignUpStep(1)}
                            className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 text-sm font-medium transition-colors"
                          >
                            <ArrowLeft size={15} /> Change Phone Number
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Step 3 */}
                    {signUpStep === 3 && (
                      <form
                        onSubmit={handleSignUpFinal}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-foreground text-body-sm font-semibold">
                            Set Password{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
                              <Lock size={17} />
                            </div>
                            <Input
                              type={showSignUpPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className={`border-border bg-muted/30 h-12 rounded-xl pr-10 pl-10 text-sm ${signUpErrors.password ? "border-destructive" : "focus:border-primary"}`}
                              value={signUpData.password}
                              onChange={(e) => {
                                setSignUpData((p) => ({
                                  ...p,
                                  password: e.target.value,
                                }));
                                clearSignUpError("password");
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowSignUpPassword(!showSignUpPassword)
                              }
                              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
                            >
                              {showSignUpPassword ? (
                                <EyeOff size={17} />
                              ) : (
                                <Eye size={17} />
                              )}
                            </button>
                          </div>
                          {signUpErrors.password && (
                            <p className="text-destructive text-xs">
                              {signUpErrors.password}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-foreground text-body-sm font-semibold">
                            Confirm Password{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
                              <Lock size={17} />
                            </div>
                            <Input
                              type={
                                showSignUpConfirmPassword ? "text" : "password"
                              }
                              placeholder="Re-enter password"
                              className={`border-border bg-muted/30 h-12 rounded-xl pr-10 pl-10 text-sm ${signUpErrors.confirmPassword ? "border-destructive" : "focus:border-primary"}`}
                              value={signUpData.confirmPassword}
                              onChange={(e) => {
                                setSignUpData((p) => ({
                                  ...p,
                                  confirmPassword: e.target.value,
                                }));
                                clearSignUpError("confirmPassword");
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowSignUpConfirmPassword(
                                  !showSignUpConfirmPassword,
                                )
                              }
                              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
                            >
                              {showSignUpConfirmPassword ? (
                                <EyeOff size={17} />
                              ) : (
                                <Eye size={17} />
                              )}
                            </button>
                          </div>
                          {signUpErrors.confirmPassword && (
                            <p className="text-destructive text-xs">
                              {signUpErrors.confirmPassword}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-primary-linear shadow-primary mt-1 h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Creating Account…
                            </span>
                          ) : (
                            "Complete Sign Up"
                          )}
                        </Button>

                        <p className="text-muted-foreground mt-1 text-center text-sm font-medium">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setModalMode("login");
                              resetSignUp();
                            }}
                            className="text-primary hover:text-primary-dark cursor-pointer border-none bg-transparent p-0 font-semibold underline underline-offset-4 transition-colors duration-200"
                          >
                            Log In
                          </button>
                        </p>
                      </form>
                    )}
                  </div>
                )}

                {/* ── FORGOT PASSWORD MODE ── */}
                {modalMode === "forgot-password" && (
                  <div className="w-full">
                    {fpStep < 4 && (
                      <button
                        type="button"
                        onClick={() => {
                          setModalMode("login");
                          resetForgotPassword();
                        }}
                        className="text-muted-foreground hover:text-foreground mb-5 flex items-center gap-1.5 text-sm font-medium transition-colors"
                      >
                        <ArrowLeft size={16} />
                        Back to Login
                      </button>
                    )}

                    <h2 className="text-foreground mb-1 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                      {fpStep === 1 && <>Forgot <span className="text-primary">Password?</span></>}
                      {fpStep === 2 && <>Verify <span className="text-primary">Phone</span></>}
                      {fpStep === 3 && <>New <span className="text-primary">Password</span></>}
                      {fpStep === 4 && <>Password <span className="text-primary">Reset!</span></>}
                    </h2>
                    <p className="text-muted-foreground mb-5 text-sm">
                      {fpStep === 1 && "Enter your registered phone number to receive a reset code."}
                      {fpStep === 2 && `We sent a 6-digit code to ${fpPhone}`}
                      {fpStep === 3 && "Create a strong new password for your account."}
                      {fpStep === 4 && "Your password has been successfully reset."}
                    </p>

                    {/* Step 1: Phone */}
                    {fpStep === 1 && (
                      <form onSubmit={handleFpRequestOtp} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-foreground text-body-sm font-semibold">
                            Phone Number <span className="text-destructive">*</span>
                          </Label>
                          <PhoneInput
                            placeholder="+8801XXXXXXXXX"
                            defaultCountry="BD"
                            value={fpPhone}
                            onChange={(val) => {
                              setFpPhone((val as string) || "");
                              clearFpError("phone");
                            }}
                            className={`[&_input]:border-border [&_button]:border-border [&_input]:bg-muted/30 [&_button]:bg-muted/30 rounded-xl text-sm [&_button]:h-12 [&_button]:border [&_input]:h-12 [&_input]:border ${fpErrors.phone ? "[&_input]:border-destructive [&_button]:border-destructive" : ""}`}
                          />
                          {fpErrors.phone && <p className="text-destructive text-xs">{fpErrors.phone}</p>}
                        </div>
                        <Button
                          type="submit"
                          disabled={fpIsLoading}
                          className="bg-primary-linear shadow-primary h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                        >
                          {fpIsLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Sending OTP…
                            </span>
                          ) : "Send OTP"}
                        </Button>
                      </form>
                    )}

                    {/* Step 2: OTP */}
                    {fpStep === 2 && (
                      <form onSubmit={handleFpVerifyOtp} className="flex w-full flex-col items-center gap-5">
                        <div className="flex w-full justify-center">
                          <InputOTP
                            maxLength={6}
                            value={fpOtp}
                            onChange={(val) => {
                              setFpOtp(val);
                              clearFpError("otp");
                            }}
                          >
                            <InputOTPGroup className="w-full justify-center gap-2 rounded-none sm:gap-3">
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                <InputOTPSlot
                                  key={i}
                                  index={i}
                                  className={`border-border focus-visible:border-primary h-12 w-10 rounded-none border-0 border-b-[2.5px] bg-transparent px-0 text-center text-2xl font-bold shadow-none first:rounded-none first:border-l-0 last:rounded-none focus-visible:ring-0 sm:w-11 ${fpErrors.otp ? "border-destructive" : ""}`}
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        {fpErrors.otp && <p className="text-center text-xs text-destructive">{fpErrors.otp}</p>}
                        <Button
                          type="submit"
                          disabled={fpIsLoading || fpOtp.length < 6}
                          className="bg-primary-linear shadow-primary mt-2 h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                        >
                          {fpIsLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Verifying…
                            </span>
                          ) : "Verify Code"}
                        </Button>
                        <div className="flex w-full flex-col items-center gap-3">
                          <button
                            type="button"
                            disabled={resendTimer > 0 || fpIsLoading}
                            onClick={handleFpResendOtp}
                            className={`text-sm font-semibold transition-colors ${resendTimer > 0 || fpIsLoading ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:text-primary-dark"}`}
                          >
                            {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Re-Send Code"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setFpStep(1)}
                            className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 text-sm font-medium transition-colors"
                          >
                            <ArrowLeft size={15} /> Change Phone Number
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Step 3: New Password */}
                    {fpStep === 3 && (
                      <form onSubmit={handleFpResetPassword} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-foreground text-body-sm font-semibold">
                            New Password <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
                              <Lock size={17} />
                            </div>
                            <Input
                              type={fpShowPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className={`border-border bg-muted/30 h-12 rounded-xl pr-10 pl-10 text-sm ${fpErrors.password ? "border-destructive" : "focus:border-primary"}`}
                              value={fpPassword}
                              onChange={(e) => {
                                setFpPassword(e.target.value);
                                clearFpError("password");
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setFpShowPassword(!fpShowPassword)}
                              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
                            >
                              {fpShowPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                          {fpErrors.password && <p className="text-destructive text-xs">{fpErrors.password}</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-foreground text-body-sm font-semibold">
                            Confirm Password <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
                              <Lock size={17} />
                            </div>
                            <Input
                              type={fpShowConfirmPassword ? "text" : "password"}
                              placeholder="Re-enter new password"
                              className={`border-border bg-muted/30 h-12 rounded-xl pr-10 pl-10 text-sm ${fpErrors.confirmPassword ? "border-destructive" : "focus:border-primary"}`}
                              value={fpConfirmPassword}
                              onChange={(e) => {
                                setFpConfirmPassword(e.target.value);
                                clearFpError("confirmPassword");
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setFpShowConfirmPassword(!fpShowConfirmPassword)}
                              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
                            >
                              {fpShowConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                          {fpErrors.confirmPassword && <p className="text-destructive text-xs">{fpErrors.confirmPassword}</p>}
                        </div>
                        <Button
                          type="submit"
                          disabled={fpIsLoading}
                          className="bg-primary-linear shadow-primary mt-1 h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                        >
                          {fpIsLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Resetting…
                            </span>
                          ) : "Reset Password"}
                        </Button>
                      </form>
                    )}

                    {/* Step 4: Success */}
                    {fpStep === 4 && (
                      <div className="flex flex-col items-center gap-6 text-center">
                        <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
                          <Check size={40} className="text-primary" />
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">
                          You can now log in with your new password.
                        </p>
                        <Button
                          onClick={() => {
                            setModalMode("login");
                            resetForgotPassword();
                          }}
                          className="bg-primary-linear shadow-primary h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                        >
                          Go to Log In
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {modalMode === "login" && (
                  <>
                    {/* ── PATIENT / DOCTOR TABS ── */}
                    <div className="mb-6 flex rounded-xl bg-muted/40 p-1">
                      {(["patient", "doctor"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleLoginTypeChange(type)}
                          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all duration-200 ${
                            loginType === type
                              ? "bg-card text-primary shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {type === "patient" ? "Patient" : "Doctor"}
                        </button>
                      ))}
                    </div>

                    {loginMethod === "email" ? (
                      /* ── EMAIL / DOCTOR LOGIN ── */
                      <div className="w-full">
                        <h2 className="text-foreground mb-2.5 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
                          {loginType === "doctor" ? (
                            <>Doctor <span className="text-primary">Portal</span></>
                          ) : (
                            <>Welcome <span className="text-primary">back</span></>
                          )}
                        </h2>
                        <p className="text-muted-foreground mb-7 text-sm leading-relaxed font-medium">
                          {loginType === "doctor"
                            ? "Login with your registered email and password."
                            : "Login with your phone number and password."}
                        </p>

                        <form
                          onSubmit={handleEmailSubmit(onEmailSubmit)}
                          className="flex flex-col gap-4"
                        >
                          {/* Email (doctor) or Phone (patient) */}
                          <div className="flex flex-col gap-1.5">
                            {loginType === "doctor" ? (
                              <Controller
                                control={emailControl}
                                name="identifier"
                                render={({ field }) => (
                                  <div className="relative">
                                    <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
                                      <Mail size={17} />
                                    </div>
                                    <Input
                                      type="email"
                                      placeholder="Enter your email"
                                      className="border-border bg-muted/30 focus:border-primary h-12 rounded-xl pl-10 text-sm"
                                      {...field}
                                    />
                                  </div>
                                )}
                              />
                            ) : (
                              <Controller
                                control={emailControl}
                                name="identifier"
                                render={({ field }) => (
                                  <PhoneInput
                                    placeholder="Enter phone number"
                                    defaultCountry="BD"
                                    className="[&_input]:border-border [&_button]:border-border [&_input]:bg-muted/30 [&_button]:bg-muted/30 focus-within:border-primary focus-within:ring-primary/20 rounded-xl text-sm [&_button]:h-12 [&_button]:border [&_input]:h-12 [&_input]:border"
                                    {...field}
                                  />
                                )}
                              />
                            )}
                            {emailErrors.identifier && (
                              <p className="text-destructive text-xs">
                                {emailErrors.identifier.message}
                              </p>
                            )}
                          </div>

                          {/* Password */}
                          <div className="flex flex-col gap-1.5">
                            <div className="relative">
                              <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
                                <Lock size={17} />
                              </div>
                              <Controller
                                control={emailControl}
                                name="password"
                                render={({ field }) => (
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    className="border-border bg-muted/30 focus:border-primary focus:ring-primary/20 h-12 rounded-xl pr-10 pl-10 text-sm transition-all"
                                    {...field}
                                  />
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff size={17} />
                                ) : (
                                  <Eye size={17} />
                                )}
                              </button>
                            </div>
                            {emailErrors.password && (
                              <p className="text-destructive text-xs">
                                {emailErrors.password.message}
                              </p>
                            )}
                          </div>

                          {/* Remember + Forgot */}
                          <div className="flex items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-2 select-none">
                              <input
                                type="checkbox"
                                className="accent-primary h-4 w-4 cursor-pointer"
                              />
                              <span className="text-muted-foreground text-sm font-medium">
                                Remember me
                              </span>
                            </label>
                            {loginType === "patient" && (
                              <button
                                type="button"
                                onClick={() => {
                                  resetForgotPassword();
                                  setModalMode("forgot-password");
                                }}
                                className="text-primary hover:text-primary-dark text-sm font-semibold underline underline-offset-4 transition-colors duration-200"
                              >
                                Forgot Password?
                              </button>
                            )}
                          </div>

                          {/* Login CTA */}
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary-linear shadow-primary h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Signing in…
                              </span>
                            ) : (
                              "Login"
                            )}
                          </Button>
                        </form>

                        {loginType === "patient" && renderDividerAndSwitch("email")}
                      </div>
                    ) : step === "phone" ? (
                      /* ── PHONE STEP ── */
                      <div className="w-full">
                        <h2 className="text-foreground mb-2.5 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
                          Good health{" "}
                          <span className="text-primary">starts</span> here
                        </h2>
                        <p className="text-muted-foreground mb-7 text-sm leading-relaxed font-medium">
                          Enter the account credentials associated with your
                          profile.
                        </p>

                        <form
                          onSubmit={handlePhoneSubmit(onPhoneSubmit)}
                          className="flex flex-col gap-4"
                        >
                          {/* Phone Number */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-foreground text-body-sm font-semibold">
                              Phone Number
                            </label>
                            <Controller
                              control={phoneControl}
                              name="phone"
                              render={({ field }) => (
                                <PhoneInput
                                  placeholder="+8801XXXXXXXXX"
                                  defaultCountry="BD"
                                  className="[&_input]:border-border [&_button]:border-border [&_input]:bg-muted/30 [&_button]:bg-muted/30 focus-within:border-primary focus-within:ring-primary/10 rounded-xl text-sm transition-all focus-within:ring-2 [&_button]:h-12 [&_button]:border [&_input]:h-12 [&_input]:border"
                                  {...field}
                                />
                              )}
                            />
                            {phoneErrors.phone && (
                              <p className="text-destructive text-xs">
                                {phoneErrors.phone.message}
                              </p>
                            )}
                          </div>

                          {/* Remember + Forgot */}
                          <div className="flex items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-2 select-none">
                              <input
                                type="checkbox"
                                className="accent-primary h-4 w-4 cursor-pointer"
                              />
                              <span className="text-muted-foreground text-sm font-medium">
                                Remember me
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                resetForgotPassword();
                                setModalMode("forgot-password");
                              }}
                              className="text-primary hover:text-primary-dark text-sm font-semibold underline underline-offset-4 transition-colors duration-200"
                            >
                              Forgot Password?
                            </button>
                          </div>

                          {/* Send OTP CTA */}
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary-linear shadow-primary h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Sending OTP…
                              </span>
                            ) : (
                              "Send OTP"
                            )}
                          </Button>
                        </form>

                        {renderDividerAndSwitch("mobile")}
                      </div>
                    ) : (
                      /* ── OTP STEP ── */
                      <div className="flex w-full flex-col items-center">
                        {/* Back button */}
                        <button
                          type="button"
                          onClick={() => setStep("phone")}
                          className="text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1.5 self-start text-sm font-medium transition-colors"
                        >
                          <ArrowLeft size={16} />
                          Back
                        </button>

                        {/* Phone + Chat icon */}
                        <div className="relative mb-7">
                          <div className="bg-primary-light flex h-16 w-16 items-center justify-center rounded-2xl">
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 64 64"
                              fill="none"
                            >
                              <rect
                                x="10"
                                y="4"
                                width="38"
                                height="56"
                                rx="6"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                className="text-primary"
                              />
                              <line
                                x1="22"
                                y1="54"
                                x2="42"
                                y2="54"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="text-primary"
                              />
                              <line
                                x1="10"
                                y1="48"
                                x2="54"
                                y2="48"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="text-primary"
                              />
                              <line
                                x1="10"
                                y1="12"
                                x2="54"
                                y2="12"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="text-primary"
                              />
                            </svg>
                          </div>
                          <div className="bg-primary shadow-primary/20 absolute -top-2 -right-8 rounded-[10px_10px_10px_0] p-2.5 shadow-sm">
                            <div className="flex w-7 flex-col gap-1">
                              <div className="h-1 rounded-full bg-white" />
                              <div className="h-1 rounded-full bg-white" />
                              <div className="h-1 w-2/3 rounded-full bg-white" />
                            </div>
                          </div>
                        </div>

                        <h2 className="text-foreground mb-2 text-center text-3xl font-bold tracking-tight">
                          Mobile Verification
                        </h2>
                        <p className="text-muted-foreground mb-1 text-center text-sm">
                          Enter the 6-digit code sent to
                        </p>
                        <p className="text-foreground mb-7 text-center text-body font-semibold">
                          {phoneNumber}
                        </p>

                        <form
                          onSubmit={handleOtpSubmit(onOtpSubmit)}
                          className="flex w-full flex-col gap-5"
                        >
                          {/* OTP Input */}
                          <div className="flex justify-center">
                            <Controller
                              control={otpControl}
                              name="otp"
                              render={({ field }) => (
                                <InputOTP maxLength={6} {...field}>
                                  <InputOTPGroup className="w-full justify-center gap-2 rounded-none sm:gap-3">
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                      <InputOTPSlot
                                        key={i}
                                        index={i}
                                        className="border-border focus-visible:border-primary h-12 w-10 rounded-none border-0 border-b-[2.5px] bg-transparent px-0 text-center text-2xl font-bold shadow-none first:rounded-none first:border-l-0 last:rounded-none focus-visible:ring-0 sm:w-11"
                                      />
                                    ))}
                                  </InputOTPGroup>
                                </InputOTP>
                              )}
                            />
                          </div>
                          {otpErrors.otp && (
                            <p className="text-destructive -mt-3 text-center text-xs">
                              {otpErrors.otp.message}
                            </p>
                          )}

                          {/* Confirm Code CTA */}
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary-linear shadow-primary h-12 w-full rounded-xl border-none text-body font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Verifying…
                              </span>
                            ) : (
                              "Confirm Code"
                            )}
                          </Button>

                          {/* Resend */}
                          <button
                            type="button"
                            disabled={resendTimer > 0 || isLoading}
                            onClick={handleResendOTP}
                            className={`text-sm font-semibold transition-colors ${
                              resendTimer > 0 || isLoading
                                ? "text-muted-foreground cursor-not-allowed"
                                : "text-primary hover:text-primary-dark"
                            }`}
                          >
                            {resendTimer > 0
                              ? `Resend Code in ${resendTimer}s`
                              : "Re-Send Code"}
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
