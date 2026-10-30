import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Class Routine & Shift Schedule",
  description:
    "Class routines and shift schedules for 1st and 2nd shift students across all semesters.",
};

export default function RoutinePage() {
  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        <SectionHeading
          badge="Academic Schedules"
          title="Class Routine &amp; Shift Structure"
          subtitle="Explore the daily class timetables and laboratory schedules for 1st Shift and 2nd Shift programs."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Shift 1 Card */}
          <Card className="border border-[#e2e8e4] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="bg-[#0a4b32]">First Shift</Badge>
              <span className="text-xs font-semibold text-[#5a6b62]">Morning Session</span>
            </div>
            <h3 className="text-xl font-bold text-[#0f1f17]">
              08:00 AM — 01:15 PM
            </h3>
            <p className="text-sm text-[#5a6b62] leading-relaxed">
              Standard morning timetable designed for comprehensive 45-minute theory classes and continuous 90-minute workshop sessions.
            </p>
            <div className="pt-2 border-t border-[#e2e8e4] flex items-center justify-between text-xs text-[#5a6b62]">
              <span>6 Class Periods Daily</span>
              <span>Sunday — Thursday</span>
            </div>
          </Card>

          {/* Shift 2 Card */}
          <Card className="border border-[#e2e8e4] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="gold" className="bg-[#c48b28] text-white">Second Shift</Badge>
              <span className="text-xs font-semibold text-[#5a6b62]">Afternoon Session</span>
            </div>
            <h3 className="text-xl font-bold text-[#0f1f17]">
              01:30 PM — 06:45 PM
            </h3>
            <p className="text-sm text-[#5a6b62] leading-relaxed">
              Dedicated afternoon timetable ensuring identical curriculum coverage, full lab access, and specialized instructor availability.
            </p>
            <div className="pt-2 border-t border-[#e2e8e4] flex items-center justify-between text-xs text-[#5a6b62]">
              <span>6 Class Periods Daily</span>
              <span>Sunday — Thursday</span>
            </div>
          </Card>
        </div>

        {/* Portal Notice */}
        <div className="bg-[#f0f7f3] rounded-2xl border border-[#0a4b32]/20 p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-3">
          <Clock className="w-8 h-8 text-[#0a4b32] mx-auto" />
          <h4 className="text-lg font-bold text-[#0f1f17]">
            Real-Time Personalized Student Routine
          </h4>
          <p className="text-xs sm:text-sm text-[#5a6b62]">
            Enrolled students can log in to view their exact departmental routine, teacher assignments, and room numbers.
          </p>
          <div className="pt-2">
            <Button asChild className="bg-[#0a4b32] hover:bg-[#073825] text-white">
              <Link href="/login">Access Student Portal</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
