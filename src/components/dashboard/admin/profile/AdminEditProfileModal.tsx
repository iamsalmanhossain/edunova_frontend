"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile, UpdateUserProfilePayload } from "@/types/user";
import { userService } from "@/services/user.service";

interface AdminEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdated: (updated: UserProfile) => void;
}

interface FormValues {
  name: string;
  phone: string;
}

export default function AdminEditProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdated,
}: AdminEditProfileModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: profile.name || "",
      phone: profile.phone || "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload: UpdateUserProfilePayload = {
        name: data.name.trim(),
        phone: data.phone.trim() || null,
      };

      const updated = await userService.updateProfile(payload);
      setSuccessMessage("Administrator profile updated successfully!");
      onUpdated(updated);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMessage(
        errorObj?.message || "Failed to update admin profile."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#dce3df] my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#f0f4f1] flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0f1f17]">
              Edit Administrator Profile
            </h2>
            <p className="text-xs text-[#5a6b62]">
              Update system administrator name and official correspondence phone
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 space-y-4">
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <Label htmlFor="admin_name" className="text-xs font-bold text-[#0f1f17]">
              Administrator Name *
            </Label>
            <Input
              id="admin_name"
              {...register("name", { required: "Name is required" })}
              className="mt-1 text-xs"
            />
            {errors.name && (
              <p className="text-[10px] text-red-600 mt-0.5">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="admin_phone" className="text-xs font-bold text-[#0f1f17]">
              Correspondence Phone
            </Label>
            <Input
              id="admin_phone"
              placeholder="+880 17xxxxxxxx"
              {...register("phone")}
              className="mt-1 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-[#f0f4f1] flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold px-4 py-2 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#c48b28]" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

