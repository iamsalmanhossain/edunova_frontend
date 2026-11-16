"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Laptop, UtensilsCrossed, Cpu, Snowflake } from "lucide-react";

export const CORE_DEPARTMENTS = [
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

export default function AboutDepartmentsGrid() {
  return (
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
  );
}
