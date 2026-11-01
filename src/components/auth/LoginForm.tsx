"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { LoginCredentials } from "@/types/auth";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isUnverified, setIsUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
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
    setIsUnverified(false);
    setSuccess(null);

    try {
      const res = await authService.login({
        email: data.email.trim(),
        password: data.password,
      });

      if (res.success || res.data?.accessToken) {
        const userRole = res.data?.user?.role;
        const targetPath = authService.getRoleDashboardPath(userRole);
        setSuccess(`Authentication successful! Redirecting to ${userRole || "User"} Portal...`);
        setTimeout(() => {
          router.push(targetPath);
        }, 600);
      } else {
        setServerError(res.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err: unknown) {
      let msg = "Unable to authenticate. Please check your credentials or network connection.";
      if (err instanceof Error) {
        msg = err.message;
      }

      if (msg.toLowerCase().includes("verified") || msg.toLowerCase().includes("verification")) {
        setIsUnverified(true);
        setUnverifiedEmail(data.email.trim());
      }

      setServerError(msg);
    }
  };

  return (
    <div className="space-y-4 no-scrollbar">
      {/* Custom Error Feedback Banner */}
      {serverError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex flex-col gap-2 animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{serverError}</div>
          </div>
          {isUnverified && (
            <div className="pt-2 border-t border-red-200/60 flex items-center justify-between">
              <span className="text-[11px] text-red-800">Need to enter verification code?</span>
              <Link
                href={`/verify-email?email=${encodeURIComponent(unverifiedEmail || "")}`}
                className="text-[11px] font-bold text-[#0a4b32] bg-white px-2.5 py-1 rounded-md border border-[#0a4b32]/30 hover:bg-[#0a4b32] hover:text-white transition-all inline-flex items-center gap-1 shadow-2xs"
              >
                <span>Verify OTP Now</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Custom Success Banner */}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {/* Login Form Fields using React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        {/* Email Input */}
        <div className="space-y-1">
          <Label
            htmlFor="login-email"
            className="text-xs font-semibold text-[#0f1f17]"
          >
            Institutional Email Address *
          </Label>
          <div className="relative">
            <Input
              id="login-email"
              type="email"
              placeholder="e.g. user@edunova.ac.bd"
              disabled={isSubmitting}
              autoComplete="username"
              {...register("email", {
                required: "Institutional email address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid institutional email address",
                },
              })}
              className={`h-10 pl-8.5 text-xs sm:text-sm bg-white ${
                /* email error check */ errors.email ? "border-red-500 focus-visible:ring-red-400" : ""
              }`}
            />
            <Mail className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="login-password"
              className="text-xs font-semibold text-[#0f1f17]"
            >
              Password *
            </Label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-[#0a4b32] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your account password"
              disabled={isSubmitting}
              autoComplete="current-password"
              {...register("password", {
                required: "Account password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`h-10 pl-8.5 pr-8.5 text-xs sm:text-sm bg-white ${
                errors.password ? "border-red-500 focus-visible:ring-red-400" : ""
              }`}
            />
            <Lock className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6b62] hover:text-[#0f1f17] p-0.5 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
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
          className="w-full h-10 bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold text-xs shadow-xs mt-3 cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c48b28]" />
              <span>Authenticating Credentials...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Digital Campus</span>
            </span>
          )}
        </Button>

        {/* Registration Link */}
        <div className="pt-3 text-center border-t border-[#e2e8e4]/80 flex flex-col items-center gap-2">
          <p className="text-[11px] text-[#5a6b62]">
            Don&apos;t have an institutional account yet?{" "}
            {onSwitchToRegister ? (
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-bold text-[#0a4b32] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Register Student or Teacher</span>
              </button>
            ) : (
              <Link
                href="/register"
                className="font-bold text-[#0a4b32] hover:underline"
              >
                Register Student or Teacher
              </Link>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}
