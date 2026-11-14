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
// Order strictly maintained:
// 1. kipi.jpg (Main Campus Academic Building)
// 2. kipi-gate.jpg (Main Entrance Gate)
// 3. kipi-aerial.jpg (Campus Landscape & Aerial Grounds)
// 4. kipi-ground.jpg (Campus Grounds & Walkways)
// 5. kipi-academic.jpg (Academic & Lab Infrastructure)
const HERO_SLIDES = [
  {
    url: "/images/hero/kipi.jpg",
    title: "KIPI Central Academic Building",
    caption: "Main administrative & 4-storey academic campus building",
    badge: "Main Campus Building",
    category: "Campus Architecture",
  },
  {
    url: "/images/hero/kipi-gate.jpg",
    title: "KIPI Main Campus Gate",
    caption: "Official entrance gateway of Kishoreganj Polytechnic Institute",
    badge: "Campus Entrance",
    category: "Main Entrance",
  },
  {
    url: "/images/hero/kipi-aerial.jpg",
    title: "Vibrant Campus Landscape",
    caption: "Panoramic aerial view of grounds & academic complex",
    badge: "Aerial Landscape",
    category: "Scenic Overview",
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
    badge: "Academic Wing",
    category: "Engineering Labs",
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

    // Minimum swipe threshold of 45px
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#041f15] via-[#073825] to-[#031810] text-white">
      {/* Ambient background lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#0a5237]/35 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#c48b28]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <Container size="wide" className="relative z-10 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Left Column: Institutional Info & CTAs */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center min-w-0">
            {/* Institutional Accreditation Pill */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-[#0a4b32]/90 border border-[#c48b28]/40 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium mb-3 shadow-sm w-fit max-w-full"
            >
              <span className="w-2 h-2 rounded-full bg-[#c48b28] animate-pulse shrink-0" />
              <span className="text-[#fef8ec] font-semibold truncate">Institutional Campus</span>
              <span className="text-white/40 hidden xs:inline">•</span>
              <span className="text-white/90 hidden xs:inline truncate">Kishoreganj Polytechnic Institute</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-[42px] lg:text-[40px] xl:text-[46px] font-extrabold text-white tracking-tight leading-[1.15] break-words"
            >
              Fostering <span className="text-[#ecdcb9]">Technical Excellence</span> &amp; Modern Engineering
            </motion.h1>

            {/* Subtitle / Intro */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-3 text-xs sm:text-sm md:text-base text-white/85 leading-relaxed font-normal max-w-2xl break-words"
            >
              Welcome to EduNova at Kishoreganj Polytechnic Institute. Empowering future diploma engineers through structured technical curriculum, state-of-the-art laboratories, and unified digital academic governance.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="bg-[#c48b28] hover:bg-[#b07b22] text-white font-bold px-6 h-10 sm:h-11 text-xs sm:text-sm shadow-lg shadow-black/25"
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
                className="border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 h-10 sm:h-11 text-xs sm:text-sm backdrop-blur-xs"
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
              className="mt-6 pt-4 border-t border-white/15 grid grid-cols-1 xs:grid-cols-3 gap-3 text-white/85 text-xs lg:text-xs xl:text-sm"
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

          {/* Right Column: Redesigned Modern Glassmorphic Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 xl:col-span-5 w-full flex flex-col items-center"
          >
            {/* Ambient subtle glow around showcase card */}
            <div className="relative w-full group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-[#c48b28]/25 to-teal-500/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Main Cinematic Glassmorphism Container */}
              <div
                className="relative w-full rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-white/15 via-white/10 to-black/35 border border-white/20 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Visual Viewport: High Aspect Ratio without image cutoff */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#03170e]">
                  {/* Dynamic background ambient blur */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image
                      src={activeSlide.url}
                      alt=""
                      fill
                      className="object-cover blur-2xl opacity-40 scale-125 transition-all duration-700"
                      sizes="500px"
                    />
                  </div>

                  {/* Active Slide Image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSlide.url}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className="absolute inset-0 z-10 cursor-pointer group/image"
                      onClick={() => setIsLightboxOpen(true)}
                    >
                      <Image
                        src={activeSlide.url}
                        alt={activeSlide.title}
                        fill
                        priority={currentSlide === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                        className="object-cover object-center transition-transform duration-700 group-hover/image:scale-[1.03]"
                      />
                      {/* Gradient scrims for readable overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />
                    </motion.div>
                  </AnimatePresence>

                  {/* 1. Top Story Progress Bars (Apple / Instagram Style) */}
                  <div className="absolute top-3 sm:top-3.5 left-3 sm:left-4 right-3 sm:right-4 z-30 flex items-center gap-1.5 sm:gap-2">
                    {HERO_SLIDES.map((slide, idx) => {
                      const isPast = idx < currentSlide;
                      const isCurrent = idx === currentSlide;
                      return (
                        <button
                          key={slide.url}
                          type="button"
                          onClick={() => goToSlide(idx)}
                          className="relative h-1 sm:h-1.5 flex-1 rounded-full bg-white/30 overflow-hidden transition-all duration-200 cursor-pointer hover:h-2"
                          aria-label={`View slide ${idx + 1}: ${slide.title}`}
                          title={`Slide ${idx + 1}: ${slide.title}`}
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

                  {/* 2. Top Info & Fullscreen Controls Bar (below progress bars) */}
                  <div className="absolute top-7 sm:top-8 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="text-[#fef8ec] font-semibold">{activeSlide.badge}</span>
                    </div>

                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[11px] font-mono shadow-md">
                        {String(currentSlide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsLightboxOpen(true)}
                        className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black/85 hover:border-white/40 flex items-center justify-center transition-all cursor-pointer shadow-md"
                        title="View Fullscreen"
                        aria-label="View Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 3. Floating Glassmorphic Caption & Slide Navigation Card (At Bottom) */}
                  <div className="absolute bottom-3 sm:bottom-3.5 left-3 sm:left-3.5 right-3 sm:right-3.5 z-20 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-black/65 sm:bg-black/55 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-between gap-3 pointer-events-auto">
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-[#ecdcb9] shrink-0" />
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[#ecdcb9] uppercase tracking-wider truncate">
                          KIPI Campus • {activeSlide.category}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-sm sm:text-base leading-snug truncate drop-shadow-sm">
                        {activeSlide.title}
                      </h3>
                      <p className="text-white/80 text-[11px] sm:text-xs drop-shadow-sm truncate mt-0.5">
                        {activeSlide.caption}
                      </p>
                    </div>

                    {/* Previous & Next Control Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={prevSlide}
                        className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                        aria-label="Previous photo"
                        title="Previous photo"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                        aria-label="Next photo"
                        title="Next photo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Bottom Sleek Institutional Info Strip (Replaces cramped thumbnails) */}
                <div className="mt-2 sm:mt-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between gap-2 text-[11px] sm:text-xs text-white/85">
                  <div className="flex items-center gap-1.5 min-w-0 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#ecdcb9] shrink-0" />
                    <span className="text-white/60">BTEB Code:</span>
                    <span className="font-mono font-semibold text-white">66035</span>
                  </div>
                  <div className="hidden xs:flex items-center gap-1.5 text-white/60">
                    <span>•</span>
                    <span className="text-white/90 font-medium">4 Tech Departments</span>
                    <span>•</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-emerald-300 font-semibold">1st &amp; 2nd Shift</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Fullscreen High-Resolution Lightbox Modal */}
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
