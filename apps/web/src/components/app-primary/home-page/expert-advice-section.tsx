"use client";

import { EXPERT_ADVICE_DATA } from "@/data/expert-advice.data";
import { PhoneInput } from "@/components/ui/phone-input";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export const ExpertAdviceSection = ({ className }: { className?: string }) => {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Please enter your name.";
    if (!form.phone || form.phone.replace(/\D/g, "").length < 7)
      newErrors.phone = "Please enter a valid phone number.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/callback-requests", {
        name: form.name.trim(),
        phone: form.phone,
      });
      if (data?.success) {
        toast.success("We'll call you back shortly!");
        setForm({ name: "", phone: "" });
      } else {
        throw new Error(data?.message || "Failed");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cn("mb-12", className)}>
      <div className="container">
        <div className="bg-muted/30 border-border/50 relative overflow-hidden rounded-xl border shadow-sm">
          {/* Background Decorative Glow */}
          <div className="bg-primary/5 absolute top-0 right-0 -z-0 h-64 w-64 blur-[100px]" />

          <div className="relative z-10 flex flex-col gap-12 px-4 py-12 md:flex-row md:px-16 md:py-20 lg:gap-20">
            {/* Left Column: Information */}
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="border-primary text-primary border-l-2 pl-2 text-xs font-bold tracking-wider uppercase">
                    Consultation
                  </span>
                </div>
                <h2 className="text-foreground text-2xl leading-tight font-bold sm:text-3xl lg:text-3xl">
                  {EXPERT_ADVICE_DATA.title}
                </h2>
                <p className="text-muted-foreground text-base font-medium lg:text-lg">
                  {EXPERT_ADVICE_DATA.subtitle}
                </p>
              </div>

              <div className="pt-4">
                <h6 className="border-primary text-foreground border-l-4 py-2 pl-6 text-base leading-relaxed font-bold lg:text-lg">
                  {EXPERT_ADVICE_DATA.contactInfo}
                </h6>
              </div>
            </div>

            {/* Right Column: Callback Form */}
            <div className="max-w-xl flex-1">
              <h6 className="text-muted-foreground mb-8 text-sm leading-relaxed font-semibold lg:text-base">
                {EXPERT_ADVICE_DATA.formLabel}
              </h6>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Name Input */}
                <div className="space-y-1">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, name: e.target.value }));
                      setErrors((p) => ({ ...p, name: undefined }));
                    }}
                    placeholder={EXPERT_ADVICE_DATA.placeholders.name}
                    className={`bg-background text-foreground focus:border-primary placeholder:text-muted-foreground/50 w-full rounded-xl border px-4 py-4 text-xs transition-all outline-none md:px-6 md:text-sm ${errors.name ? "border-destructive" : "border-border"}`}
                  />
                  {errors.name && <p className="text-destructive text-xs font-medium">{errors.name}</p>}
                </div>

                {/* Phone Input with Prefix */}
                <div className="space-y-1">
                  <PhoneInput
                    value={form.phone}
                    onChange={(val) => {
                      setForm((p) => ({ ...p, phone: val as string || "" }));
                      setErrors((p) => ({ ...p, phone: undefined }));
                    }}
                    placeholder={EXPERT_ADVICE_DATA.placeholders.phone}
                    className={`[&_input]:h-14 [&_button]:h-14 ${errors.phone ? "[&_input]:border-destructive" : ""}`}
                  />
                  {errors.phone && <p className="text-destructive text-xs font-medium">{errors.phone}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary flex h-10 w-full items-center justify-center rounded-xl px-8 text-base font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    EXPERT_ADVICE_DATA.buttonText
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
