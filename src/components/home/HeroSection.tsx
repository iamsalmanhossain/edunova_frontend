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
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

// 5 Kishoreganj Polytechnic Institute (KIPI) Campus Slides with Tailored Dynamic Content
const HERO_SLIDES = [
  {
    url: "/images/hero/kipi.jpg",
    badge: "Institutional Campus • KIPI",
    headlinePrefix: "Fostering ",
    headlineHighlight: "Technical Excellence",
    headlineSuffix: " & Modern Engineering",
    subtitle:
      "Welcome to EduNova at Kishoreganj Polytechnic Institute. Empowering future diploma engineers through structured technical curriculum, world-class academic governance, and digital automation.",
    caption: "KIPI Central Academic Building & Administrative Complex",
  },
  {
    url: "/images/hero/kipi-gate.jpg",
    badge: "Official Campus Gateway • Estd. 2008",
    headlinePrefix: "Gateway to ",
    headlineHighlight: "Engineering Leadership",
    headlineSuffix: " & Innovation",
    subtitle:
      "Kishoreganj Polytechnic Institute stands as a premier government technical institution, nurturing skilled diploma engineers across BTEB accredited disciplines since 2008.",
    caption: "KIPI Main Campus Entrance Gateway",
  },
  {
    url: "/images/hero/kipi-aerial.jpg",
    badge: "Scenic Grounds & Aerial Complex",
    headlinePrefix: "A Vibrant Eco-Campus for ",
    headlineHighlight: "Holistic Learning",
    headlineSuffix: " & Growth",
    subtitle:
      "Sprawling across Karimganj, our scenic green campus blends advanced technical education with an open, inspiring environment designed for tomorrow's technological pioneers.",
    caption: "Vibrant Campus Landscape & Aerial Grounds",
  },
  {
    url: "/images/hero/kipi-ground.jpg",
    badge: "Student Grounds & Community",
    headlinePrefix: "Inspiring Athletic Grounds & ",
    headlineHighlight: "Vibrant Campus Life",
    headlineSuffix: "",
    subtitle:
      "Beyond classrooms, KIPI fosters teamwork, physical health, and community leadership through expansive athletic grounds, active technical clubs, and student events.",
    caption: "Campus Ground, Scenic Gardens & Walkways",
  },
  {
    url: "/images/hero/kipi-academic.jpg",
    badge: "16+ High-Tech Laboratories & Workshops",
    headlinePrefix: "Hands-On Mastery in ",
    headlineHighlight: "Modern Engineering Labs",
    headlineSuffix: "",
    subtitle:
      "Practical excellence in Computer, Electronics, Food, and RAC technologies with industry-grade equipment, specialized workshops, and project-based laboratory training.",
    caption: "Technical Labs & Engineering Academic Wing",
  },
];

const SLIDE_DURATION = 5500; // 5.5 seconds per slide

// Staggered motion variants for smooth choreographed text reveal
const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: -16, scale: 0.9, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    filter: "blur(4px)",
    transition: { duration: 0.25 },
  },
};

const headlineVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)", scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(6px)",
    transition: { duration: 0.3 },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(4px)",
    transition: { duration: 0.25 },
  },
};

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Touch swipe support for mobile
  const touchStartXRef = useRef<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setProgress(0);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
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
          setDirection(1);
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLightboxOpen) setIsLightboxOpen(false);
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
      className="relative overflow-hidden bg-[#021810] text-white flex flex-col justify-center items-center select-none pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-14"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* =========================================================================
          1. CINEMATIC KEN-BURNS BACKGROUND SLIDER (WITH DEPTH LENS BLUR TRANSITION)
         ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide.url}
            initial={{
              opacity: 0,
              scale: 1.14,
              filter: "blur(10px) brightness(0.75)",
            }}
            animate={{
              opacity: 1,
              scale: 1.02,
              filter: "blur(0px) brightness(1)",
              transition: {
                duration: 1.3,
                ease: [0.16, 1, 0.3, 1] as const,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              filter: "blur(8px) brightness(0.7)",
              transition: {
                duration: 0.9,
                ease: "easeInOut",
              },
            }}
            className="absolute inset-0"
          >
            {/* Subtle camera drift while viewing image */}
            <motion.div
              animate={{
                scale: [1.02, 1.06],
                x: [0, -8],
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
                alt={activeSlide.caption}
                fill
                priority={currentSlide === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Golden Lens Flare Sweep on Image Transition */}
        <AnimatePresence>
          <motion.div
            key={`flare-${currentSlide}`}
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 0, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c48b28]/15 to-transparent pointer-events-none z-10"
          />
        </AnimatePresence>

        {/* Multi-layered Gradients for Contrast & Legibility */}
        <div className="absolute inset-0 bg-radial from-[#02160e]/95 via-[#02160e]/85 to-[#02160e]/75 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02160e] via-transparent to-[#02160e]/85 z-10" />

        {/* Animated Aurora Orbs in Background */}
        <motion.div
          animate={{
            x: [0, 40, -25, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.25, 0.95, 1],
            opacity: [0.35, 0.55, 0.4, 0.35],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 left-1/4 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-[#0a5237]/60 via-emerald-600/35 to-transparent blur-3xl z-10 pointer-events-none"
        />

        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -25, 0],
            scale: [1, 1.3, 0.9, 1],
            opacity: [0.25, 0.45, 0.3, 0.25],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-28 right-1/4 w-[480px] h-[480px] rounded-full bg-gradient-to-tl from-[#c48b28]/45 via-amber-500/25 to-transparent blur-3xl z-10 pointer-events-none"
        />

        {/* Floating Micro-Stardust Particles */}
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
          2. CENTERED HERO CONTENT (HIGH-DEFINITION STAGGERED TEXT ANIMATIONS)
         ========================================================================= */}
      <Container size="default" className="relative z-20 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
        {/* Dynamic Text Container: Fixed min-height ensures 0 screen jitter ("coto boro hoi na") */}
        <div className="relative w-full min-h-[210px] xs:min-h-[220px] sm:min-h-[235px] md:min-h-[245px] flex items-center justify-center">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={textContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex flex-col items-center justify-center text-center"
            >
              {/* Dynamic Institutional Badge Pill with Pop & Scale Animation */}
              <motion.div
                variants={pillVariants}
                className="group relative inline-flex items-center gap-2 px-3.5 py-1 sm:py-1.5 rounded-full bg-[#032014]/90 border border-[#c48b28]/50 backdrop-blur-xl text-white text-[11px] sm:text-xs font-medium mb-3 sm:mb-4 shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-400" />
                </span>

                <span className="text-[#fef8ec] font-semibold">{activeSlide.badge}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80 font-mono text-[10px] sm:text-xs">EIIN: 66035</span>
              </motion.div>

              {/* Dynamic Main Headline with Staggered Rise & Blur Focus */}
              <motion.h1
                variants={headlineVariants}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-[44px] lg:text-[50px] font-black text-white tracking-tight leading-[1.14] drop-shadow-lg max-w-3xl"
              >
                {activeSlide.headlinePrefix}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#ecdcb9] via-[#ffffff] via-amber-200 to-[#ecdcb9] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                    {activeSlide.headlineHighlight}
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ecdcb9]/0 via-[#c48b28] to-[#ecdcb9]/0" />
                </span>
                {activeSlide.headlineSuffix}
              </motion.h1>

              {/* Dynamic Subtitle with Smooth Follow-Through Animation */}
              <motion.p
                variants={subtitleVariants}
                className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-md"
              >
                {activeSlide.subtitle}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons (Permanent, Centered & Animated) */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          {/* Primary CTA */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative group rounded-lg w-full sm:w-auto"
          >
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#c48b28] via-emerald-400 to-[#c48b28] opacity-60 blur-sm group-hover:opacity-100 transition duration-500 animate-pulse" />
            <Button
              asChild
              size="lg"
              className="relative bg-[#c48b28] hover:bg-[#b07b22] text-white font-bold px-6 sm:px-7 h-10 sm:h-11 text-xs sm:text-sm shadow-xl shadow-black/40 overflow-hidden w-full sm:w-auto cursor-pointer"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                <LogIn className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-6" />
                <span>Access Digital Campus</span>
              </Link>
            </Button>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-lg w-full sm:w-auto"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-black/40 hover:bg-white/20 text-white font-semibold px-6 sm:px-7 h-10 sm:h-11 text-xs sm:text-sm backdrop-blur-md transition-all shadow-md group w-full sm:w-auto cursor-pointer"
            >
              <Link href="/campus" className="flex items-center justify-center gap-2">
                <Compass className="w-4 h-4 text-[#ecdcb9] shrink-0 transition-transform group-hover:rotate-45" />
                <span>Explore Campus</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Minimal Centered Story Progress Indicators & Chevrons */}
        <div className="mt-6 sm:mt-7 flex items-center justify-center gap-2.5 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={prevSlide}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            aria-label="Previous slide"
            title="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          {/* 5 Sleek Capsule Story Progress Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {HERO_SLIDES.map((slide, idx) => {
              const isPast = idx < currentSlide;
              const isCurrent = idx === currentSlide;
              return (
                <button
                  key={slide.url}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className="relative h-1.5 w-7 sm:w-10 rounded-full bg-white/25 overflow-hidden transition-all duration-200 cursor-pointer hover:h-2"
                  aria-label={`Slide ${idx + 1}`}
                  title={slide.caption}
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

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={nextSlide}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            aria-label="Next slide"
            title="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>

          {/* Fullscreen Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#c48b28] border border-white/20 hover:border-[#c48b28] text-white flex items-center justify-center transition-all cursor-pointer shadow-md ml-1"
            aria-label="View Fullscreen"
            title="View Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Feature Badges Centered Row */}
        <div className="mt-6 sm:mt-7 pt-4 sm:pt-5 border-t border-white/20 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-white/90 text-[11px] sm:text-xs md:text-sm font-medium">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="p-1 rounded-md bg-white/10 group-hover:bg-[#c48b28]/30 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ecdcb9] shrink-0" />
            </div>
            <span className="group-hover:text-white transition-colors">BTEB Approved Curriculum</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <div className="p-1 rounded-md bg-white/10 group-hover:bg-[#c48b28]/30 transition-colors">
              <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ecdcb9] shrink-0" />
            </div>
            <span className="group-hover:text-white transition-colors">4 Engineering Disciplines</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <div className="p-1 rounded-md bg-white/10 group-hover:bg-[#c48b28]/30 transition-colors">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ecdcb9] shrink-0" />
            </div>
            <span className="group-hover:text-white transition-colors">Shift 1 &amp; Shift 2 Programs</span>
          </div>
        </div>
      </Container>

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
                  <h4 className="font-bold text-base sm:text-lg truncate">{activeSlide.caption}</h4>
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
                  alt={activeSlide.caption}
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
