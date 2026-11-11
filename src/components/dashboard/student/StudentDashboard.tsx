"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AuthUser } from "@/types/auth";
import { StudentDashboardOverviewData } from "@/types/student";
import { studentService } from "@/services/student.service";
import StudentWelcomeBanner from "./StudentWelcomeBanner";
import StudentMetricsGrid from "./StudentMetricsGrid";
import StudentDashboardSkeleton from "../skeletons/StudentDashboardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Award,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import UpcomingExamsWidget from "../shared/UpcomingExamsWidget";

interface StudentDashboardProps {
  user: AuthUser;
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [data, setData] = useState<StudentDashboardOverviewData | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchOverview() {
      try {
        setLoading(true);
        setError(null);
        const res = await studentService.getOverview(selectedSemester);
        if (isMounted) {
          setData(res);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Failed to load dashboard data";
          console.error("Student dashboard error:", message);
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchOverview();
    return () => {
      isMounted = false;
    };
  }, [selectedSemester]);

  if (loading) {
    return <StudentDashboardSkeleton />;
  }

  // Profile data derivations
  const student = data?.student || user.studentProfile;
  const studentName = data?.student?.name || user.name;
  const semester = student?.semester || 1;
  const semText = `${semester}th Semester ${student?.department?.code || ""}`.trim();
  const shiftText =
    student?.shift === "SECOND_SHIFT" ? "Shift 2 (Day)" : "Shift 1 (Morning)";
  const rollNo = student?.rollNo || user.studentProfile?.rollNo || "N/A";
  const registrationNo =
    student?.registrationNo || user.studentProfile?.registrationNo || "N/A";

  // Metrics
  const attendanceRate = data?.metrics?.attendance?.attendancePercentage != null
    ? `${data.metrics.attendance.attendancePercentage}%`
    : "0.0%";
  const cgpa = data?.metrics?.academics?.gpa != null
    ? data.metrics.academics.gpa.toFixed(2)
    : "0.00";
  const enrolledCount = data?.metrics?.academics?.totalEnrolledSubjects ?? data?.enrolledSubjects?.length ?? 0;
  const creditHours = data?.enrolledSubjects?.reduce((acc, curr) => acc + (curr.credit || 0), 0) || (enrolledCount * 3);

  const enrolledSubjects = data?.enrolledSubjects || [];
  const recentResults = data?.recentResults || [];
  const recentAttendance = data?.recentAttendance || [];

  const availableSemesters = data?.availableSemesters && data.availableSemesters.length > 0
    ? data.availableSemesters
    : [1, 2, 3, 4, 5, 6, 7].filter((s) => s <= (student?.semester || 7));

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* 1. Welcome Banner */}
      <StudentWelcomeBanner
        userName={studentName}
        semesterText={semText}
        shiftText={shiftText}
      />

      {/* Fresh Semester Welcome Banner */}
      {data?.isFreshSemester && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 text-[#0f1f17] flex items-start sm:items-center gap-3.5 shadow-xs">
          <div className="p-2.5 rounded-xl bg-[#0a4b32] text-[#c48b28] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#0a4b32]">
              Welcome to Semester {data.currentSemester || semester}! Fresh Academic Session Started
            </h3>
            <p className="text-xs text-[#5a6b62] mt-0.5">
              Your academic records for this term have begun with a clean slate. Attendance logs and examination marks will appear as your teachers publish them.
            </p>
          </div>
        </div>
      )}

      {/* Semester Switcher Bar */}
      {availableSemesters.length > 1 && (
        <div className="p-3.5 rounded-2xl bg-white border border-[#dce3df] shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0a4b32]" />
            <span className="text-xs font-bold text-[#0f1f17]">View Past or Current Semester:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {availableSemesters.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSemester(s)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  (selectedSemester === s || (!selectedSemester && s === semester))
                    ? "bg-[#0a4b32] text-white shadow-xs"
                    : "bg-[#f0f4f1] text-[#5a6b62] hover:bg-[#e2e8e4] hover:text-[#0f1f17]"
                }`}
              >
                Semester {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Note: Using offline cached profile. Server message: {error}</span>
        </div>
      )}

      {/* 2. KPI Metrics Grid */}
      <StudentMetricsGrid
        attendanceRate={attendanceRate}
        cgpa={cgpa}
        enrolledSubjectsCount={enrolledCount}
        creditHours={creditHours}
        rollNo={rollNo}
        registrationNo={registrationNo}
      />

      {/* 3. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column (Enrolled Subjects & Recent Results) */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* Enrolled Subjects */}
          <Card className="border-[#e2e8e4] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#0a4b32]" />
                  Current Semester Subjects
                </CardTitle>
                <p className="text-xs text-[#5a6b62]">
                  Registered courses for Semester {semester}
                </p>
              </div>
              <Badge variant="outline" className="text-xs bg-[#0a4b32]/10 text-[#0a4b32] border-[#0a4b32]/20">
                {enrolledSubjects.length} Courses
              </Badge>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {enrolledSubjects.length === 0 ? (
                <div className="text-center py-6 text-sm text-[#5a6b62]">
                  No subjects registered for this semester yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {enrolledSubjects.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-xl border border-[#e2e8e4] bg-[#fcfdfc] hover:border-[#0a4b32]/30 transition-all flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-[#0a4b32] mb-1">
                          <span>Code: {s.code}</span>
                          <span className="text-[#5a6b62] bg-[#f0f4f1] px-2 py-0.5 rounded-md">
                            {s.credit} Credits
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0f1f17] line-clamp-1">{s.name}</h4>
                      </div>
                      <div className="text-[11px] text-[#5a6b62] flex items-center gap-1 pt-1 border-t border-[#f0f4f1]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Curriculum Approved</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Published Results */}
          <Card className="border-[#e2e8e4] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#0a4b32]" />
                  Latest Examination Results
                </CardTitle>
                <p className="text-xs text-[#5a6b62]">
                  Recently published grades and evaluation sheets
                </p>
              </div>
              <Link
                href="/dashboard/student/results"
                className="text-xs font-semibold text-[#0a4b32] hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {recentResults.length === 0 ? (
                <div className="text-center py-6 text-sm text-[#5a6b62]">
                  No published exam results found at this time.
                </div>
              ) : (
                <div className="divide-y divide-[#f0f4f1]">
                  {recentResults.map((r) => (
                    <div
                      key={r.markId}
                      className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#0f1f17] truncate">
                            {r.subject.name}
                          </h4>
                          <span className="text-[11px] text-[#5a6b62] bg-[#f0f4f1] px-1.5 py-0.5 rounded font-mono">
                            {r.subject.code}
                          </span>
                        </div>
                        <p className="text-xs text-[#5a6b62]">
                          {r.examName} • {r.obtainedMarks} / {r.totalMarks} Marks
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-1 text-xs font-black rounded-lg ${
                            r.grade === "A+" || r.grade === "A"
                              ? "bg-emerald-100 text-emerald-800"
                              : r.grade === "F"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {r.grade} ({r.gradePoint.toFixed(2)})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Exams Reminders, Recent Attendance & Quick Links) */}
        <div className="space-y-5 sm:space-y-6">
          {/* Smart Exam Reminders Widget */}
          <UpcomingExamsWidget />

          {/* Recent Attendance Log */}
          <Card className="border-[#e2e8e4] shadow-xs">
            <CardHeader className="pb-3 border-b border-[#e2e8e4]/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#0a4b32]" />
                  Recent Attendance
                </CardTitle>
                <p className="text-xs text-[#5a6b62]">
                  Latest class check-in entries
                </p>
              </div>
              <Link
                href="/dashboard/student/attendance"
                className="text-xs font-semibold text-[#0a4b32] hover:underline flex items-center gap-1"
              >
                Full Log <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {recentAttendance.length === 0 ? (
                <div className="text-center py-6 text-sm text-[#5a6b62]">
                  No attendance records recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-[#f0f4f1]">
                  {recentAttendance.map((rec) => (
                    <div
                      key={rec.id}
                      className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#0f1f17] truncate">
                          {rec.subject.name}
                        </h4>
                        <p className="text-[11px] text-[#5a6b62]">
                          {new Date(rec.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          • {rec.sessionType}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-bold ${
                          rec.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {rec.status === "PRESENT" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Present
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" /> Absent
                          </span>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Direct Navigation Links */}
          <Card className="border-[#e2e8e4] shadow-xs bg-gradient-to-br from-[#0a4b32]/5 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#0a4b32]">
                Student Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Link
                href="/dashboard/student/diary"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32]/40 transition-all text-xs font-semibold text-[#0f1f17]"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0a4b32]" />
                  <span>Class Diary &amp; Lecture Notes</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#5a6b62]" />
              </Link>
              <Link
                href="/dashboard/student/attendance"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32]/40 transition-all text-xs font-semibold text-[#0f1f17]"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0a4b32]" />
                  <span>Subject-Wise Attendance Breakdown</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#5a6b62]" />
              </Link>
              <Link
                href="/dashboard/student/results"
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e2e8e4] hover:border-[#0a4b32]/40 transition-all text-xs font-semibold text-[#0f1f17]"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0a4b32]" />
                  <span>Download Published Marksheets (PDF)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#5a6b62]" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
