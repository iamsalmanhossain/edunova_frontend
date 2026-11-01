import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import AuthVisualPanel from "./AuthVisualPanel";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  visualHeadline?: string;
  visualSubheadline?: string;
  mode?: "login" | "register" | "forgot-password" | "reset-password" | "verify-email";
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  visualHeadline,
  visualSubheadline,
  mode,
}: AuthLayoutProps) {
  return (
    <div className="h-screen max-h-screen w-full flex flex-col lg:flex-row bg-[#fcfdfc] overflow-hidden no-scrollbar">
      {/* Desktop Visual Panel: Takes 5/12 on lg, 1/2 on xl. Completely hidden on mobile / tablets */}
      <div className="hidden lg:flex w-5/12 xl:w-1/2 h-full shrink-0">
        <AuthVisualPanel
          mode={mode}
          headline={visualHeadline}
          subheadline={visualSubheadline}
        />
      </div>

      {/* Form Container: Full width on mobile/tablet, 7/12 on lg, 1/2 on xl */}
      <div className="w-full lg:w-7/12 xl:w-1/2 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-7 xl:p-8 overflow-y-auto no-scrollbar">
        {/* Header / Brand Nav */}
        <div className="flex items-center justify-between shrink-0 pb-3 sm:pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5a6b62] hover:text-[#0a4b32] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          {/* Compact EduNova Logo for Mobile */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0a4b32] text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#0a4b32]">
              EduNova
            </span>
          </Link>
        </div>

        {/* Center Auth Form Wrapper */}
        <div className="w-full max-w-md mx-auto my-auto py-1 sm:py-2">
          <div className="mb-3 sm:mb-4 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f1f17] tracking-tight">
              {title}
            </h1>
            <p className="mt-1 text-xs text-[#5a6b62] leading-snug">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {/* Bottom Disclaimer */}
        <div className="shrink-0 pt-2 sm:pt-3 text-center text-[11px] text-[#5a6b62]/80 border-t border-[#e2e8e4]/70">
          <p>
            Authorized access only for verified students, faculty &amp; administrators.
          </p>
        </div>
      </div>
    </div>
  );
}
