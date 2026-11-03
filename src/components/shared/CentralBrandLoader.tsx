"use client";

import React from "react";
import { GraduationCap } from "lucide-react";

interface CentralBrandLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export default function CentralBrandLoader({
  message = "Loading EduNova IMS...",
  subMessage = "Preparing digital campus platform and academic data",
  fullScreen = true,
}: CentralBrandLoaderProps) {
  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-50 min-h-screen bg-[#f7faf8]/95 backdrop-blur-md"
          : "w-full min-h-[420px] bg-transparent"
      } flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-300`}
    >
      <div className="relative flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Rings & Glowing Logo Wrapper */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Outer Pulsing Glow Aura */}
          <div className="absolute w-24 h-24 rounded-3xl bg-emerald-500/15 blur-xl animate-pulse" />

          {/* Rotating Subtle Dash Orbit */}
          <div className="absolute w-20 h-20 rounded-2xl border-2 border-dashed border-[#c48b28]/40 animate-[spin_8s_linear_infinite]" />

          {/* Main Brand Crest */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#073825] via-[#0a4b32] to-[#052b1c] text-white flex items-center justify-center shadow-xl shadow-[#0a4b32]/25 ring-4 ring-[#0a4b32]/10 transition-transform">
            <GraduationCap className="w-8 h-8 text-[#c48b28] animate-bounce" />
          </div>
        </div>

        {/* Brand Title with IMS Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-black tracking-tight text-[#0f1f17]">
            EduNova
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#c48b28] text-white tracking-widest uppercase shadow-2xs">
            IMS
          </span>
        </div>

        {/* Dynamic Status Messages */}
        <p className="text-xs font-bold text-[#0a4b32] tracking-wide mb-1">
          {message}
        </p>
        <p className="text-[11px] text-[#5a6b62] max-w-xs leading-relaxed mb-6">
          {subMessage}
        </p>

        {/* Smooth Indeterminate Progress Bar */}
        <div className="w-48 sm:w-56 h-1.5 bg-[#e4ece7] rounded-full overflow-hidden shadow-inner relative">
          <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#0a4b32] via-[#c48b28] to-[#0a4b32] rounded-full w-1/2 animate-progress-sweep" />
        </div>
      </div>
    </div>
  );
}
