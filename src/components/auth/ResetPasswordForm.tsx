"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth.service";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password Strength Calculation
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (!password) return { text: "None", color: "bg-gray-200", textColor: "text-gray-400" };
    if (strength <= 1) return { text: "Weak", color: "bg-red-500", textColor: "text-red-600" };
    if (strength === 2 || strength === 3)
      return { text: "Medium", color: "bg-[#c48b28]", textColor: "text-[#c48b28]" };
    return { text: "Strong", color: "bg-[#0a4b32]", textColor: "text-[#0a4b32]" };
  }, [password, strength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword({
        token,
        password,
      });

      setSuccess(
        res.message ||
          "Your password has been successfully updated. Redirecting to sign in..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Unable to reset password. The link may have expired.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Success Notification */}
      {success && (
        <Alert className="mb-4 bg-[#f0f7f4] border-[#0a4b32]/30 text-[#0a4b32] py-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#0a4b32] shrink-0" />
          <AlertDescription className="text-xs ml-2 font-medium">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Notification */}
      {error && (
        <Alert className="mb-4 bg-red-50 border-red-200 text-red-800 py-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <AlertDescription className="text-xs ml-2 font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* New Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-semibold text-[#0f1f17]"
          >
            New Secure Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#5a6b62] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new strong password"
              className="pl-9 pr-9 h-10 border-[#dce3df] focus-visible:ring-[#0a4b32] text-xs text-[#0f1f17]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6b62] hover:text-[#0f1f17]"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Password Strength Meter */}
          {password && (
            <div className="pt-1 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#5a6b62]">Security Rating</span>
                <span className={`font-bold ${strengthLabel.textColor}`}>
                  {strengthLabel.text}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#e2e8e4] rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-300 ${strengthLabel.color}`}
                  style={{ width: `${Math.min(100, (strength / 4) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-xs font-semibold text-[#0f1f17]"
          >
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#5a6b62] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="pl-9 pr-9 h-10 border-[#dce3df] focus-visible:ring-[#0a4b32] text-xs text-[#0f1f17]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a6b62] hover:text-[#0f1f17]"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Checklist */}
        <div className="p-2.5 rounded-lg bg-[#f0f4f1]/80 border border-[#dce3df]/70 text-[11px] text-[#5a6b62] space-y-1">
          <div className="flex items-center gap-1.5">
            {password.length >= 8 ? (
              <Check className="w-3 h-3 text-[#0a4b32]" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
            <span>At least 8 characters long</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/[A-Z]/.test(password) ? (
              <Check className="w-3 h-3 text-[#0a4b32]" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
            <span>Contains uppercase letter</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/[0-9!@#$%^&*]/.test(password) ? (
              <Check className="w-3 h-3 text-[#0a4b32]" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
            <span>Contains number or special character</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold text-xs transition-colors shadow-xs"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating Password...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Update Password</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          )}
        </Button>

        {/* Back Link */}
        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="text-xs font-semibold text-[#0a4b32] hover:underline"
          >
            Cancel and Return to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#0a4b32]" />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}

