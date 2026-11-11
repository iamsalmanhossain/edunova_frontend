"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Award } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import CountUp from "@/components/shared/CountUp";

export default function InstituteOverview() {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-[#fcfdfc] border-b border-[#e2e8e4]/70 overflow-hidden">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column: Campus Photograph with Editorial Framing */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 min-w-0"
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer decorative border */}
              <div className="absolute -top-3 -left-3 w-full h-full border-2 border-[#0a4b32]/15 rounded-3xl -z-10 hidden sm:block" />

              <div className="relative h-64 sm:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-[#e2e8e4] bg-[#e6ede8] group">
                <Image
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop"
                  alt="Kishoreganj Polytechnic Institute Academic Campus and Grounds"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating Institutional Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-[#e2e8e4] shadow-lg max-w-xs"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0a4b32] text-white flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-[#ecdcb9]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#0a4b32] truncate">
                        Technical Excellence
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#5a6b62] truncate">
                        Karimganj, Kishoreganj, Bangladesh
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Institutional Overview Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 space-y-5 sm:space-y-6 min-w-0"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase bg-[#f0f7f3] text-[#0a4b32] border border-[#0a4b32]/20 mb-3 max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c48b28] shrink-0" />
                <span className="truncate">Welcome to Kishoreganj Polytechnic Institute</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0f1f17] leading-tight break-words">
                A Premier Polytechnic Institute Dedicated to Practical Engineering
              </h2>
            </div>

            <p className="text-xs sm:text-base text-[#5a6b62] leading-relaxed break-words">
              Established under the Directorate of Technical Education and Bangladesh Technical Education Board (BTEB), Kishoreganj Polytechnic Institute offers high-caliber 4-year Diploma in Engineering curricula. Our mandate is to cultivate skilled engineering technicians proficient in real-world problem-solving, modern machinery, and digital innovation.
            </p>

            {/* Institutional Key Points */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0a4b32] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0f1f17]">
                    Standardized 7-Semester Diploma Curricula
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#5a6b62] mt-0.5 leading-snug">
                    Rigorous theoretical foundations combined with extensive laboratory practicums and industrial attachment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 sm:gap-3">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0a4b32] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0f1f17]">
                    Comprehensive Shift-Based Scheduling
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#5a6b62] mt-0.5 leading-snug">
                    Operating two distinct academic shifts (First Shift &amp; Second Shift) to maximize student enrollment and laboratory utilization.
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Counters with Animated Count-Up */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 border-t border-[#e2e8e4]">
              <div className="min-w-0">
                <p className="text-xl sm:text-3xl font-extrabold text-[#0a4b32] tracking-tight">
                  <CountUp to={1891} suffix="+" duration={2.2} />
                </p>
                <p className="text-[11px] sm:text-xs text-[#5a6b62] font-medium mt-0.5 leading-tight">
                  Enrolled Students
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xl sm:text-3xl font-extrabold text-[#0a4b32] tracking-tight">
                  <CountUp to={4} duration={1.5} />
                </p>
                <p className="text-[11px] sm:text-xs text-[#5a6b62] font-medium mt-0.5 leading-tight">
                Departments
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xl sm:text-3xl font-extrabold text-[#0a4b32] tracking-tight">
                  <CountUp to={103} suffix="+" duration={1.8} />
                </p>
                <p className="text-[11px] sm:text-xs text-[#5a6b62] font-medium mt-0.5 leading-tight">
                  Faculty &amp; Staff
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xl sm:text-3xl font-extrabold text-[#0a4b32] tracking-tight">
                  <CountUp to={8} duration={1.5} />
                </p>
                <p className="text-[11px] sm:text-xs text-[#5a6b62] font-medium mt-0.5 leading-tight">
                  Semesters
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-3xl font-extrabold text-[#0a4b32] tracking-tight">
                  <CountUp to={16} duration={1.5} />
                </p>
                <p className="text-[11px] sm:text-xs text-[#5a6b62] font-medium mt-0.5 leading-tight">
                  Labs
                </p>
              </div>
            </div>

            {/* Learn More Button */}
            <div className="pt-2">
              <Button
                asChild
                className="w-full sm:w-auto bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold shadow-xs text-xs sm:text-sm h-10 px-4"
              >
                <Link href="/about" className="flex items-center justify-center gap-2">
                  <span>Learn More About Our Institute</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
