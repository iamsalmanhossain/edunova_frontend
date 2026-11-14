"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  LogIn,
  Compass,
  ShieldCheck,
  Building,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  MapPin,
  GraduationCap,
  Users,
  Cpu,
  Layers,
  Activity,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

// 5 Kishoreganj Polytechnic Institute (KIPI) Campus Images
const HERO_SLIDES = [
  {
    url: "/images/hero/kipi.jpg",
    title: "KIPI Central Academic Building",
    caption: "Main administrative & 4-storey central academic complex",
    badge: "Academic Building",
    category: "Campus Architecture",
    stats: "Central Faculty & Admin Offices",
  },
  {
    url: "/images/hero/kipi-gate.jpg",
    title: "KIPI Main Campus Gate",
    caption: "Official entrance gateway of Kishoreganj Polytechnic Institute",
    badge: "Main Entrance",
    category: "Campus Gateway",
    stats: "BTEB Affiliated Govt. Campus",
  },
  {
    url: "/images/hero/kipi-aerial.jpg",
    title: "Vibrant Campus Landscape",
    caption: "Panoramic aerial view of grounds & multi-disciplinary engineering blocks",
    badge: "Campus Grounds",
    category: "Scenic Aerial View",
    stats: "Sprawling Green Academic Perimeter",
  },
  {
    url: "/images/hero/kipi-ground.jpg",
    title: "Campus Ground & Garden",
    caption: "Open green athletic grounds, scenic gardens & student walkways",
    badge: "Green Grounds",
    category: "Student Life & Greenery",
    stats: "Recreation & Cultural Zone",
  },
  {
    url: "/images/hero/kipi-academic.jpg",
    title: "Technical Labs & Academic Wing",
    caption: "Modern high-tech engineering classrooms & laboratory facilities",
    badge: "Laboratories & Labs",
    category: "Engineering Facilities",
    stats: "16+ Specialized Labs & Workshops",
  },
];

const SLIDE_DURATION = 5500; // 5.5 seconds per slide

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Touch swipe support for mobile
  const touchStartXRef = useRef<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  // Smooth story progress bar & auto-advance timer
  useEffect(() => {
    if (isPaused || isLightboxOpen) return;

    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % HERO_SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, isLightboxOpen]);

  // Handle keyboard events for lightbox & navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, nextSlide, prevSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative overflow-hidden bg-[#021810] text-white min-h-[620px] sm:min-h-[680px] lg:min-h-[720px] flex flex-col justify-between select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* =========================================================================
          1. CINEMATIC KEN-BURNS BACKGROUND SLIDER (WITH SMOOTH ZOOM & PAN)
         ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide.url}
            initial={{ opacity: 0, scale: 1.12, filter: "brightness(0.85)" }}
            animate={{
              opacity: 1,
              scale: 1.03,
              filter: "brightness(1)",
              transition: { duration: 1.2, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              transition: { duration: 0.9, ease: "easeInOut" },
            }}
            className="absolute inset-0"
          >
            {/* Slow ambient camera drift while viewing image */}
            <motion.div
              animate={{
                scale: [1.03, 1.07],
                x: [0, -10],
              }}
              transition={{
                duration: SLIDE_DURATION / 1000,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="relative w-full h-full"
            >
              <Image
                src={activeSlide.url}
                alt={activeSlide.title}
                fill
                priority={currentSlide === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Multi-layered Gradients for Contrast & Text Legibility */}
        {/* Deep Left-to-Right reading gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02160e]/95 via-[#02160e]/85 sm:via-[#02160e]/75 to-[#02160e]/40 z-10" />

        {/* Vertical gradient blending seamlessly into topbar and bottom highlights */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02160e] via-transparent to-[#02160e]/85 z-10" />

        {/* =========================================================================
            2. MESMERIZING AURORA MESH ORBS (FLOATING, BREATHING & EXPANDING)
           ========================================================================= */}
        {/* Emerald Aurora Orb (Top Left) */}
        <motion.div
          animate={{
            x: [0, 45, -25, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.25, 0.95, 1],
            opacity: [0.35, 0.55, 0.4, 0.35],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#0a5237]/60 via-emerald-600/35 to-transparent blur-3xl z-10 pointer-events-none"
        />

        {/* Golden Amber Aurora Orb (Bottom Right) */}
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.3, 0.9, 1],
            opacity: [0.25, 0.45, 0.3, 0.25],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-28 -right-28 w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-[#c48b28]/45 via-amber-500/25 to-transparent blur-3xl z-10 pointer-events-none"
        />

        {/* Cyan/Teal Pulse Orb (Center Depth) */}
        <motion.div
          animate={{
            scale: [0.9, 1.2, 0.9],
            opacity: [0.12, 0.28, 0.12],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full bg-teal-500/20 blur-3xl z-10 pointer-events-none"
        />

        {/* =========================================================================
            3. FLOATING MICRO-STARDUST / PARTICLES LAYER
           ========================================================================= */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-gradient-to-tr from-[#ecdcb9] to-emerald-300"
              style={{
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                left: `${((i * 17) % 94) + 3}%`,
                top: `${((i * 23) % 86) + 7}%`,
              }}
              animate={{
                y: [0, -35, 0],
                opacity: [0.15, 0.75, 0.15],
                scale: [0.8, 1.5, 0.8],
              }}
              transition={{
                duration: 4.5 + (i % 5) * 1.2,
                repeat: Infinity,
                delay: i * 0.35,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          HERO MAIN CONTENT
         ========================================================================= */}
      <div className="relative z-20 flex-1 flex flex-col justify-center pt-10 sm:pt-14 lg:pt-16 pb-8">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center min-w-0">
              {/* Institutional Accreditation Pill with Live Radar Wave */}
              <motion.div
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032014]/90 border border-[#c48b28]/45 backdrop-blur-xl text-white text-[11px] sm:text-xs font-medium mb-4 shadow-xl w-fit max-w-full overflow-hidden"
              >
                {/* Subtle light sweep across pill */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                {/* Radar Pulse Status */}
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>

                <span className="text-[#fef8ec] font-semibold truncate">Institutional Campus</span>
                <span className="text-white/40 hidden xs:inline">•</span>
                <span className="text-white/95 hidden xs:inline truncate">Kishoreganj Polytechnic Institute</span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-white/80 font-mono text-[10px] hidden sm:inline">BTEB: 66035</span>
              </motion.div>

              {/* Main Headline with Animated Shimmer Gradient */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-[44px] lg:text-[46px] xl:text-[52px] font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md break-words"
              >
                Fostering{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#ecdcb9] via-[#ffffff] via-amber-200 to-[#ecdcb9] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x font-black">
                    Technical Excellence
                  </span>
                  {/* Subtle underline glow */}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ecdcb9]/0 via-[#c48b28] to-[#ecdcb9]/0" />
                </span>{" "}
                &amp; Modern Engineering
              </motion.h1>

              {/* Subtitle / Intro */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-sm break-words"
              >
                Welcome to EduNova at Kishoreganj Polytechnic Institute. Empowering future diploma engineers through structured technical curriculum, state-of-the-art laboratories, and unified digital academic governance.
              </motion.p>

              {/* Action Buttons with Interactive Glow & Magnetic Feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              >
                {/* Primary Button with Ambient Halo & Light Beam */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative group rounded-lg"
                >
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#c48b28] via-emerald-400 to-[#c48b28] opacity-60 blur-sm group-hover:opacity-100 transition duration-500 animate-pulse" />
                  <Button
                    asChild
                    size="lg"
                    className="relative bg-[#c48b28] hover:bg-[#b07b22] text-white font-bold px-6 h-11 text-xs sm:text-sm shadow-xl shadow-black/40 overflow-hidden w-full sm:w-auto"
                  >
                    <Link href="/login" className="flex items-center justify-center gap-2">
                      {/* Animated Shimmer sweep over button */}
                      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                      <LogIn className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-6" />
                      <span>Access Digital Campus</span>
                    </Link>
                  </Button>
                </motion.div>

                {/* Secondary Button with Glass Outline */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-lg"
                >
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-black/40 hover:bg-white/20 text-white font-semibold px-6 h-11 text-xs sm:text-sm backdrop-blur-md transition-all shadow-md group w-full sm:w-auto"
                  >
                    <Link href="/campus" className="flex items-center justify-center gap-2">
                      <Compass className="w-4 h-4 text-[#ecdcb9] shrink-0 transition-transform group-hover:rotate-45" />
                      <span>Explore Campus</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Feature Badges with Hover Glow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="mt-7 pt-4 border-t border-white/20 grid grid-cols-1 xs:grid-cols-3 gap-3.5 text-white/90 text-xs sm:text-sm font-medium"
              >
                <div className="flex items-center gap-2 min-w-0 group cursor-default">
                  <div className="p-1 rounded-md bg-white/10 group-hover:bg-[#c48b28]/30 transition-colors">
                    <ShieldCheck className="w-4 h-4 text-[#ecdcb9] shrink-0" />
                  </div>
                  <span className="truncate group-hover:text-white transition-colors">BTEB Approved Curriculum</span>
                </div>
                <div className="flex items-center gap-2 min-w-0 group cursor-default">
                  <div className="p-1 rounded-md bg-white/10 group-hover:bg-[#c48b28]/30 transition-colors">
                    <Building className="w-4 h-4 text-[#ecdcb9] shrink-0" />
                  </div>
                  <span className="truncate group-hover:text-white transition-colors">4 Engineering Disciplines</span>
                </div>
                <div className="flex items-center gap-2 min-w-0 group cursor-default">
                  <div className="p-1 rounded-md bg-white/10 group-hover:bg-[#c48b28]/30 transition-colors">
                    <Sparkles className="w-4 h-4 text-[#ecdcb9] shrink-0" />
                  </div>
                  <span className="truncate group-hover:text-white transition-colors">Shift 1 &amp; Shift 2 Programs</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Mind-Blowing Floating 3D Interactive Campus Hub */}
            <div className="hidden lg:flex lg:col-span-5 flex-col items-end justify-center relative pointer-events-none">
              {/* Primary Floating Glass Hub Card (Levitating on Air) */}
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full max-w-sm rounded-3xl p-5 bg-gradient-to-b from-white/15 via-white/10 to-black/50 border border-white/25 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] pointer-events-auto relative overflow-hidden group/card"
              >
                {/* Moving Ambient Sheen inside Card */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-500/15 via-[#c48b28]/20 to-teal-400/15 opacity-50 blur-xl pointer-events-none group-hover/card:opacity-90 transition-opacity duration-700" />

                {/* Card Header with Rotating Seal */}
                <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/15">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c48b28] to-[#0a4b32] p-0.5 shadow-lg shrink-0">
                      <div className="w-full h-full rounded-[14px] bg-[#031c12] flex items-center justify-center text-[#ecdcb9]">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-extrabold text-sm leading-tight truncate">
                        KIPI Live Campus Hub
                      </h4>
                      <p className="text-[#ecdcb9] text-[11px] font-medium truncate">
                        Kishoreganj Polytechnic
                      </p>
                    </div>
                  </div>

                  {/* Live Status Pill */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active Campus</span>
                  </span>
                </div>

                {/* Interactive 4-Cell Live Metrics Grid */}
                <div className="relative z-10 grid grid-cols-2 gap-2.5 my-3.5">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/40 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-1.5 text-white/60 text-[11px] mb-0.5">
                      <Users className="w-3.5 h-3.5 text-[#ecdcb9]" />
                      <span>Students</span>
                    </div>
                    <div className="text-white font-extrabold text-base tracking-tight">1,850+</div>
                    <div className="text-[10px] text-emerald-400 font-medium">Regular Enrolled</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/40 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-1.5 text-white/60 text-[11px] mb-0.5">
                      <Layers className="w-3.5 h-3.5 text-[#ecdcb9]" />
                      <span>Technologies</span>
                    </div>
                    <div className="text-white font-extrabold text-base tracking-tight">4 Core</div>
                    <div className="text-[10px] text-white/70">CST, ENT, FOOD, RAC</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/40 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-1.5 text-white/60 text-[11px] mb-0.5">
                      <Cpu className="w-3.5 h-3.5 text-[#ecdcb9]" />
                      <span>Laboratories</span>
                    </div>
                    <div className="text-white font-extrabold text-base tracking-tight">16+ Labs</div>
                    <div className="text-[10px] text-[#ecdcb9]">Modern Workshops</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/40 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-1.5 text-white/60 text-[11px] mb-0.5">
                      <Award className="w-3.5 h-3.5 text-[#ecdcb9]" />
                      <span>Affiliation</span>
                    </div>
                    <div className="text-white font-extrabold text-base tracking-tight">BTEB</div>
                    <div className="text-[10px] text-emerald-400 font-medium">Govt. Institute</div>
                  </div>
                </div>

                {/* Active Slide Spotlight Snippet */}
                <div className="relative z-10 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#ecdcb9] shrink-0" />
                    <span className="truncate">{activeSlide.stats}</span>
                  </div>
                  <span className="font-mono text-emerald-300 font-semibold shrink-0">
                    Shift 1 &amp; 2
                  </span>
                </div>
              </motion.div>

              {/* Secondary Floating Floating Satellite Badge (Opposite Levitation Drift) */}
              <motion.div
                animate={{
                  y: [8, -8, 8],
                  rotate: [-1, 1, -1],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="mt-3 px-3.5 py-2 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-xl shadow-xl flex items-center gap-2.5 text-xs pointer-events-auto"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-white/80 font-medium">Digital Campus Governance</span>
                <span className="text-white/30">•</span>
                <span className="text-[#ecdcb9] font-bold">EduNova v2.4</span>
              </motion.div>
            </div>
          </div>
        </Container>
      </div>

      {/* =========================================================================
          BOTTOM DOCKED SLIDE CONTROLLER & STORY BAR
         ========================================================================= */}
      <div className="relative z-20 pb-12 sm:pb-16 lg:pb-20 pt-4">
        <Container size="wide">
          <div className="p-3 sm:p-4 rounded-2xl bg-black/65 sm:bg-black/50 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            {/* Left: Active Slide Info with Smooth Transition */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#c48b28]/35 text-[#f5ebd6] border border-[#c48b28]/60 shrink-0 shadow-sm">
                {activeSlide.badge}
              </span>
              <div className="min-w-0 pr-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.title}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-white font-bold text-xs sm:text-sm truncate drop-shadow-sm">
                      {activeSlide.title}
                    </p>
                    <p className="text-white/75 text-[11px] sm:text-xs truncate hidden xs:block">
                      {activeSlide.caption}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Story Progress Bars & Navigation Controls */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-between md:justify-end">
              {/* Segmented Progress Bars with Glowing Head */}
              <div className="flex items-center gap-1.5 w-32 sm:w-44 shrink-0">
                {HERO_SLIDES.map((slide, idx) => {
                  const isPast = idx < currentSlide;
                  const isCurrent = idx === currentSlide;
                  return (
                    <button
                      key={slide.url}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className="relative h-1.5 flex-1 rounded-full bg-white/25 overflow-hidden transition-all duration-200 cursor-pointer hover:h-2"
                      aria-label={`Slide ${idx + 1}: ${slide.title}`}
                      title={`${slide.title}`}
                    >
                      <div
                        className={`h-full rounded-full transition-all ${
                          isPast
                            ? "w-full bg-[#ecdcb9]"
                            : isCurrent
                            ? "bg-gradient-to-r from-[#ecdcb9] via-emerald-300 to-[#c48b28] shadow-[0_0_8px_#ecdcb9]"
                            : "w-0"
                        }`}
                        style={
                          isCurrent
                            ? {
                                width: `${progress}%`,
                                transition: isPaused ? "none" : "width 50ms linear",
                              }
                            : undefined
                        }
                      />
                    </button>
                  );
                })}
              </div>

              {/* Counter Indicator */}
              <span className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-[11px] sm:text-xs text-white/90 shrink-0">
                {String(currentSlide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
              </span>

              {/* Controls: Prev, Next & Fullscreen Lightbox */}
              <div className="flex items-center gap-1.5 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  aria-label="Previous photo"
                  title="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  aria-label="Next photo"
                  title="Next photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  aria-label="View Fullscreen"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* =========================================================================
          FULLSCREEN HIGH-RESOLUTION LIGHTBOX MODAL
         ========================================================================= */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/94 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header Bar */}
              <div className="w-full flex items-center justify-between text-white pb-3 px-1">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#c48b28]/35 text-[#f5ebd6] border border-[#c48b28]/55">
                      {activeSlide.badge}
                    </span>
                    <span className="text-white/60 text-xs hidden xs:inline">• Kishoreganj Polytechnic Institute</span>
                  </div>
                  <h4 className="font-bold text-base sm:text-lg truncate">{activeSlide.title}</h4>
                  <p className="text-white/75 text-xs sm:text-sm truncate">{activeSlide.caption}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs sm:text-sm text-white/80">
                    {String(currentSlide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
                    aria-label="Close fullscreen view"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Lightbox Big Photo Frame */}
              <div className="relative w-full aspect-[4/3] max-h-[76vh] rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl">
                <Image
                  src={activeSlide.url}
                  alt={activeSlide.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Lightbox Previous & Next Floating Controls */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-xl"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-xl"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
