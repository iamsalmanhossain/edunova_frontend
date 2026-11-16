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
  CheckCircle2,
  Image as ImageIcon,
  X,
  ChevronRight,
  ExternalLink,
  Laptop,
  UtensilsCrossed,
  Cpu,
  Snowflake,
  ShieldCheck,
  Download,
} from "lucide-react";
import { InstituteAbout } from "@/types/about";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
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
    desc: "Software development, networking, database engineering, and applied artificial intelligence.",
    href: "/departments/cst",
    icon: Laptop,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-700",
  },
  {
    code: "FOOD",
    title: "Food Technology",
    desc: "Food biochemistry, industrial processing, quality assurance, safety, and preservation.",
    href: "/departments/food",
    icon: UtensilsCrossed,
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-700",
  },
  {
    code: "ENT",
    title: "Electronics Technology",
    desc: "Telecommunications, microprocessors, embedded robotics, IoT, and circuit automation.",
    href: "/departments/ent",
    icon: Cpu,
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-700",
  },
  {
    code: "RAC",
    title: "Refrigeration & Air Conditioning",
    desc: "Commercial HVAC systems, industrial cooling plants, thermal dynamics, and cryogenic technology.",
    href: "/departments/rac",
    icon: Snowflake,
    color: "from-sky-500/10 to-indigo-500/10 border-sky-500/20 text-sky-700",
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
      {/* Top Breadcrumb & Header Bar */}
      <div className="border-b border-[#e2e8e4] bg-white">
        <Container size="wide" className="py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0a4b32] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-800 font-semibold">About Institute</span>
          </div>
        </Container>
      </div>

      {/* Hero Introduction Section */}
      <section className="pt-8 sm:pt-12 pb-6 bg-gradient-to-b from-white via-[#f4f8f5] to-[#fbfdfb]">
        <Container size="wide">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef5f1] border border-[#d6e6db] text-[#0a4b32] text-xs font-bold tracking-wide shadow-xs">
              <Building2 className="w-4 h-4 text-[#0a4b32]" />
              <span>Government Polytechnic Institute • BTEB 54049 • DTE Affiliated</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f1f17] tracking-tight leading-tight">
              {about.title}
            </h1>

            {about.tagline && (
              <p className="text-sm sm:text-base lg:text-lg text-[#47554f] max-w-2xl mx-auto leading-relaxed">
                {about.tagline}
              </p>
            )}

            {/* Quick Metadata Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs pt-1">
              {about.institute?.address && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#e2e8e4] text-[#47554f]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {about.institute.address}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#e2e8e4] text-[#47554f]">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                4 Diploma Engineering Departments
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#e2e8e4] text-[#47554f]">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Dual Shifts (1st &amp; 2nd Shift)
              </span>
              {about.institute?.website && (
                <a
                  href={about.institute.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#e2e8e4] text-emerald-700 hover:text-emerald-900 hover:border-emerald-300 font-medium transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  Official Portal
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              )}
            </div>
          </div>

          {/* Featured High-Visibility Banner Frame */}
          <div className="mt-8 max-w-5xl mx-auto">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#e2e8e4] bg-[#e6ede8] group">
              <div className="relative h-64 sm:h-[380px] lg:h-[440px] w-full">
                <Image
                  src={bannerSrc}
                  alt={about.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  onError={() => setBannerSrc(DEFAULT_BANNER)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Glassmorphic Campus Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/60 shadow-lg max-w-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0a4b32] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Award className="w-5 h-5 text-[#ecdcb9]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#0a4b32] truncate">
                        Academic Campus &amp; Workshops
                      </p>
                      <p className="text-[11px] text-[#5a6b62] truncate">
                        {about.institute?.name || "Kishoreganj Polytechnic Institute"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4 Core Institutional Pillars Bar */}
      <section className="py-8 bg-white border-y border-[#e2e8e4]/80">
        <Container size="wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="p-4 rounded-xl bg-[#fcfdfc] border border-[#e2e8e4] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#0f1f17]">4 Engineering Depts</h4>
                <p className="text-[11px] text-gray-500 truncate">CST, FOOD, ENT, RAC</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#fcfdfc] border border-[#e2e8e4] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#0f1f17]">8-Semester Curricula</h4>
                <p className="text-[11px] text-gray-500 truncate">4-Year BTEB Diploma</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#fcfdfc] border border-[#e2e8e4] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center shrink-0 border border-purple-200">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#0f1f17]">Dual Shift Operations</h4>
                <p className="text-[11px] text-gray-500 truncate">1st &amp; 2nd Shift Intake</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#fcfdfc] border border-[#e2e8e4] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#0f1f17]">BTEB Accredited</h4>
                <p className="text-[11px] text-gray-500 truncate">Industrial Internship</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <Container size="wide" className="mt-10 sm:mt-14 space-y-12">
        {/* Mission & Vision Strategic Cards */}
        {(about.mission || about.vision) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {about.mission && (
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-white border border-emerald-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-[#0a4b32] text-white flex items-center justify-center shadow-sm">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0f1f17]">
                  Our Institutional Mission
                </h3>
                <p className="text-xs sm:text-sm text-[#47554f] leading-relaxed">
                  {about.mission}
                </p>
              </div>
            )}

            {about.vision && (
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-white border border-amber-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0f1f17]">
                  Our Institutional Vision
                </h3>
                <p className="text-xs sm:text-sm text-[#47554f] leading-relaxed">
                  {about.vision}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div>
          <div className="flex items-center gap-2 border-b border-[#e2e8e4] overflow-x-auto pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("charter")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "charter"
                  ? "border-[#0a4b32] text-[#0a4b32]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Academic Charter &amp; Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("departments")}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "departments"
                  ? "border-[#0a4b32] text-[#0a4b32]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Layers className="w-4 h-4" />
              Our 4 Engineering Departments
            </button>

            {about.history && (
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === "history"
                    ? "border-[#0a4b32] text-[#0a4b32]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <History className="w-4 h-4" />
                Legacy &amp; History
              </button>
            )}

            {about.images && about.images.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === "gallery"
                    ? "border-[#0a4b32] text-[#0a4b32]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Campus Gallery ({about.images.length})
              </button>
            )}
          </div>

          {/* Tab 1: Formatted Markdown Documentation / Charter */}
          {activeTab === "charter" && (
            <div className="pt-6">
              <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e8e4] shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#e2e8e4]">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0f1f17]">
                      Curriculum Charter &amp; Technical Syllabus
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Accredited by Bangladesh Technical Education Board (BTEB)
                    </p>
                  </div>
                  <Badge className="bg-[#eef5f1] text-[#0a4b32] border-[#d6e6db]">
                    Verified Document
                  </Badge>
                </div>

                <MarkdownViewer content={about.content} />
              </div>
            </div>
          )}

          {/* Tab 2: 4 Core Engineering Departments Grid */}
          {activeTab === "departments" && (
            <div className="pt-6 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8e4] shadow-sm">
                <div className="max-w-2xl mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-[#0f1f17]">
                    Kishoreganj Polytechnic Institute's 4 Core Disciplines
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Equipped with modern laboratories, hands-on industrial machinery, and dual-shift instruction.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CORE_DEPARTMENTS.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <div
                        key={dept.code}
                        className={`p-5 rounded-xl border bg-gradient-to-br ${dept.color} flex flex-col justify-between transition-all hover:shadow-md`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black px-2 py-0.5 rounded bg-white/80 shadow-xs">
                              {dept.code}
                            </span>
                            <Icon className="w-5 h-5 opacity-80" />
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-[#0f1f17] mb-1.5">
                            {dept.title}
                          </h4>
                          <p className="text-xs text-[#47554f] leading-relaxed">
                            {dept.desc}
                          </p>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-black/5 mt-3">
                          <span className="text-[11px] font-semibold text-gray-600">
                            1st &amp; 2nd Shift
                          </span>
                          <Link
                            href={dept.href}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0a4b32] hover:underline"
                          >
                            Explore Department
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: History & Pedagogical Evolution */}
          {activeTab === "history" && about.history && (
            <div className="pt-6">
              <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e8e4] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0a4b32] text-white flex items-center justify-center shrink-0">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0f1f17]">
                      Historical Heritage &amp; Evolution
                    </h3>
                    <p className="text-xs text-gray-500">
                      Decades of technical leadership across Dhaka Division
                    </p>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-[#47554f] leading-relaxed whitespace-pre-line pt-2 pl-1 border-l-2 border-[#0a4b32]/30 ml-4">
                  {about.history}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Campus Photo Gallery with Interactive Lightbox */}
          {activeTab === "gallery" && about.images && about.images.length > 0 && (
            <div className="pt-6 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8e4] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0f1f17]">
                      Campus Facilities &amp; Student Laboratories
                    </h3>
                    <p className="text-xs text-gray-500">
                      Click any photo to view full size
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs text-gray-600">
                    {about.images.length} Photos
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {about.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImage(imgUrl)}
                      className="relative h-44 sm:h-52 rounded-xl overflow-hidden border border-[#e2e8e4] shadow-xs group cursor-pointer bg-gray-100"
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
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/40">
                          View Photo
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA Box */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#0a4b32] to-[#073222] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Begin Your Engineering Journey at KIPI
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Explore our 4 accredited 4-year Diploma in Engineering departments, state-of-the-art laboratory workshops, and centralized digital campus portal.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="bg-white hover:bg-gray-100 text-[#0a4b32] font-bold text-xs h-9 px-5 shadow-sm">
                <Link href="/departments">View 4 Core Departments</Link>
              </Button>
              <Button asChild variant="outline" className="border-emerald-300/40 text-emerald-100 hover:bg-emerald-800/40 text-xs h-9 px-5">
                <Link href="/people">Meet Leadership &amp; Faculty</Link>
              </Button>
            </div>
          </div>
        </section>
      </Container>

      {/* Lightbox Modal Dialog */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] bg-[#0c1611] rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between p-3.5 bg-black/40 border-b border-white/10 text-white text-xs">
              <span className="font-semibold text-emerald-300">
                Kishoreganj Polytechnic Institute • Campus Gallery
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
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
