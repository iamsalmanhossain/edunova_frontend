"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MailCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth.service";

function VerifyEmailFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const email = emailParam || "student@edunova.ac.bd";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 2 Minutes (120 seconds) OTP Validity Countdown
  const [countdown, setCountdown] = useState(120);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Format mm:ss (e.g. 2:00, 1:45, 0:08)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const cleanDigits = pastedData.replace(/\D/g, "").slice(0, 6);
    if (!cleanDigits) return;

    const newDigits = [...digits];
    const chars = cleanDigits.split("");
    chars.forEach((c, i) => {
      if (i < 6) newDigits[i] = c;
    });
    setDigits(newDigits);

    // Auto focus the last filled input or submit if full
    const nextIndex = Math.min(chars.length - 1, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric
    const clean = val.replace(/\D/g, "");
    if (clean.length > 1) {
      // User pasted into input directly
      const chars = clean.slice(0, 6).split("");
      const newDigits = [...digits];
      chars.forEach((c, i) => {
        if (i < 6) newDigits[i] = c;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(chars.length - 1, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);

    // Auto advance focus
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await authService.resendVerification(email);
      setSuccess(res.message || "A fresh 6-digit verification code has been dispatched.");
      setCountdown(120); // Reset timer to 2 minutes
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Unable to dispatch verification code.";
      setError(errorMsg);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyEmail({ email, code });
      setSuccess(
        res.message ||
          "Email successfully verified! Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Invalid or expired verification code.";
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address Notification Banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#f0f7f4] border border-[#0a4b32]/20 text-xs">
          <div className="w-8 h-8 rounded-full bg-[#0a4b32]/10 text-[#0a4b32] flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-[#5a6b62]">Verification PIN dispatched to:</p>
            <p className="font-bold text-xs text-[#0a4b32] truncate">{email}</p>
          </div>
        </div>

        {/* 6-Digit Code Inputs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-[#0f1f17]">
              Enter 6-Digit Security PIN
            </Label>
            <span className="text-[11px] text-[#5a6b62] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#c48b28]" />
              <span>Valid for 2 minutes</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-bold rounded-lg border border-[#dce3df] focus:border-[#0a4b32] focus:ring-2 focus:ring-[#0a4b32]/20 outline-none transition-all text-[#0f1f17] bg-white shadow-xs"
              />
            ))}
          </div>
        </div>

        {/* Resend Code Action (Active after 2 minutes) */}
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            disabled={countdown > 0 || resending}
            onClick={handleResend}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              countdown > 0
                ? "text-[#5a6b62]/70 cursor-not-allowed"
                : "text-[#0a4b32] hover:text-[#073825] hover:underline cursor-pointer"
            }`}
          >
            {resending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>
              {countdown > 0
                ? `Resend code in ${formatTime(countdown)}`
                : "Resend Code"}
            </span>
          </button>
        </div>

        {/* Verify Button */}
        <Button
          type="submit"
          disabled={loading || digits.join("").length !== 6}
          className="w-full h-10 bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold text-xs transition-colors shadow-xs"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying Code...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <MailCheck className="w-3.5 h-3.5" />
              <span>Confirm &amp; Activate Account</span>
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
            Return to Portal Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function VerifyEmailForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#0a4b32]" />
        </div>
      }
    >
      <VerifyEmailFormContent />
    </Suspense>
  );
}
