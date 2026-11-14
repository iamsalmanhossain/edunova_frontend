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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

// 5 Kishoreganj Polytechnic Institute (KIPI) Campus Images
const HERO_SLIDES = [
  {
    url: "/images/hero/kipi.jpg",
    title: "KIPI Central Academic Building",
    caption: "Main administrative & 4-storey academic campus building",
    badge: "Academic Building",
    category: "Campus Architecture",
  },
  {
    url: "/images/hero/kipi-gate.jpg",
    title: "KIPI Main Campus Gate",
    caption: "Official entrance gateway of Kishoreganj Polytechnic Institute",
    badge: "Main Entrance",
    category: "Campus Gateway",
  },
  {
    url: "/images/hero/kipi-aerial.jpg",
    title: "Vibrant Campus Landscape",
    caption: "Panoramic aerial view of grounds & academic complex",
    badge: "Campus Grounds",
    category: "Scenic Aerial View",
  },
  {
    url: "/images/hero/kipi-ground.jpg",
    title: "Campus Ground & Garden",
    caption: "Open green grounds, scenic gardens & student walkways",
    badge: "Green Grounds",
    category: "Student Life & Greenery",
  },
  {
    url: "/images/hero/kipi-academic.jpg",
    title: "Technical Labs & Academic Wing",
    caption: "Modern engineering classrooms & laboratory facilities",
    badge: "Laboratories & Labs",
    category: "Engineering Facilities",
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
      className="relative overflow-hidden bg-[#021810] text-white min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* =========================================================================
          FULL-BLEED CINEMATIC BACKGROUND SLIDER
         ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide.url}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0"
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
        </AnimatePresence>

        {/* Multi-layered Gradients for Ultra-Crisp Typography & Visual Depth */}
        {/* 1. Left-to-Right reading gradient (dark on left for text, transparent on right for campus visual) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02160e]/95 via-[#02160e]/85 sm:via-[#02160e]/75 to-[#02160e]/40 z-10" />

        {/* 2. Top-to-Bottom gradient (dark on top and bottom for smooth blending into navbar and highlights) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02160e] via-transparent to-[#02160e]/85 z-10" />

        {/* 3. Subtle ambient brand glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#0a5237]/40 blur-3xl z-10" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#c48b28]/25 blur-3xl z-10" />
      </div>

      {/* =========================================================================
          HERO MAIN CONTENT
         ========================================================================= */}
      <div className="relative z-20 flex-1 flex flex-col justify-center pt-10 sm:pt-14 lg:pt-16 pb-8">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-8 xl:col-span-7 flex flex-col justify-center min-w-0">
              {/* Institutional Accreditation Pill */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-[#032014]/85 border border-[#c48b28]/45 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium mb-4 shadow-lg w-fit max-w-full"
              >
                <span className="w-2 h-2 rounded-full bg-[#c48b28] animate-pulse shrink-0" />
                <span className="text-[#fef8ec] font-semibold truncate">Institutional Campus</span>
                <span className="text-white/40 hidden xs:inline">•</span>
                <span className="text-white/95 hidden xs:inline truncate">Kishoreganj Polytechnic Institute</span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-white/80 font-mono text-[10px] hidden sm:inline">EIIN: 66035</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-[44px] lg:text-[46px] xl:text-[52px] font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md break-words"
              >
                Fostering <span className="text-[#ecdcb9]">Technical Excellence</span> &amp; Modern Engineering
              </motion.h1>

              {/* Subtitle / Intro */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-sm break-words"
              >
                Welcome to EduNova at Kishoreganj Polytechnic Institute. Empowering future diploma engineers through structured technical curriculum, state-of-the-art laboratories, and unified digital academic governance.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-[#c48b28] hover:bg-[#b07b22] text-white font-bold px-6 h-11 text-xs sm:text-sm shadow-xl shadow-black/35 transition-all"
                >
                  <Link href="/login" className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4 shrink-0" />
                    <span>Access Digital Campus</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-black/35 hover:bg-white/20 text-white font-semibold px-6 h-11 text-xs sm:text-sm backdrop-blur-md transition-all shadow-md"
                >
                  <Link href="/campus" className="flex items-center justify-center gap-2">
                    <Compass className="w-4 h-4 text-[#ecdcb9] shrink-0" />
                    <span>Explore Campus</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </motion.div>

              {/* Feature Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-7 pt-4 border-t border-white/20 grid grid-cols-1 xs:grid-cols-3 gap-3.5 text-white/90 text-xs sm:text-sm font-medium"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="w-4 h-4 text-[#ecdcb9] shrink-0" />
                  <span className="truncate">BTEB Approved Curriculum</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Building className="w-4 h-4 text-[#ecdcb9] shrink-0" />
                  <span className="truncate">4 Engineering Disciplines</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-4 h-4 text-[#ecdcb9] shrink-0" />
                  <span className="truncate">Shift 1 &amp; Shift 2 Programs</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Floating Institutional Badge & Atmosphere */}
            <div className="hidden lg:flex lg:col-span-4 xl:col-span-5 flex-col items-end justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-4 rounded-2xl bg-[#021810]/70 backdrop-blur-xl border border-white/20 shadow-2xl max-w-sm pointer-events-auto"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#c48b28]/25 border border-[#c48b28]/40 flex items-center justify-center text-[#f5ebd6]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm leading-tight">
                      Kishoreganj Polytechnic
                    </h4>
                    <p className="text-[#ecdcb9] text-xs">Govt. Technical Institute</p>
                  </div>
                </div>
                <p className="text-white/80 text-xs leading-relaxed">
                  Established in 2008 under Bangladesh Technical Education Board (BTEB), providing 4-year Diploma in Engineering.
                </p>
                <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Campus Open</span>
                  </span>
                  <span className="font-mono text-white/90">BTEB: 66035</span>
                </div>
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
          <div className="p-3 sm:p-4 rounded-2xl bg-black/60 sm:bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            {/* Left: Active Slide Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#c48b28]/30 text-[#f5ebd6] border border-[#c48b28]/50 shrink-0">
                {activeSlide.badge}
              </span>
              <div className="min-w-0 pr-2">
                <p className="text-white font-bold text-xs sm:text-sm truncate drop-shadow-sm">
                  {activeSlide.title}
                </p>
                <p className="text-white/75 text-[11px] sm:text-xs truncate hidden xs:block">
                  {activeSlide.caption}
                </p>
              </div>
            </div>

            {/* Right: Story Progress Bars & Navigation Controls */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 justify-between md:justify-end">
              {/* Segmented Progress Bars */}
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
                            ? "bg-gradient-to-r from-[#ecdcb9] via-emerald-300 to-[#c48b28]"
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
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                  aria-label="Previous photo"
                  title="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                  aria-label="Next photo"
                  title="Next photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                  aria-label="View Fullscreen"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4 sm:p-6"
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
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#c48b28]/30 text-[#f5ebd6] border border-[#c48b28]/50">
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
