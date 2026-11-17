"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Code2,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Server,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  GraduationCap,
  Terminal,
} from "lucide-react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/shared/Icons";
import { DeveloperProfile } from "@/types/developer";

interface PublicDeveloperClientProps {
  initialProfile: DeveloperProfile;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const ARCHITECTURE_PILLARS = [
  {
    icon: Layers,
    title: "Dual-Shift Scheduling Engine",
    description:
      "Engineered independent class routines, separate teacher assignments, and dedicated attendance registers for 1st & 2nd shift intakes without schedule collision.",
  },
  {
    icon: Database,
    title: "Automated SGPA & CGPA Engine",
    description:
      "Automated 8-semester continuous practical and theoretical marks aggregation according to strict BTEB grading policies with instantaneous report card generation.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Tier Governance & RBAC",
    description:
      "Fine-grained perimeter access control spanning Super Admins, Campus Administrators, Heads of Departments, Faculty, and Student self-claim portals.",
  },
  {
    icon: Server,
    title: "Disaster Recovery & Replication",
    description:
      "Automated twice-daily AES-256-GCM encrypted database dumps with Google Drive cloud synchronization and 30-day snapshot retention pruning.",
  },
];

export default function PublicDeveloperClient({
  initialProfile,
}: PublicDeveloperClientProps) {
  const [profile] = useState<DeveloperProfile>(initialProfile);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fafbfa] overflow-hidden pb-20 sm:pb-28">
      {/* Background Animated Ambient Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#0a4b32]/30 to-emerald-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -top-20 right-1/4 w-[450px] h-[450px] bg-gradient-to-bl from-amber-400/15 to-[#0a4b32]/20 rounded-full blur-3xl"
        />
      </div>

      <Container size="wide" className="relative z-10 pt-12 sm:pt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-12 sm:space-y-16"
        >
          {/* Section 1: Hero Profile Card */}
          <motion.div variants={itemVariants}>
            <div className="relative rounded-3xl bg-white border border-[#e2e8e4] p-6 sm:p-10 shadow-xl overflow-hidden backdrop-blur-md">
              {/* Subtle card glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/60 via-transparent to-transparent pointer-events-none rounded-tr-3xl" />

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10 text-center md:text-left">
                {/* Avatar with Halo Animation */}
                <div className="relative shrink-0">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#0a4b32] via-emerald-400 to-[#c48b28] opacity-75 blur-md"
                  />
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden ring-4 ring-white bg-[#0a4b32] shadow-2xl">
                    {profile.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.name}
                        fill
                        priority
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <Code2 className="w-16 h-16 text-[#ecdcb9]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  {/* Status Pill */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    {profile.isAvailableForHire && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Available for Architecture &amp; System Contracts</span>
                      </span>
                    )}
                    <Badge variant="gold" className="text-xs uppercase font-extrabold tracking-wider">
                      Platform Architect
                    </Badge>
                  </div>

                  {/* Name & Title */}
                  <div className="space-y-1.5">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0f1f17] tracking-tight">
                      {profile.name}
                    </h1>
                    <p className="text-base sm:text-lg font-bold text-[#0a4b32] bg-gradient-to-r from-[#0a4b32] to-emerald-600 bg-clip-text text-transparent">
                      {profile.title}
                    </p>
                  </div>

                  {profile.tagline && (
                    <p className="text-xs sm:text-sm font-medium text-[#5a6b62] bg-[#f8faf8] px-3.5 py-2 rounded-xl border border-[#e2e8e4] inline-block">
                      {profile.tagline}
                    </p>
                  )}

                  {/* Social & Contact Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                    {profile.githubUrl && (
                      <Button asChild variant="outline" size="sm" className="h-10 px-4 rounded-xl text-xs font-bold gap-2">
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                          <GithubIcon className="w-4 h-4" />
                          <span>GitHub</span>
                        </a>
                      </Button>
                    )}

                    {profile.linkedinUrl && (
                      <Button asChild variant="outline" size="sm" className="h-10 px-4 rounded-xl text-xs font-bold gap-2">
                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 text-[#0a4b32]" />
                          <span>LinkedIn</span>
                        </a>
                      </Button>
                    )}

                    {profile.portfolioUrl && (
                      <Button asChild variant="outline" size="sm" className="h-10 px-4 rounded-xl text-xs font-bold gap-2">
                        <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 text-[#0a4b32]" />
                          <span>Portfolio Website</span>
                        </a>
                      </Button>
                    )}

                    {profile.email && (
                      <Button
                        type="button"
                        onClick={handleCopyEmail}
                        variant="secondary"
                        size="sm"
                        className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Email Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#5a6b62]" />
                            <span>{profile.email}</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio & System Motivation */}
              <div className="mt-8 pt-8 border-t border-[#e2e8e4] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0a4b32]">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>The Vision Behind bdEduNova</span>
                </div>
                <div className="text-sm sm:text-base text-[#47574e] leading-relaxed space-y-3 font-normal whitespace-pre-line">
                  {profile.bio}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Four Architectural Pillars */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0a4b32]">
                Architectural Breakdown
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f17]">
                Engineered for High-Stakes Institutional Reliability
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ARCHITECTURE_PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 rounded-2xl bg-white border border-[#e2e8e4] hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all space-y-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#0a4b32] flex items-center justify-center shadow-xs">
                      <IconComponent className="w-5 h-5 text-emerald-700" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0f1f17]">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-[#5a6b62] leading-relaxed">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Section 3: Tech Stack Matrix with Micro-Interactions */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0a4b32]">
                Full Stack Arsenal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1f17]">
                Production-Proven Technology Stack
              </h2>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2e8e4] shadow-md space-y-6">
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {profile.skills.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-[#f0f7f3] border border-emerald-200/80 text-[#0a4b32] text-xs sm:text-sm font-bold shadow-2xs flex items-center gap-2 cursor-default"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{skill}</span>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#f0f4f1] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-xl bg-[#fafbfa] border border-[#e2e8e4]">
                  <span className="text-xl sm:text-2xl font-black text-[#0a4b32]">2,800+</span>
                  <p className="text-[11px] font-semibold text-[#5a6b62] uppercase tracking-wide">Students Supported</p>
                </div>
                <div className="p-3 rounded-xl bg-[#fafbfa] border border-[#e2e8e4]">
                  <span className="text-xl sm:text-2xl font-black text-[#0a4b32]">4</span>
                  <p className="text-[11px] font-semibold text-[#5a6b62] uppercase tracking-wide">Diploma Departments</p>
                </div>
                <div className="p-3 rounded-xl bg-[#fafbfa] border border-[#e2e8e4]">
                  <span className="text-xl sm:text-2xl font-black text-[#0a4b32]">100%</span>
                  <p className="text-[11px] font-semibold text-[#5a6b62] uppercase tracking-wide">Automated SGPA/CGPA</p>
                </div>
                <div className="p-3 rounded-xl bg-[#fafbfa] border border-[#e2e8e4]">
                  <span className="text-xl sm:text-2xl font-black text-[#0a4b32]">0ms</span>
                  <p className="text-[11px] font-semibold text-[#5a6b62] uppercase tracking-wide">Schedule Conflicts</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Hire Developer / Contract Inquiry CTA */}
          <motion.div variants={itemVariants}>
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0a4b32] via-[#073624] to-[#041d14] text-white p-8 sm:p-12 shadow-2xl overflow-hidden">
              {/* Background ambient pattern */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold tracking-wide border border-white/15">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Engineering Consultation &amp; System Development</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Have a Complex System, LMS, or SaaS Platform to Build?
                  </h3>

                  <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
                    Collaborate directly with Md Salman Hossain for enterprise web architecture, custom educational management systems, high-concurrency database design, and cloud deployments.
                  </p>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
                  {profile.email && (
                    <Button
                      asChild
                      className="h-12 px-6 rounded-xl bg-white hover:bg-emerald-50 text-[#0a4b32] font-bold text-sm shadow-lg hover:shadow-xl transition"
                    >
                      <a href={`mailto:${profile.email}?subject=Enterprise%20System%20Architecture%20Inquiry`}>
                        <Mail className="w-4 h-4 mr-2" />
                        <span>Initiate Direct Inquiry</span>
                      </a>
                    </Button>
                  )}

                  {profile.portfolioUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 px-6 rounded-xl border-white/30 text-white hover:bg-white/10 font-semibold text-sm transition"
                    >
                      <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <span>Visit Personal Portfolio</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
