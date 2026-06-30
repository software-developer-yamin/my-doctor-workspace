"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePrescription, useCreatePrescription, useUpdatePrescription } from "@/hooks/queries/use-doctor-dashboard";
import { useMyAppointments } from "@/hooks/queries/use-doctor-dashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Medicine, Attachment } from "@/types/prescription.type";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AddCircleIcon, Delete02Icon, ArrowLeft01Icon, Upload01Icon, Cancel01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

const EMPTY_MEDICINE: Medicine = { name: "", dosage: "", frequency: "", duration: "", notes: "" };

interface MedicineRowErrors {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

interface FormErrors {
  diagnosis?: string;
  medicines?: string;
  medicineRows?: MedicineRowErrors[];
  attachments?: string;
}

export default function PrescriptionWriterPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: prescriptionRes, isLoading: loadingRx } = usePrescription(appointmentId);
  const existing = prescriptionRes?.data;

  const { data: apptData } = useMyAppointments(user?.id ?? "", {});
  const appointment = (apptData?.data ?? []).find((a: any) => a._id === appointmentId);

  if (loadingRx) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        {[1, 2, 3].map((i) => <div key={i} className="bg-card border h-16 animate-pulse rounded-xl" />)}
      </div>
    );
  }

  return (
    <PrescriptionForm
      key={existing?._id ?? "new"}
      existing={existing}
      appointment={appointment}
      appointmentId={appointmentId}
    />
  );
}

interface PrescriptionFormProps {
  existing: any;
  appointment: any;
  appointmentId: string;
}

function PrescriptionForm({ existing, appointment, appointmentId }: PrescriptionFormProps) {
  const router = useRouter();
  const createRx = useCreatePrescription();
  const updateRx = useUpdatePrescription();

  const [form, setForm] = useState({
    diagnosis: existing?.diagnosis ?? "",
    medicines: (existing?.medicines?.length ? existing.medicines : [{ ...EMPTY_MEDICINE }]) as Medicine[],
    instructions: existing?.instructions ?? "",
    followUpDate: existing?.followUpDate ? existing.followUpDate.split("T")[0] : "",
    existingAttachments: (existing?.attachments ?? []) as Attachment[],
  });
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const diagnosisRef = useRef<HTMLTextAreaElement>(null);
  const medicinesRef = useRef<HTMLDivElement>(null);
  const attachmentsRef = useRef<HTMLDivElement>(null);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    if (!form.diagnosis.trim()) {
      errs.diagnosis = "Diagnosis is required.";
    }

    const hasAnyName = form.medicines.some((m) => m.name.trim());
    if (!hasAnyName) {
      errs.medicines = "At least one medicine is required.";
    }

    const rowErrs: MedicineRowErrors[] = form.medicines.map((m) => {
      const row: MedicineRowErrors = {};
      if (!m.name.trim()) row.name = "Required";
      if (!m.dosage.trim()) row.dosage = "Required";
      if (!m.frequency.trim()) row.frequency = "Required";
      if (!m.duration.trim()) row.duration = "Required";
      return row;
    });
    if (rowErrs.some((r) => Object.keys(r).length > 0)) {
      errs.medicineRows = rowErrs;
    }

    if (form.existingAttachments.length === 0 && newFiles.length === 0) {
      errs.attachments = "At least one attachment is required.";
    }

    return errs;
  };

  const updateMedicine = (idx: number, field: keyof Medicine, value: string) => {
    setForm((prev) => ({ ...prev, medicines: prev.medicines.map((m, i) => (i === idx ? { ...m, [field]: value } : m)) }));
    if (field === "name") {
      setErrors((prev) => ({ ...prev, medicines: undefined }));
    }
    setErrors((prev) => {
      if (!prev.medicineRows) return prev;
      const rows = [...prev.medicineRows];
      if (rows[idx]) rows[idx] = { ...rows[idx], [field]: undefined };
      return { ...prev, medicineRows: rows };
    });
  };

  const addMedicine = () => {
    setForm((prev) => ({ ...prev, medicines: [...prev.medicines, { ...EMPTY_MEDICINE }] }));
    setErrors((prev) => ({ ...prev, medicines: undefined }));
  };

  const removeMedicine = (idx: number) => {
    setForm((prev) => ({ ...prev, medicines: prev.medicines.length > 1 ? prev.medicines.filter((_, i) => i !== idx) : prev.medicines }));
    setErrors((prev) => {
      const rows = prev.medicineRows?.filter((_, i) => i !== idx);
      return { ...prev, medicineRows: rows };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length > 0) {
      setNewFiles((prev) => [...prev, ...selected]);
      setErrors((prev) => ({ ...prev, attachments: undefined }));
    }
    e.target.value = "";
  };

  const removeExistingAttachment = (idx: number) =>
    setForm((prev) => ({ ...prev, existingAttachments: prev.existingAttachments.filter((_, i) => i !== idx) }));

  const removeNewFile = (idx: number) =>
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.diagnosis) {
        diagnosisRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (errs.medicines || errs.medicineRows) {
        medicinesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (errs.attachments) {
        attachmentsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const validMeds = form.medicines.filter((m) => m.name.trim());

    try {
      const formData = new FormData();
      formData.append("appointment", appointmentId);
      if (appointment?.customer?._id) formData.append("patient", appointment.customer._id);
      if (form.diagnosis) formData.append("diagnosis", form.diagnosis);
      if (form.instructions) formData.append("instructions", form.instructions);
      if (form.followUpDate) formData.append("followUpDate", form.followUpDate);
      formData.append("medicines", JSON.stringify(validMeds));
      formData.append("existingAttachments", JSON.stringify(form.existingAttachments));
      newFiles.forEach((f) => formData.append("attachments", f));

      if (existing) {
        await updateRx.mutateAsync({ id: existing._id, payload: formData as any });
        toast.success("Prescription updated.");
      } else {
        await createRx.mutateAsync(formData as any);
        toast.success("Prescription saved.");
      }
      router.push("/doctor/bookings");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save prescription.");
    }
  };

  const isSaving = createRx.isPending || updateRx.isPending;
  const totalAttachments = form.existingAttachments.length + newFiles.length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {existing ? "Edit Prescription" : "Write Prescription"}
          </h1>
          {appointment && (
            <p className="text-muted-foreground mt-1 text-sm">
              {appointment.customer?.name} · {format(new Date(appointment.appointmentDate), "dd MMM yyyy")} · {appointment.hospital?.name}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Patient Info (read-only) */}
        {appointment && (
          <div className="bg-muted/30 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {[
              { label: "Patient", value: appointment.customer?.name },
              { label: "Phone", value: appointment.customer?.phone },
              { label: "Visit Type", value: appointment.appointmentType },
              { label: "Consultation", value: appointment.consultationType },
              { label: "Serial", value: `#${appointment.serialNo ?? "—"}` },
              { label: "Date", value: format(new Date(appointment.appointmentDate), "dd MMM yyyy") },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-muted-foreground text-xs font-medium">{label}</p>
                <p className="text-foreground font-semibold">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Diagnosis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">
              Diagnosis <span className="text-destructive">*</span>
            </Label>
            {errors.diagnosis && (
              <p className="text-xs text-destructive font-medium">{errors.diagnosis}</p>
            )}
          </div>
          <Textarea
            ref={diagnosisRef}
            placeholder="Enter diagnosis..."
            className={cn("min-h-20 resize-none", errors.diagnosis && "border-destructive! ring-2! ring-destructive/30!")}
            value={form.diagnosis}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, diagnosis: e.target.value }));
              if (e.target.value.trim()) setErrors((prev) => ({ ...prev, diagnosis: undefined }));
            }}
            aria-invalid={!!errors.diagnosis}
          />
        </div>

        {/* Medicines */}
        <div className="space-y-3" ref={medicinesRef}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-semibold">Medicines <span className="text-destructive">*</span></Label>
              {errors.medicines && (
                <p className="text-xs text-destructive font-medium">{errors.medicines}</p>
              )}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addMedicine} className="h-8 gap-1.5 text-xs">
              <HugeiconsIcon icon={AddCircleIcon} className="h-3.5 w-3.5" />
              Add Medicine
            </Button>
          </div>
          {form.medicines.map((med, idx) => {
            const rowErr = errors.medicineRows?.[idx];
            return (
              <div key={idx} className="bg-card border-border rounded-xl border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-muted-foreground">Medicine {idx + 1}</p>
                  {form.medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(idx)}
                      className="text-destructive/70 hover:text-destructive transition-colors"
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">Name *</Label>
                    <Input
                      placeholder="e.g. Paracetamol 500mg"
                      value={med.name}
                      onChange={(e) => updateMedicine(idx, "name", e.target.value)}
                      className={cn(rowErr?.name && "border-destructive! ring-2! ring-destructive/30!")}
                      aria-invalid={!!rowErr?.name}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-muted-foreground">Dosage *</Label>
                      {rowErr?.dosage && <p className="text-micro text-destructive font-medium">{rowErr.dosage}</p>}
                    </div>
                    <Input
                      placeholder="e.g. 1 tablet"
                      value={med.dosage}
                      onChange={(e) => updateMedicine(idx, "dosage", e.target.value)}
                      className={cn(rowErr?.dosage && "border-destructive! ring-2! ring-destructive/30!")}
                      aria-invalid={!!rowErr?.dosage}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-muted-foreground">Frequency *</Label>
                      {rowErr?.frequency && <p className="text-micro text-destructive font-medium">{rowErr.frequency}</p>}
                    </div>
                    <Input
                      placeholder="e.g. 3 times daily"
                      value={med.frequency}
                      onChange={(e) => updateMedicine(idx, "frequency", e.target.value)}
                      className={cn(rowErr?.frequency && "border-destructive! ring-2! ring-destructive/30!")}
                      aria-invalid={!!rowErr?.frequency}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-muted-foreground">Duration *</Label>
                      {rowErr?.duration && <p className="text-micro text-destructive font-medium">{rowErr.duration}</p>}
                    </div>
                    <Input
                      placeholder="e.g. 5 days"
                      value={med.duration}
                      onChange={(e) => updateMedicine(idx, "duration", e.target.value)}
                      className={cn(rowErr?.duration && "border-destructive! ring-2! ring-destructive/30!")}
                      aria-invalid={!!rowErr?.duration}
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Notes</Label>
                    <Input
                      placeholder="e.g. Take after meals"
                      value={med.notes ?? ""}
                      onChange={(e) => updateMedicine(idx, "notes", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">General Instructions</Label>
          <Textarea
            placeholder="e.g. Rest for 3 days, drink plenty of fluids..."
            className="min-h-20 resize-none"
            value={form.instructions}
            onChange={(e) => setForm((prev) => ({ ...prev, instructions: e.target.value }))}
          />
        </div>

        {/* Media Attachments */}
        <div className="space-y-3" ref={attachmentsRef}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-semibold">
                Attachments <span className="text-destructive">*</span>
              </Label>
              {totalAttachments > 0 && (
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                  {totalAttachments}
                </span>
              )}
              {errors.attachments && (
                <p className="text-xs text-destructive font-medium">{errors.attachments}</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 gap-1.5 text-xs"
            >
              <HugeiconsIcon icon={Upload01Icon} className="h-3.5 w-3.5" />
              Add Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {totalAttachments === 0 && (
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                errors.attachments
                  ? "border-destructive hover:border-destructive/70"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => { fileInputRef.current?.click(); setErrors((prev) => ({ ...prev, attachments: undefined })); }}
            >
              <HugeiconsIcon icon={Upload01Icon} className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload images or PDFs</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Up to 10 files</p>
            </div>
          )}

          {totalAttachments > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.existingAttachments.map((att, idx) => (
                <AttachmentCard
                  key={`existing-${idx}`}
                  name={att.name}
                  type={att.type}
                  previewUrl={getImageUrl(att.url)}
                  onRemove={() => removeExistingAttachment(idx)}
                />
              ))}
              {newFiles.map((file, idx) => (
                <AttachmentCard
                  key={`new-${idx}`}
                  name={file.name}
                  type={file.type}
                  previewUrl={file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined}
                  onRemove={() => removeNewFile(idx)}
                  isNew
                />
              ))}
            </div>
          )}
        </div>

        {/* Follow-up Date */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Follow-up Date (optional)</Label>
          <Input
            type="date"
            value={form.followUpDate}
            onChange={(e) => setForm((prev) => ({ ...prev, followUpDate: e.target.value }))}
            className="max-w-50"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 font-bold"
          >
            {isSaving ? "Saving..." : existing ? "Update Prescription" : "Save Prescription"}
          </Button>
          <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AttachmentCardProps {
  name: string;
  type: string;
  previewUrl?: string;
  onRemove: () => void;
  isNew?: boolean;
}

function AttachmentCard({ name, type, previewUrl, onRemove, isNew }: AttachmentCardProps) {
  const isImage = type.startsWith("image/");

  return (
    <div className="relative group bg-card border border-border rounded-xl overflow-hidden">
      {isImage && previewUrl ? (
        <img
          src={previewUrl}
          alt={name}
          className="w-full h-24 object-cover"
        />
      ) : (
        <div className="w-full h-24 flex flex-col items-center justify-center bg-muted/30 gap-1">
          <HugeiconsIcon icon={File01Icon} className="h-8 w-8 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium uppercase">
            {name.split(".").pop()}
          </span>
        </div>
      )}
      <div className="p-2">
        <p className="text-xs text-foreground font-medium truncate">{name}</p>
        {isNew && (
          <span className="text-micro text-primary font-semibold">New</span>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 bg-background/80 backdrop-blur-sm rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
      >
        <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
