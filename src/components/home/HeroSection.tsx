"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Camera,
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
    caption: "Main administrative & academic campus building",
    badge: "Main Campus Building",
  },
  {
    url: "/images/hero/kipi-gate.jpg",
    title: "KIPI Main Campus Gate",
    caption: "Official entrance gateway of Kishoreganj Polytechnic Institute",
    badge: "Campus Entrance",
  },
  {
    url: "/images/hero/kipi-aerial.jpg",
    title: "Vibrant Campus Landscape",
    caption: "Panoramic aerial view of grounds & academic complex",
    badge: "Aerial Landscape",
  },
  {
    url: "/images/hero/kipi-ground.jpg",
    title: "Campus Ground & Garden",
    caption: "Open green grounds, scenic gardens & walkways",
    badge: "Green Grounds",
  },
  {
    url: "/images/hero/kipi-academic.jpg",
    title: "Technical Labs & Academic Wing",
    caption: "Modern engineering classrooms & laboratory facilities",
    badge: "Academic Wing",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-advance slides every 5.5 seconds unless paused or modal is open
  useEffect(() => {
    if (isPaused || isLightboxOpen) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, isLightboxOpen, nextSlide]);

  // Handle keyboard events for lightbox
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

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#041f15] via-[#073825] to-[#031810] text-white">
      {/* Ambient background lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#0a5237]/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#c48b28]/15 blur-3xl" />
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

          {/* Right Column: Dedicated Full-Visibility Image Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 xl:col-span-5 w-full flex flex-col items-center"
          >
            <div
              className="relative w-full rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 bg-gradient-to-b from-white/15 via-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-2xl shadow-black/50"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Native 4:3 Aspect Ratio Frame: Image is completely visible without severe cropping */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#03170e]">
                {/* Soft ambient background blur */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={activeSlide.url}
                    alt={activeSlide.title}
                    fill
                    className="object-cover blur-2xl opacity-40 scale-125"
                    sizes="500px"
                  />
                </div>

                {/* Main Active Foreground Image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.url}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 z-10 cursor-pointer group"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <Image
                      src={activeSlide.url}
                      alt={activeSlide.title}
                      fill
                      priority={currentSlide === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      className="object-contain sm:object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    {/* Bottom subtle contrast gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Top Overlay Bar */}
                <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-20 flex items-center justify-between pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[#fef8ec] font-semibold">{activeSlide.badge}</span>
                  </div>

                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white/90 text-[11px] font-mono shadow-sm">
                      {String(currentSlide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="w-7 h-7 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black/90 hover:border-white/40 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      title="View Fullscreen"
                      aria-label="View Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Caption & Navigation Controls */}
                <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-20 flex items-end justify-between gap-2.5 pointer-events-none">
                  <div className="min-w-0 pr-2">
                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight drop-shadow-md truncate">
                      {activeSlide.title}
                    </h3>
                    <p className="text-white/80 text-[11px] sm:text-xs drop-shadow-sm truncate mt-0.5">
                      {activeSlide.caption}
                    </p>
                  </div>

                  {/* Previous & Next Control Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/25 text-white hover:bg-[#c48b28] hover:border-[#c48b28] flex items-center justify-center transition-all cursor-pointer shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/25 text-white hover:bg-[#c48b28] hover:border-[#c48b28] flex items-center justify-center transition-all cursor-pointer shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 5 Clickable Mini Thumbnails Row directly underneath the image */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-2 sm:mt-2.5">
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <button
                      key={slide.url}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`relative aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "ring-2 ring-[#c48b28] shadow-md shadow-[#c48b28]/40 scale-[1.03] opacity-100"
                          : "opacity-60 hover:opacity-100 hover:scale-[1.02] border border-white/15"
                      }`}
                      aria-label={`View ${slide.title}`}
                    >
                      <Image
                        src={slide.url}
                        alt={slide.title}
                        fill
                        sizes="120px"
                        className="object-cover object-center"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-[#c48b28]/15" />
                      )}
                    </button>
                  );
                })}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header Bar */}
              <div className="w-full flex items-center justify-between text-white pb-3 px-1">
                <div className="min-w-0 pr-4">
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
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
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
