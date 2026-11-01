"use client";

import React from "react";
import { AuthUser } from "@/types/auth";
import TeacherApprovalAlert from "./TeacherApprovalAlert";
import TeacherWelcomeBanner from "./TeacherWelcomeBanner";
import TeacherMetricsGrid from "./TeacherMetricsGrid";
import TeacherScheduleList, { TeacherLectureItem } from "./TeacherScheduleList";
import TeacherQuickTools from "./TeacherQuickTools";

interface TeacherDashboardProps {
  user: AuthUser;
}

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const schedule: TeacherLectureItem[] = [
    {
      time: "08:30 AM – 10:00 AM",
      subject: "Microprocessor & Interfacing (66651)",
      semester: "4th Semester (Shift 1)",
      department: "Computer Technology",
      room: "CST Software Lab 2",
      studentsCount: 52,
    },
    {
      time: "11:45 AM – 01:15 PM",
      subject: "Computer Architecture & Organization",
      semester: "4th Semester (Shift 2)",
      department: "Computer Technology",
      room: "Academic Room 302",
      studentsCount: 48,
    },
    {
      time: "02:00 PM – 03:30 PM",
      subject: "Advanced Microcontroller Workshop",
      semester: "6th Semester (Shift 1)",
      department: "Computer Technology",
      room: "Hardware & Robotics Lab",
      studentsCount: 44,
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Approval Status Alert */}
      <TeacherApprovalAlert status={user.teacherApprovalStatus || "PENDING"} />

      {/* 2. Welcome Banner */}
      <TeacherWelcomeBanner
        userName={user.name}
        designation="Senior Instructor"
        departmentName="Computer Science & Technology"
      />

      {/* 3. KPI Metrics */}
      <TeacherMetricsGrid
        assignedCoursesCount={3}
        studentsCount={144}
        attendanceSubmissionRate="98.5%"
        pendingEvaluationsCount={1}
      />

      {/* 4. Schedule & Faculty Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2">
          <TeacherScheduleList schedule={schedule} />
        </div>

        <div>
          <TeacherQuickTools />
        </div>
      </div>
    </div>
  );
}

