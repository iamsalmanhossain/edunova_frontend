"use client";

import React, { useState } from "react";
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

export default function PublicAboutView({ about }: PublicAboutViewProps) {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const banner =
    about.bannerUrl ||
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="pb-20">
      {/* Hero Section with Institutional Banner */}
      <section className="relative bg-[#071d13] text-white pt-12 pb-20 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={banner}
            alt={about.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071d13] via-[#071d13]/80 to-transparent" />
        </div>

        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span>Government Polytechnic Institute • BTEB Affiliated</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {about.title}
            </h1>

            {about.tagline && (
              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
                {about.tagline}
              </p>
            )}

            {about.institute && (
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/80 pt-2">
                {about.institute.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {about.institute.address}
                  </span>
                )}
                {about.institute.code && (
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    Code: {about.institute.code}
                  </span>
                )}
                {about.institute.website && (
                  <a
                    href={about.institute.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-300 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Official Portal
                  </a>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-10 px-5 shadow-lg shadow-emerald-950/40">
                <Link href="/departments">
                  Explore 4 Departments
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-emerald-500/40 text-emerald-100 hover:bg-emerald-900/40 text-xs h-10 px-5">
                <Link href="/people">
                  Meet Faculty &amp; Leadership
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Highlights Strip */}
      <div className="relative -mt-8 z-20">
        <Container size="wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#e2e8e4] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#eef5f1] text-[#0a4b32] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-[#0f1f17]">4 Departments</p>
                <p className="text-[11px] text-gray-500">CST, Food, ENT, RAC</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8e4] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-[#0f1f17]">8 Semesters</p>
                <p className="text-[11px] text-gray-500">4-Year Diploma in Engg.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8e4] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-[#0f1f17]">Dual Shifts</p>
                <p className="text-[11px] text-gray-500">1st &amp; 2nd Shift Intake</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8e4] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-[#0f1f17]">BTEB Accredited</p>
                <p className="text-[11px] text-gray-500">Industry-Ready Practical Lab</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container size="wide" className="mt-14 space-y-14">
        {/* Mission & Vision Section */}
        {(about.mission || about.vision) && (
          <section className="space-y-6">
            <SectionHeading
              badge="Institutional Purpose"
              title="Guiding Vision &amp; Foundational Mission"
              subtitle="The driving pedagogical pillars steering technical excellence and ethical leadership."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {about.mission && (
                <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-white border border-emerald-200/80 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-900/10">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0f1f17]">
                    Our Mission
                  </h3>
                  <p className="text-xs sm:text-sm text-[#47554f] leading-relaxed">
                    {about.mission}
                  </p>
                </div>
              )}

              {about.vision && (
                <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-white border border-amber-200/80 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-900/10">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0f1f17]">
                    Our Vision
                  </h3>
                  <p className="text-xs sm:text-sm text-[#47554f] leading-relaxed">
                    {about.vision}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* History / Legacy Section */}
        {about.history && (
          <section className="space-y-6">
            <SectionHeading
              badge="Legacy &amp; Roots"
              title="Historical Heritage &amp; Evolution"
              subtitle="Decades of technical education fostering mid-level engineering leaders across Bangladesh."
            />

            <div className="bg-[#fcfdfc] p-6 sm:p-8 rounded-2xl border border-[#e2e8e4] shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#0a4b32] text-white flex items-center justify-center shrink-0">
                <History className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <h4 className="text-base sm:text-lg font-bold text-[#0f1f17]">
                  Foundational Journey
                </h4>
                <p className="text-xs sm:text-sm text-[#47554f] leading-relaxed whitespace-pre-line">
                  {about.history}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Formatted Markdown Content / Documentation */}
        {about.content && (
          <section className="space-y-6">
            <SectionHeading
              badge="Institutional Overview"
              title="Academic Curriculum &amp; Institutional Charter"
              subtitle="Comprehensive curriculum structure, technical workshops, and laboratory documentation."
            />

            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e8e4] shadow-sm">
              <MarkdownViewer content={about.content} />
            </div>
          </section>
        )}

        {/* Campus Gallery */}
        {about.images && about.images.length > 0 && (
          <section className="space-y-6">
            <SectionHeading
              badge="Visual Highlights"
              title="Campus Labs, Facilities &amp; Student Life"
              subtitle="Modern engineering workshops, research facilities, and dynamic campus environment."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {about.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGalleryImage(imgUrl)}
                  className="relative h-44 sm:h-52 rounded-xl overflow-hidden border border-[#e2e8e4] shadow-sm group cursor-pointer bg-gray-100"
                >
                  <Image
                    src={imgUrl}
                    alt={`Campus facility ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA Box */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#0a4b32] to-[#073222] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Begin Your Engineering Journey at KIPI
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Explore our 4 accredited 4-year Diploma in Engineering departments, modern laboratory workshops, and centralized digital campus portal.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="bg-white hover:bg-gray-100 text-[#0a4b32] font-bold text-xs h-9 px-5 shadow-sm">
                <Link href="/departments">View All 4 Departments</Link>
              </Button>
              <Button asChild variant="outline" className="border-emerald-300/40 text-emerald-100 hover:bg-emerald-800/40 text-xs h-9 px-5">
                <Link href="/contact">Contact Administration</Link>
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
