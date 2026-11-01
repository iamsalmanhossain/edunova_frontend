"use client";

import React from "react";
import {
  Layers,
  Users,
  Cpu,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";

interface HighlightItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    icon: Layers,
    title: "4 Core Departments",
    subtitle: "CST, Electrical, Civil & Mechanical",
  },
  {
    icon: Users,
    title: "Dedicated Faculty",
    subtitle: "Experienced engineers & instructors",
  },
  {
    icon: Cpu,
    title: "Modern Laboratories",
    subtitle: "Advanced computing & heavy workshop",
  },
  {
    icon: GraduationCap,
    title: "Dual Shift Structure",
    subtitle: "Morning & afternoon academic shifts",
  },
  {
    icon: Sparkles,
    title: "Digital Management",
    subtitle: "Paperless routine, marks & attendance",
  },
];

export default function HighlightsStrip() {
  return (
    <div className="relative z-20 -mt-6 sm:-mt-8 lg:-mt-12 px-2 sm:px-0">
      <Container size="wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white rounded-xl sm:rounded-2xl border border-[#e2e8e4] shadow-xl p-3 sm:p-5 lg:p-5 lg:py-4.5 overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#e2e8e4]">
            {HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className={`flex items-center gap-3 sm:gap-3.5 min-w-0 ${
                    idx > 0 ? "pt-3 sm:pt-0 sm:pl-4 lg:pl-6" : ""
                  }`}
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#f0f7f3] border border-[#0a4b32]/15 flex items-center justify-center text-[#0a4b32] shrink-0 shadow-xs">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#0f1f17] leading-tight break-words">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#5a6b62] mt-0.5 leading-snug break-words">
                      {item.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
