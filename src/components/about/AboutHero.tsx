"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Award,
  Globe,
  ExternalLink,
  ArrowRight,
  Users,
} from "lucide-react";
import { InstituteAbout } from "@/types/about";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

interface AboutHeroProps {
  about: InstituteAbout;
  bannerSrc: string;
  onBannerError: () => void;
}

export default function AboutHero({
  about,
  bannerSrc,
  onBannerError,
}: AboutHeroProps) {
  return (
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
          onError={onBannerError}
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

          {/* Action Buttons: Full Contrast & Mobile-First Stacked */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 sm:pt-4 w-full sm:w-auto">
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm h-11 px-6 shadow-lg shadow-emerald-950/50 active:scale-[0.98] transition-all w-full sm:w-auto justify-center"
            >
              <Link href="/departments" className="flex items-center justify-center gap-2">
                <span>Explore 4 Departments</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

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
  );
}
