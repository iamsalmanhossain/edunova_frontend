"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
} from "lucide-react";

interface AuthVisualPanelProps {
  headline?: string;
  subheadline?: string;
}

export default function AuthVisualPanel({
  headline = "Empowering Polytechnic Excellence Through Modern Digital Systems",
  subheadline = "Experience seamless academic management, semester results, attendance monitoring, and centralized institutional governance.",
}: AuthVisualPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 h-full relative flex-col justify-between p-6 xl:p-8 overflow-hidden bg-[#073825] text-white shrink-0">
      {/* Background Campus Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1400&auto=format&fit=crop"
          alt="EduNova Digital Campus Administration"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        {/* Deep Editorial Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#031c12] via-[#063322]/92 to-[#073825]/85" />
      </div>

      {/* Top Brand */}
      <div className="relative z-10 shrink-0">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white text-[#0a4b32] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">
                EduNova
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#c48b28] text-white shadow-xs">
                IMS
              </span>
            </div>
            <p className="text-[11px] text-white/75 font-medium -mt-0.5">
              Digital Campus Platform
            </p>
          </div>
        </Link>
      </div>

      {/* Middle Headline & Value Props */}
      <div className="relative z-10 max-w-lg space-y-4 my-auto py-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xs text-[11px] font-semibold text-[#ecdcb9]">
          <Sparkles className="w-3 h-3 text-[#ecdcb9]" />
          <span>Official Institutional Portal</span>
        </div>

        <h2 className="text-xl xl:text-2xl font-extrabold leading-snug text-white">
          {headline}
        </h2>

        <p className="text-xs xl:text-sm text-white/80 leading-relaxed">
          {subheadline}
        </p>

        {/* Feature Checkpoints */}
        <div className="space-y-2 pt-1 text-xs text-white/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
            <span>Kishoreganj Polytechnic Institute official portal (KIPI)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
            <span>Role-based dashboards for Students, Teachers &amp; Admins</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c48b28] shrink-0" />
            <span>Shift-based attendance tracking &amp; semester marksheets</span>
          </div>
        </div>

        {/* Floating Mini Stats */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-[#ecdcb9] mb-0.5">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Active Enrollment</span>
            </div>
            <p className="text-base font-bold text-white">1,250+ Students</p>
            <p className="text-[10px] text-white/60">4 Engineering Disciplines</p>
          </div>

          <div className="bg-white/10 border border-white/15 backdrop-blur-md rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-[#ecdcb9] mb-0.5">
              <Award className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Faculty Staff</span>
            </div>
            <p className="text-base font-bold text-white">48+ Instructors</p>
            <p className="text-[10px] text-white/60">Shift 1 &amp; Shift 2 Coverage</p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/60 shrink-0">
        <span>&copy; {new Date().getFullYear()} EduNova Digital Campus</span>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c48b28]" />
          <span>Encrypted Session</span>
        </div>
      </div>
    </div>
  );
}
