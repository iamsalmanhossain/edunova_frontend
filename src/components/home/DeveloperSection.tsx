"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, ArrowRight, Code2, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { GithubIcon } from "@/components/shared/Icons";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeveloperProfile } from "@/types/developer";
import { developerService, VERIFIED_DEVELOPER_PROFILE } from "@/services/developer.service";

export default function DeveloperSection() {
  const [profile, setProfile] = useState<DeveloperProfile>(VERIFIED_DEVELOPER_PROFILE);

  useEffect(() => {
    developerService.getDeveloper().then((data) => {
      if (data && data.name) {
        setProfile(data);
      }
    });
  }, []);

  return (
    <section className="py-14 sm:py-20 bg-[#f6faf7] border-b border-[#e2e8e4]/70 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto min-w-0"
        >
          <Card className="border border-[#0a4b32]/25 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden rounded-3xl relative">
            {/* Top decorative gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#0a4b32] via-emerald-400 to-[#c48b28]" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-10 items-center">
              {/* Developer Avatar / Icon with Animated Halo */}
              <div className="md:col-span-4 flex flex-col items-center text-center min-w-0">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-[#0a4b32] to-emerald-400 opacity-60 blur-xs"
                  />
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-white bg-[#0a4b32] flex items-center justify-center text-white shadow-md">
                    {profile.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.name}
                        fill
                        sizes="144px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center p-3 sm:p-4">
                        <Code2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-[#ecdcb9] mb-1" />
                        <span className="text-xs sm:text-sm font-bold tracking-tight text-white block">
                          Architect
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-col items-center gap-1.5">
                  <Badge variant="gold" className="text-[11px] font-extrabold uppercase tracking-wider">
                    Platform Architect
                  </Badge>
                  {profile.isAvailableForHire && (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      🟢 Available for Contracts
                    </span>
                  )}
                </div>
              </div>

              {/* Developer Info */}
              <div className="md:col-span-8 space-y-3 min-w-0 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#0a4b32] inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Meet the Software Architect</span>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f17] tracking-tight">
                  {profile.name}
                </h3>

                <p className="text-xs sm:text-sm font-bold text-[#0a4b32] bg-gradient-to-r from-[#0a4b32] to-emerald-600 bg-clip-text text-transparent">
                  {profile.title}
                </p>

                <p className="text-xs sm:text-sm text-[#5a6b62] leading-relaxed line-clamp-3 font-normal">
                  {profile.bio}
                </p>

                {/* Skills badges */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-1.5 pt-1">
                    {profile.skills.slice(0, 5).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Verified Links & CTA */}
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                  {profile.githubUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-[#dce3df] text-[#0f1f17] hover:bg-[#f0f7f3] text-xs h-9 rounded-xl"
                    >
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    </Button>
                  )}

                  {profile.portfolioUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-[#dce3df] text-[#0f1f17] hover:bg-[#f0f7f3] text-xs h-9 rounded-xl"
                    >
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#0a4b32]" />
                        <span>Portfolio</span>
                      </a>
                    </Button>
                  )}

                  <Button
                    asChild
                    size="sm"
                    className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs"
                  >
                    <Link href="/developer" className="inline-flex items-center justify-center gap-1.5">
                      <span>Full Architect Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
