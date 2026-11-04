import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Loader2 } from "lucide-react";
import AuthVisualPanel from "@/components/auth/AuthVisualPanel";
import ClaimAccountForm from "@/components/auth/ClaimAccountForm";

export const metadata: Metadata = {
  title: "Claim Student Account",
  description:
    "Claim and activate your pre-enrolled student account, connect attendance, and preserve exam marks.",
};

export default function ClaimAccountPage() {
  return (
    <div className="h-screen max-h-screen w-full flex flex-col lg:flex-row bg-[#fcfdfc] overflow-hidden no-scrollbar">
      {/* Desktop Visual Panel: Hidden on mobile */}
      <div className="hidden lg:flex w-5/12 xl:w-5/12 h-full shrink-0">
        <AuthVisualPanel
          mode="register"
          headline="Claim Your Pre-Enrolled Student Profile & Preserve All Records"
          subheadline="If your class teacher already entered your roll number for attendance or exams, activate your account here to link your email, retain marks, and start learning immediately."
        />
      </div>

      {/* Form Container: Zero-Scroll Compact Layout */}
      <div className="w-full lg:w-7/12 xl:w-7/12 h-full flex flex-col justify-between p-3 sm:p-5 lg:p-6 overflow-hidden">
        {/* Top Header / Brand Nav */}
        <div className="flex items-center justify-between shrink-0 pb-2 sm:pb-3 border-b border-[#e2e8e4]/60">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5a6b62] hover:text-[#0a4b32] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          {/* Compact EduNova Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#0a4b32] text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0a4b32]">
              EduNova
            </span>
          </Link>
        </div>

        {/* Center Claim Form Wizard */}
        <div className="my-auto py-1">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center p-8 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#0a4b32]" />
                <p className="text-xs text-[#5a6b62]">Loading claim portal...</p>
              </div>
            }
          >
            <ClaimAccountForm />
          </Suspense>
        </div>

        {/* Bottom Disclaimer */}
        <div className="shrink-0 pt-2 text-center text-[10.5px] text-[#5a6b62]/80 border-t border-[#e2e8e4]/70">
          <p>
            Institutional student verification &bull; Kishoreganj Polytechnic Institute
          </p>
        </div>
      </div>
    </div>
  );
}
