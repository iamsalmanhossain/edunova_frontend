"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth.service";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Quick fill demo credentials
  const fillTeacherCredentials = () => {
    setEmail("jitoya7966@agaexpress.com");
    setPassword("SecurePass123!@#");
    setError(null);
  };

  const fillStudentCredentials = () => {
    setEmail("womipi2481@37xiao.com");
    setPassword("SecurePass123!@#");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError("Please provide both your registered email address and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login({ email: email.trim(), password });
      if (res.success || res.data?.accessToken) {
        setSuccess("Authentication successful! Loading digital campus...");
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setError(res.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err: unknown) {
      let msg = "Unable to authenticate. Please check your credentials or network connection.";
      if (err && typeof err === "object" && "response" in err) {
        const responseData = (err as {
          response?: { data?: { message?: string | string[] } };
        }).response?.data;
        if (responseData?.message) {
          msg = Array.isArray(responseData.message)
            ? responseData.message.join(", ")
            : responseData.message;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3.5 no-scrollbar">
      {/* Quick Demo Credential Bar */}
      <div className="bg-[#f0f7f3] border border-[#dce3df] rounded-lg p-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0a4b32]">
          <Sparkles className="w-3.5 h-3.5 text-[#c48b28]" />
          <span className="hidden sm:inline">Autofill Test Account:</span>
          <span className="sm:hidden">Autofill:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={fillStudentCredentials}
            className="px-2 py-0.5 text-[11px] font-medium rounded bg-white border border-[#dce3df] text-[#0a4b32] hover:bg-[#0a4b32] hover:text-white transition-all shadow-xs flex items-center gap-1"
          >
            <GraduationCap className="w-3 h-3" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={fillTeacherCredentials}
            className="px-2 py-0.5 text-[11px] font-medium rounded bg-white border border-[#dce3df] text-[#0a4b32] hover:bg-[#0a4b32] hover:text-white transition-all shadow-xs flex items-center gap-1"
          >
            <Briefcase className="w-3 h-3" />
            <span>Teacher</span>
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2 text-xs">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <AlertDescription className="text-xs font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="py-2 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <AlertDescription className="text-xs font-medium">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email Input */}
        <div className="space-y-1">
          <Label htmlFor="login-email" className="text-xs font-semibold text-[#0f1f17]">
            Institutional Email Address *
          </Label>
          <div className="relative">
            <Input
              id="login-email"
              type="email"
              placeholder="e.g. user@edunova.ac.bd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
              className="h-9.5 pl-8 text-xs sm:text-sm bg-white"
            />
            <Mail className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <Label
            htmlFor="login-password"
            className="text-xs font-semibold text-[#0f1f17]"
          >
            Password *
          </Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
              className="h-9.5 pl-8 pr-8 text-xs sm:text-sm bg-white"
            />
            <Lock className="w-3.5 h-3.5 text-[#5a6b62] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a6b62] hover:text-[#0f1f17] p-0.5"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-9.5 bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold text-xs shadow-xs mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Authenticating...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Digital Campus</span>
            </span>
          )}
        </Button>

        {/* Registration Link */}
        <div className="pt-2 text-center border-t border-[#e2e8e4]/70">
          <p className="text-[11px] text-[#5a6b62]">
            Don&apos;t have an institutional account yet?{" "}
            <Link
              href="/register"
              className="font-bold text-[#0a4b32] hover:underline"
            >
              Register Student or Teacher
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
