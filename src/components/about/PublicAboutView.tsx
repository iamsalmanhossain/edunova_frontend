"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Compass,
  Sparkles,
  History,
  GraduationCap,
  Award,
  Layers,
  Users,
  MapPin,
  Globe,
  ArrowRight,
  BookOpen,
  Image as ImageIcon,
  X,
  ChevronRight,
  ExternalLink,
  Laptop,
  UtensilsCrossed,
  Cpu,
  Snowflake,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { InstituteAbout } from "@/types/about";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MarkdownViewer from "@/components/shared/MarkdownViewer";

interface PublicAboutViewProps {
  about: InstituteAbout;
}

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop";

const CORE_DEPARTMENTS = [
  {
    code: "CST",
    title: "Computer Science & Technology",
    desc: "Software development, networking, database systems, cybersecurity, and applied AI.",
    href: "/departments/cst",
    icon: Laptop,
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    theme: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
  },
  {
    code: "FOOD",
    title: "Food Technology",
    desc: "Food biochemistry, industrial processing, quality assurance, safety compliance, and preservation.",
    href: "/departments/food",
    icon: UtensilsCrossed,
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    theme: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
  },
  {
    code: "ENT",
    title: "Electronics Technology",
    desc: "Telecommunications, microprocessors, embedded robotics, IoT circuits, and industrial automation.",
    href: "/departments/ent",
    icon: Cpu,
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    theme: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
  },
  {
    code: "RAC",
    title: "Refrigeration & Air Conditioning",
    desc: "Commercial HVAC systems, industrial cooling plants, thermal dynamics, and cryogenic technology.",
    href: "/departments/rac",
    icon: Snowflake,
    badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
    theme: "from-sky-500/10 to-indigo-500/10 border-sky-500/20",
  },
];

export default function PublicAboutView({ about }: PublicAboutViewProps) {
  const [activeTab, setActiveTab] = useState<"charter" | "departments" | "history" | "gallery">("charter");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [bannerSrc, setBannerSrc] = useState<string>(about.bannerUrl || DEFAULT_BANNER);

  // Sync banner if prop changes
  useEffect(() => {
    if (about.bannerUrl) {
      setBannerSrc(about.bannerUrl);
    }
  }, [about.bannerUrl]);

  // Handle ESC key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    if (lightboxImage) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  return (
    <div className="pb-24 bg-[#fbfdfb]">
      {/* 1. Immersive Hero Section with Dark Green Theme & Clear High-Contrast Buttons */}
      <section className="relative bg-[#071d13] text-white pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src={bannerSrc}
            alt={about.title}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
            onError={() => setBannerSrc(DEFAULT_BANNER)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071d13] via-[#071d13]/85 to-transparent" />
        </div>

        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] sm:text-xs font-bold tracking-wide backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate">Government Polytechnic Institute • BTEB 54049</span>
            </div>

            {/* Page Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {about.title}
            </h1>

            {/* Tagline / Subtitle */}
            {about.tagline && (
              <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
                {about.tagline}
              </p>
            )}

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-emerald-200/90 pt-1">
              {about.institute?.address && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 border border-white/15 backdrop-blur-sm">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{about.institute.address}</span>
                </span>
              )}
              {about.institute?.code && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 border border-white/15 backdrop-blur-sm">
                  <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Code: {about.institute.code}
                </span>
              )}
              {about.institute?.website && (
                <a
                  href={about.institute.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-200 hover:text-white backdrop-blur-sm transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Official Portal
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              )}
            </div>

            {/* Hero Action Buttons - Completely High Contrast & Mobile-First Stacked */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 sm:pt-4 w-full sm:w-auto">
              {/* Primary Button: Solid Emerald */}
              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm h-11 px-6 shadow-lg shadow-emerald-950/50 active:scale-[0.98] transition-all w-full sm:w-auto justify-center"
              >
                <Link href="/departments" className="flex items-center justify-center gap-2">
                  <span>Explore 4 Departments</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              {/* Secondary Button: Frosted Glass with Bright White Text & High Contrast */}
              <Button
                asChild
                className="bg-white/15 hover:bg-white/25 text-white hover:text-white border-2 border-white/40 hover:border-white/60 backdrop-blur-md font-semibold text-xs sm:text-sm h-11 px-6 shadow-sm active:scale-[0.98] transition-all w-full sm:w-auto justify-center"
              >
                <Link href="/people" className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-emerald-300" />
                  <span>Meet Faculty &amp; Leadership</span>
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Overlapping Metrics Bar (2x2 on Mobile, 4 Cols on Desktop) */}
      <div className="relative -mt-6 sm:-mt-10 z-20">
        <Container size="wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#e2e8e4] shadow-sm flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#eef5f1] text-[#0a4b32] flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-base font-extrabold text-[#0f1f17]">4 Departments</p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">CST, FOOD, ENT, RAC</p>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#e2e8e4] shadow-sm flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-base font-extrabold text-[#0f1f17]">8 Semesters</p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">4-Year BTEB Diploma</p>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#e2e8e4] shadow-sm flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-base font-extrabold text-[#0f1f17]">Dual Shifts</p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">1st &amp; 2nd Shift Intake</p>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#e2e8e4] shadow-sm flex items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-base font-extrabold text-[#0f1f17]">BTEB Accredited</p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">Practical Engineering</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container size="wide" className="mt-8 sm:mt-14 space-y-10 sm:space-y-14">
        {/* 3. Mission & Vision Strategic Cards */}
        {(about.mission || about.vision) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {about.mission && (
              <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-white border border-emerald-200/80 shadow-xs space-y-2.5 sm:space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a4b32] text-white flex items-center justify-center shadow-xs">
                  <Compass className="w-5 h-5 text-emerald-200" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-[#0f1f17]">
                  Our Institutional Mission
                </h3>
                <p className="text-xs sm:text-sm text-[#47554f] leading-relaxed">
                  {about.mission}
                </p>
              </div>
            )}

            {about.vision && (
              <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-white border border-amber-200/80 shadow-xs space-y-2.5 sm:space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-amber-200" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-[#0f1f17]">
                  Our Institutional Vision
                </h3>
                <p className="text-xs sm:text-sm text-[#47554f] leading-relaxed">
                  {about.vision}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 4. Prominent Campus Photograph Frame (Full Color & High Resolution) */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#e2e8e4] bg-[#e6ede8] group">
          <div className="relative h-56 sm:h-80 lg:h-[420px] w-full">
            <Image
              src={bannerSrc}
              alt={about.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              onError={() => setBannerSrc(DEFAULT_BANNER)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Floating Info Badge */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/60 shadow-lg max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0a4b32] text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-[#ecdcb9]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0a4b32] truncate">
                    Academic Campus &amp; Labs
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#5a6b62] truncate">
                    {about.institute?.name || "Kishoreganj Polytechnic Institute"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Mobile-Optimized Tab Slider Navigation */}
        <div className="space-y-6">
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#e2e8e4] pb-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              type="button"
              onClick={() => setActiveTab("charter")}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "charter"
                  ? "bg-[#0a4b32] text-white shadow-xs"
                  : "bg-gray-100/90 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Charter</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("departments")}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "departments"
                  ? "bg-[#0a4b32] text-white shadow-xs"
                  : "bg-gray-100/90 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>4 Departments</span>
            </button>

            {about.history && (
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === "history"
                    ? "bg-[#0a4b32] text-white shadow-xs"
                    : "bg-gray-100/90 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Legacy &amp; History</span>
              </button>
            )}

            {about.images && about.images.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === "gallery"
                    ? "bg-[#0a4b32] text-white shadow-xs"
                    : "bg-gray-100/90 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Gallery ({about.images.length})</span>
              </button>
            )}
          </div>

          {/* Tab 1: Formatted Markdown Documentation */}
          {activeTab === "charter" && (
            <div className="bg-white p-4 sm:p-8 lg:p-10 rounded-2xl border border-[#e2e8e4] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#e2e8e4]">
                <div>
                  <h3 className="text-sm sm:text-lg font-bold text-[#0f1f17]">
                    Curriculum Charter &amp; Technical Syllabus
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    Affiliated with Bangladesh Technical Education Board (BTEB)
                  </p>
                </div>
                <Badge className="bg-[#eef5f1] text-[#0a4b32] border-[#d6e6db] text-[10px] sm:text-xs self-start sm:self-auto">
                  Official Publication
                </Badge>
              </div>

              <MarkdownViewer content={about.content} />
            </div>
          )}

          {/* Tab 2: 4 Core Engineering Departments Grid */}
          {activeTab === "departments" && (
            <div className="bg-white p-4 sm:p-8 rounded-2xl border border-[#e2e8e4] shadow-xs space-y-5">
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-[#0f1f17]">
                  Our 4 Accredited Engineering Disciplines
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                  Practical lab practicums, industry-grade machinery, and dual-shift instruction.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {CORE_DEPARTMENTS.map((dept) => {
                  const Icon = dept.icon;
                  return (
                    <div
                      key={dept.code}
                      className={`p-4 sm:p-5 rounded-xl border bg-gradient-to-br ${dept.theme} flex flex-col justify-between transition-all hover:shadow-sm`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className={`text-[11px] font-black px-2 py-0.5 rounded border ${dept.badgeColor}`}>
                            {dept.code}
                          </span>
                          <Icon className="w-5 h-5 opacity-80" />
                        </div>
                        <h4 className="text-xs sm:text-base font-bold text-[#0f1f17] mb-1">
                          {dept.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#47554f] leading-relaxed">
                          {dept.desc}
                        </p>
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-black/5 mt-3">
                        <span className="text-[10px] sm:text-[11px] font-semibold text-gray-600">
                          1st &amp; 2nd Shift
                        </span>
                        <Link
                          href={dept.href}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0a4b32] hover:underline"
                        >
                          Explore <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: History & Pedagogical Evolution */}
          {activeTab === "history" && about.history && (
            <div className="bg-white p-4 sm:p-8 rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a4b32] text-white flex items-center justify-center shrink-0">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-bold text-[#0f1f17]">
                    Historical Heritage &amp; Evolution
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Decades of mid-level engineering education in Kishoreganj
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-[#47554f] leading-relaxed whitespace-pre-line pt-2 pl-3 border-l-2 border-[#0a4b32]/40">
                {about.history}
              </div>
            </div>
          )}

          {/* Tab 4: Campus Photo Gallery with Interactive Lightbox */}
          {activeTab === "gallery" && about.images && about.images.length > 0 && (
            <div className="bg-white p-4 sm:p-8 rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-lg font-bold text-[#0f1f17]">
                    Campus Facilities &amp; Student Laboratories
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500">
                    Tap any photo to view full screen
                  </p>
                </div>
                <Badge variant="outline" className="text-xs text-gray-600">
                  {about.images.length} Photos
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {about.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxImage(imgUrl)}
                    className="relative h-36 sm:h-48 rounded-xl overflow-hidden border border-[#e2e8e4] shadow-xs group cursor-pointer bg-gray-100"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Campus facility ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/40">
                        View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. Bottom CTA Box - Both Buttons Crystal Clear & 100% Legible */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#0a4b32] to-[#073222] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Begin Your Engineering Journey at KIPI
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
      </Container>

      {/* 7. Interactive Lightbox Modal Dialog (Mobile Friendly Full Screen) */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[92vh] bg-[#0c1611] rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 bg-black/50 border-b border-white/10 text-white text-xs">
              <span className="font-semibold text-emerald-300 truncate">
                Kishoreganj Polytechnic Institute • Campus Facility View
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors ml-2 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image Frame */}
            <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black">
              <Image
                src={lightboxImage}
                alt="Enlarged Campus Facility View"
                fill
                unoptimized
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
