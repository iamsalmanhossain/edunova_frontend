"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0a4b32] to-[#073222] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl">
      <div className="max-w-2xl space-y-3 sm:space-y-4">
        <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
          Begin Your Engineering Journey at KIGPI
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          Explore our 4 accredited 4-year Diploma in Engineering departments, state-of-the-art laboratory workshops, and centralized digital campus portal.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full sm:w-auto">
          {/* Primary Button: Solid White with Deep Green text */}
          <Button
            asChild
            className="bg-white hover:bg-emerald-50 text-[#0a4b32] font-bold text-xs sm:text-sm h-11 px-6 shadow-md active:scale-[0.98] transition-all w-full sm:w-auto justify-center"
          >
            <Link href="/departments" className="flex items-center justify-center gap-2">
              <span>View All 4 Departments</span>
              <ArrowRight className="w-4 h-4 text-[#0a4b32]" />
            </Link>
          </Button>

          {/* Secondary Button: Dark Emerald with High-Contrast White Text & Crisp Border */}
          <Button
            asChild
            className="bg-emerald-950/60 hover:bg-emerald-950/80 text-white font-semibold text-xs sm:text-sm h-11 px-6 border-2 border-emerald-300/40 hover:border-emerald-300/70 shadow-sm active:scale-[0.98] transition-all w-full sm:w-auto justify-center"
          >
            <Link href="/contact" className="flex items-center justify-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-300" />
              <span>Contact Administration</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
