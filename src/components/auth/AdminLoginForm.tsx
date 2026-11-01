"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { LoginCredentials } from "@/types/auth";

export default function AdminLoginForm() {
  const router = useRouter();
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginCredentials) => {
    setServerError(null);
    setSuccess(null);

    try {
      const res = await authService.adminLogin({
        email: data.email.trim(),
        password: data.password,
      });

      if (res.success || res.data?.accessToken) {
        setSuccess("Administrator identity verified. Opening governance console...");
        setTimeout(() => {
          router.push("/dashboard/admin");
        }, 600);
      } else {
        setServerError(
          res.message || "Invalid administrative credentials or insufficient authorization."
        );
      }
    } catch (err: unknown) {
      let msg = "Administrative authentication failed. Ensure you have authorized role clearance.";
      if (err instanceof Error) {
        msg = err.message;
      }
      setServerError(msg);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Header Info */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[11px] font-bold uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Restricted Access Console</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#0f1f17] tracking-tight">
          Administrator Sign In
        </h2>
        <p className="text-xs text-[#5a6b62] max-w-xs mx-auto">
          High-security governance portal for Kishoreganj Polytechnic Institute administrators.
        </p>
      </div>

      {/* Custom Error Feedback Banner */}
      {serverError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">
            <span className="font-bold">Access Denied: </span>
            {serverError}
          </div>
        </div>
      )}

      {/* Custom Success Banner */}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {/* Login Form using React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="admin-email" className="text-xs font-semibold text-[#0f1f17]">
            Administrator Email *
          </Label>
          <div className="relative">
            <Input
              id="admin-email"
              type="email"
              placeholder="e.g. admin@edunova.com"
              disabled={isSubmitting}
              autoComplete="username"
              {...register("email", {
                required: "Administrator email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className={`h-10 pl-8.5 text-xs sm:text-sm bg-white ${
                errors.email ? "border-red-500 focus-visible:ring-red-400" : ""
              }`}
            />
            <Mail className="w-4 h-4 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="admin-password" className="text-xs font-semibold text-[#0f1f17]">
              Master Access Key *
            </Label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-[#0a4b32] hover:underline"
            >
              Reset Key?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter master password"
              disabled={isSubmitting}
              autoComplete="current-password"
              {...register("password", {
                required: "Master access key is required",
                minLength: {
                  value: 6,
                  message: "Access key must be at least 6 characters",
                },
              })}
              className={`h-10 pl-8.5 pr-8.5 text-xs sm:text-sm bg-white ${
                errors.password ? "border-red-500 focus-visible:ring-red-400" : ""
              }`}
            />
            <Lock className="w-4 h-4 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6b62] hover:text-[#0f1f17] p-0.5 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 bg-[#0a4b32] hover:bg-[#073825] text-white font-bold text-xs sm:text-sm shadow-sm mt-3 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#c48b28]" />
              <span>Verifying Administrative Clearance...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c48b28]" />
              <span>Sign In as Administrator</span>
            </span>
          )}
        </Button>
      </form>

      {/* Switch Back to Student / Teacher Login */}
      <div className="pt-3 border-t border-[#e2e8e4] text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5a6b62] hover:text-[#0a4b32] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Switch to Student & Faculty Portal Login</span>
        </Link>
      </div>
    </div>
  );
}
