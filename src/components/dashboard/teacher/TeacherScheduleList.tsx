"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface TeacherLectureItem {
  time: string;
  subject: string;
  semester: string;
  department: string;
  room: string;
  studentsCount: number;
}

interface TeacherScheduleListProps {
  schedule: TeacherLectureItem[];
}

export default function TeacherScheduleList({
  schedule,
}: TeacherScheduleListProps) {
  return (
    <Card className="border-[#e2e8e4] shadow-xs bg-white rounded-2xl overflow-hidden">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-[#f0f4f1] flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm sm:text-base font-bold text-[#0f1f17] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0a4b32]" />
            <span>Today&apos;s Lecture Schedule</span>
          </CardTitle>
          <p className="text-[11px] sm:text-xs text-[#5a6b62] mt-0.5">
            Assigned lecture timetable and practical lab sessions
          </p>
        </div>
        <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-[#f0f7f3] text-[#0a4b32] border border-[#dce9e1]">
          Today
        </span>
      </CardHeader>

      <CardContent className="p-3 sm:p-5">
        {schedule.length === 0 ? (
          <div className="py-8 sm:py-10 text-center space-y-3 px-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f0f7f3] border border-[#dce9e1] text-[#0a4b32] flex items-center justify-center mx-auto shadow-2xs">
              <Calendar className="w-6 h-6 text-[#0a4b32]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#0f1f17]">
                No lectures scheduled for this shift right now
              </p>
              <p className="text-[11px] sm:text-xs text-[#5a6b62] max-w-sm mx-auto mt-1 leading-relaxed">
                You can start an on-demand attendance roll call session anytime for any assigned semester and subject.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard/teacher/attendance">
                <Button
                  size="sm"
                  className="bg-[#0a4b32] hover:bg-[#073825] text-white text-xs font-bold rounded-xl h-9 px-4 gap-1.5 shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#c48b28]" />
                  <span>Start Attendance Session</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#f0f4f1] space-y-1">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#fbfcfb] p-2.5 rounded-xl transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#0a4b32] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      <Clock className="w-3 h-3 text-[#0a4b32]" />
                      <span>{item.time}</span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-[#f4f7f5] text-[#0f1f17] font-semibold border border-[#e2e8e4]">
                      {item.semester}
                    </span>
                    <span className="text-[10px] text-[#5a6b62] hidden xs:inline">
                      {item.department}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[#0f1f17] group-hover:text-[#0a4b32] transition-colors leading-snug">
                    {item.subject}
                  </h4>

                  <div className="flex items-center gap-3 text-[11px] text-[#5a6b62] flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#c48b28]" />
                      <span>{item.room}</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#5a6b62]" />
                      <span>{item.studentsCount} Students</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-center">
                  <Link href="/dashboard/teacher/attendance">
                    <Button
                      size="sm"
                      className="h-8 text-xs font-bold bg-[#0a4b32] hover:bg-[#073825] text-white rounded-lg shadow-2xs gap-1.5 cursor-pointer active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c48b28]" />
                      <span>Take Roll Call</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
