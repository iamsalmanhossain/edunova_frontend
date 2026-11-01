"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Please enter your registered institutional email.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword({ email });
      setSuccess(
        res.message ||
          "Password reset link and security instructions have been dispatched to your email address."
      );
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Unable to process password reset request. Please try again.";
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
        {/* Email Address */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-[#0f1f17]">
            Institutional Email Address
          </Label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#5a6b62] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. womipi2481@37xiao.com"
              className="pl-9 h-10 border-[#dce3df] focus-visible:ring-[#0a4b32] text-xs text-[#0f1f17]"
              required
            />
          </div>
          <p className="text-[11px] text-[#5a6b62]">
            Enter the email address registered with your Kishoreganj Polytechnic student or teacher profile.
          </p>
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
              <span>Sending Reset Instructions...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Send Recovery Instructions</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          )}
        </Button>

        {/* Navigation Links */}
        <div className="pt-2 flex flex-col items-center gap-1.5 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0a4b32] hover:underline"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Portal Sign In</span>
          </Link>
          <p className="text-[11px] text-[#5a6b62]">
            Need to register first?{" "}
            <Link
              href="/register"
              className="font-bold text-[#c48b28] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

