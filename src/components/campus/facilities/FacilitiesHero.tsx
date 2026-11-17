"use client";

import React from "react";
import Link from "next/link";
import { Wrench, Sparkles, Cpu, Layers, ExternalLink } from "lucide-react";
import Container from "@/components/shared/Container";

interface FacilitiesHeroProps {
  totalFacilities: number;
  isAdmin?: boolean;
}

export default function FacilitiesHero({
  totalFacilities,
  isAdmin,
}: FacilitiesHeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0a4b32]/10 via-[#0a4b32]/5 to-transparent pt-12 pb-10 sm:pt-16 sm:pb-12 border-b border-[#e2e8e4]">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0a4b32]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="wide">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold tracking-wide uppercase shadow-xs">
              <Wrench className="w-3.5 h-3.5 text-emerald-600" />
              <span>State-of-the-art Infrastructure</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0f1f17] tracking-tight leading-[1.15]">
              Engineering Facilities &{" "}
              <span className="text-[#0a4b32] bg-gradient-to-r from-[#0a4b32] to-emerald-600 bg-clip-text text-transparent">
                Technical Workshops
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#5a6b62] leading-relaxed">
              Equipped with industrial-grade machinery, computing labs,
              air-conditioning testing rigs, and modern food processing suites to prepare industry-ready engineers.
            </p>

            {/* Quick Stats Pill Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-emerald-100 text-xs font-medium text-[#1c2e24] shadow-2xs backdrop-blur-xs">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span><strong className="font-bold text-[#0a4b32]">{totalFacilities}+</strong> Laboratories & Workshops</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-emerald-100 text-xs font-medium text-[#1c2e24] shadow-2xs backdrop-blur-xs">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dual-Shift Practical Instruction</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-emerald-100 text-xs font-medium text-[#1c2e24] shadow-2xs backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>BTEB Standard Curriculums</span>
              </div>
            </div>
          </div>

          {/* Admin Quick Link */}
          {isAdmin && (
            <div className="shrink-0 pt-2 md:pt-0">
              <Link
                href="/dashboard/admin/campus"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-emerald-50 text-[#0a4b32] border border-emerald-200 text-xs font-bold shadow-xs transition"
              >
                <span>Admin Campus Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
