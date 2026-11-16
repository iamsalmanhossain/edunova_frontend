"use client";

import React from "react";
import { InstitutionStaff } from "@/types/staff";
import StaffCard from "@/components/shared/StaffCard";
import { Award } from "lucide-react";

interface PrincipalSectionProps {
  principal: InstitutionStaff | null;
}

export default function PrincipalSection({ principal }: PrincipalSectionProps) {
  if (!principal) return null;

  return (
    <section className="space-y-4">
      {/* Centered Heading */}
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Institutional Leadership</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f1f17] tracking-tight">
          Principal &amp; Head of Institute
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Executive head providing institutional steering, academic excellence, and governance.
        </p>
      </div>

      {/* Prominent Profile Card Centered */}
      <div className="max-w-3xl mx-auto">
        <StaffCard staff={principal} featured={true} />
      </div>
    </section>
  );
}
