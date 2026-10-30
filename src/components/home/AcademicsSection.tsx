"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Download,
  Layers,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";

interface AcademicFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  linkText: string;
  href: string;
  badge?: string;
}

const ACADEMIC_PILLARS: AcademicFeature[] = [
  {
    icon: Layers,
    title: "Semester-Based Curriculum",
    description:
      "A structured 8-semester sequence established under BTEB regulations, progressing from foundational mathematics and sciences to advanced branch engineering.",
    linkText: "View Academic System",
    href: "/academics",
    badge: "8 Semesters",
  },
  {
    icon: Clock,
    title: "Dual Shift Structure",
    description:
      "Operational flexibility with First Shift (8:00 AM - 1:15 PM) and Second Shift (1:30 PM - 6:45 PM), maximizing laboratory access and faculty mentorship.",
    linkText: "Explore Shift System",
    href: "/academics/routine",
    badge: "1st & 2nd Shift",
  },
  {
    icon: Calendar,
    title: "Institutional Calendar",
    description:
      "Comprehensive yearly schedules outlining semester registration, mid-term examinations, final practical assessments, and industrial attachment dates.",
    linkText: "View Academic Calendar",
    href: "/academics/calendar",
    badge: "Yearly Schedule",
  },
  {
    icon: Download,
    title: "Academic Resources & Syllabi",
    description:
      "Direct portal access to downloadable curriculum frameworks, subject syllabi, official lab manuals, and previous examination question archives.",
    linkText: "Access Downloads",
    href: "/academics/resources",
    badge: "Resource Library",
  },
];

export default function AcademicsSection() {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-white border-b border-[#e2e8e4]/70 overflow-hidden">
      <Container size="wide">
        <SectionHeading
          badge="Educational Framework"
          title="Academic Excellence & Structure"
          subtitle="Our structured polytechnic education combines standard technical guidelines, modern shift-based scheduling, and transparent academic resources."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {ACADEMIC_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="flex flex-col min-w-0"
              >
                <Card className="group h-full border border-[#e2e8e4] hover:border-[#0a4b32]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between bg-white rounded-xl">
                  <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f0f7f3] border border-[#0a4b32]/15 flex items-center justify-center text-[#0a4b32] group-hover:bg-[#0a4b32] group-hover:text-white transition-colors duration-300 shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      {pillar.badge && (
                        <span className="text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-[#fdf8ee] text-[#c48b28] border border-[#c48b28]/30">
                          {pillar.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors leading-snug break-words">
                        {pillar.title}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#5a6b62] leading-relaxed break-words">
                        {pillar.description}
                      </p>
                    </div>
                  </CardContent>

                  <div className="p-4 sm:p-6 pt-0 border-t border-[#e2e8e4]/60">
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0a4b32] hover:text-[#073825] group-hover:translate-x-1 transition-all"
                    >
                      <span>{pillar.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c48b28]" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
