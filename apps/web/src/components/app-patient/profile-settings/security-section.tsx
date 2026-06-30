"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/queries/use-customer";
import {
  LockPasswordIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

export function SecuritySection() {
  const changePassword = useChangePassword();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirmation don't match");
      return;
    }
    changePassword.mutate(
      {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      },
      {
        onSuccess: () => {
          setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        },
      },
    );
  };

  return (
    <Card className="border-border/50 rounded-md border shadow-xs">
      <CardHeader className="border-border/40 border-b px-6 py-5 sm:px-8">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <HugeiconsIcon
            icon={LockPasswordIcon}
            size={18}
            className="text-primary"
          />
          Change Password
        </CardTitle>
        <p className="text-muted-foreground text-xs font-medium">
          Update your password regularly to keep your account secure.
        </p>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordField
            id="current"
            label="Current Password"
            value={form.currentPassword}
            onChange={(v) => handleChange("currentPassword", v)}
            visible={show.current}
            onToggleVisible={() =>
              setShow((p) => ({ ...p, current: !p.current }))
            }
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <PasswordField
              id="next"
              label="New Password"
              value={form.newPassword}
              onChange={(v) => handleChange("newPassword", v)}
              visible={show.next}
              onToggleVisible={() => setShow((p) => ({ ...p, next: !p.next }))}
              hint="At least 6 characters"
            />

            <PasswordField
              id="confirm"
              label="Confirm New Password"
              value={form.confirmPassword}
              onChange={(v) => handleChange("confirmPassword", v)}
              visible={show.confirm}
              onToggleVisible={() =>
                setShow((p) => ({ ...p, confirm: !p.confirm }))
              }
            />
          </div>

          <div className="border-border/40 flex justify-end gap-3 border-t pt-6">
            <Button
              type="submit"
              disabled={
                changePassword.isPending ||
                !form.currentPassword ||
                !form.newPassword ||
                !form.confirmPassword
              }
              className="h-11 rounded-xl px-8 text-sm font-semibold"
            >
              {changePassword.isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggleVisible,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-foreground text-xs font-semibold">
          {label}
        </Label>
        {hint && (
          <span className="text-muted-foreground text-micro font-medium">
            {hint}
          </span>
        )}
      </div>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 rounded-xl pr-11 font-medium"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <HugeiconsIcon icon={visible ? ViewOffSlashIcon : ViewIcon} size={16} />
        </button>
      </div>
    </div>
  );
}
