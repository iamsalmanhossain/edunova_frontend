"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

// 4 High-definition institutional campus & engineering images
const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop",
    title: "Institutional Academic Campus",
    caption: "Kishoreganj Polytechnic Institute Campus Infrastructure",
  },
  {
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop",
    title: "Modern Technical Grounds",
    caption: "Central Campus Grounds & Academic Complex",
  },
  {
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1920&auto=format&fit=crop",
    title: "Engineering Laboratories",
    caption: "Advanced Computing, Electronics & Mechanical Labs",
  },
  {
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop",
    title: "Academic Excellence & Graduation",
    caption: "Shaping Future Diploma Engineers for Industry 4.0",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section className="relative min-h-[500px] lg:min-h-[calc(100vh-6.75rem)] lg:h-[calc(100vh-6.75rem)] lg:max-h-[820px] flex flex-col justify-center overflow-hidden bg-[#073825]">
      {/* Background Images Slideshow Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          {HERO_SLIDES.map((slide, index) => {
            if (index !== currentSlide) return null;
            return (
              <motion.div
                key={slide.url}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.url}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Editorial Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#031c12]/95 via-[#063322]/85 to-[#063322]/65" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#031c12] via-transparent to-transparent opacity-80" />
      </div>

      <Container size="wide" className="relative z-30 py-6 sm:py-8 lg:py-10 my-auto w-full">
        <div className="max-w-4xl lg:max-w-5xl min-w-0">
          {/* Institutional Accreditation Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#0a4b32]/85 border border-[#c48b28]/40 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium mb-3 sm:mb-4 shadow-sm max-w-full"
          >
            <span className="w-2 h-2 rounded-full bg-[#c48b28] animate-pulse shrink-0" />
            <span className="text-[#fef8ec] font-semibold truncate">Institutional Campus</span>
            <span className="text-white/40 hidden xs:inline">•</span>
            <span className="text-white/80 hidden xs:inline truncate">Kishoreganj Polytechnic Institute</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.12] break-words"
          >
            Fostering <span className="text-[#ecdcb9]">Technical Excellence</span> &amp; Modern Engineering
          </motion.h1>

          {/* Subtitle / Intro */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm md:text-base lg:text-lg text-white/85 leading-relaxed font-normal max-w-3xl break-words"
          >
            Welcome to EduNova at Kishoreganj Polytechnic Institute. Empowering the next generation of engineers through rigorous technical curriculum, hands-on laboratories, and modern academic management.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5"
          >
            <Button
              asChild
              size="lg"
              className="bg-[#c48b28] hover:bg-[#b07b22] text-white font-bold px-5 sm:px-6 h-9.5 sm:h-11 text-xs sm:text-sm shadow-lg shadow-black/20"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                <span>Access Digital Campus</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 sm:px-6 h-9.5 sm:h-11 text-xs sm:text-sm backdrop-blur-xs"
            >
              <Link href="/campus" className="flex items-center justify-center gap-2">
                <Compass className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#ecdcb9] shrink-0" />
                <span>Explore Campus</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-white/15 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 text-white/85 text-[11px] sm:text-xs lg:text-sm"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <ShieldCheck className="w-4 h-4 text-[#ecdcb9] shrink-0" />
              <span className="truncate">BTEB Approved Curriculum</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <Building className="w-4 h-4 text-[#ecdcb9] shrink-0" />
              <span className="truncate">4 Engineering Disciplines</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 col-span-1 xs:col-span-2 sm:col-span-1 min-w-0">
              <Sparkles className="w-4 h-4 text-[#ecdcb9] shrink-0" />
              <span className="truncate">Shift 1 &amp; Shift 2 Programs</span>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Slideshow Controls & Indicator Bar */}
      <div className="absolute z-30 bottom-3 right-3 sm:bottom-5 sm:right-8 flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-white/15 scale-90 sm:scale-100 origin-bottom-right">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous image"
          className="text-white/70 hover:text-white transition-colors p-0.5 sm:p-1"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-4 sm:w-6 bg-[#c48b28]"
                  : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next image"
          className="text-white/70 hover:text-white transition-colors p-0.5 sm:p-1"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <span className="text-[10px] sm:text-[11px] font-mono text-white/60 pl-1 border-l border-white/20">
          0{currentSlide + 1}/0{HERO_SLIDES.length}
        </span>
      </div>
    </section>
  );
}
