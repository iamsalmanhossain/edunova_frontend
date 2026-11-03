"use client";

import React from "react";
import { AuthUser } from "@/types/auth";
import StudentWelcomeBanner from "./StudentWelcomeBanner";
import StudentMetricsGrid from "./StudentMetricsGrid";
import StudentRoutineTable, { RoutinePeriod } from "./StudentRoutineTable";
import StudentCourseProgress, { StudentCourseItem } from "./StudentCourseProgress";
import StudentNoticeBoard, { StudentNoticeItem } from "./StudentNoticeBoard";
import StudentHelpDesk from "./StudentHelpDesk";
import StudentFeeStatus from "./StudentFeeStatus";

interface StudentDashboardProps {
  user: AuthUser;
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const student = user.studentProfile;
  const semText = student?.semester
    ? `${student.semester}th Semester ${student.department?.code || ""}`.trim()
    : "Diploma Engineering";
  const shiftText =
    student?.shift === "SECOND_SHIFT" ? "Shift 2 (Day)" : "Shift 1 (Morning)";
  const rollNo = student?.rollNo || "N/A";
  const registrationNo = student?.registrationNo || "N/A";

  // Student routine data
  const routine: RoutinePeriod[] = [
    {
      time: "08:30 AM – 10:00 AM",
      subject: "Microprocessor & Interfacing (66651)",
      teacher: "Engr. Rafiqul Islam",
      room: "CST Software Lab 2",
      type: "Practical Lab",
      status: "Upcoming",
    },
    {
      time: "10:15 AM – 11:45 AM",
      subject: "Database Management Systems (66652)",
      teacher: "Md. Nazmul Huda",
      room: "Academic Room 304",
      type: "Theory Lecture",
      status: "Upcoming",
    },
    {
      time: "12:00 PM – 01:30 PM",
      subject: "Data Communication & Computer Networks (66653)",
      teacher: "Farhana Yasmin",
      room: "Network Systems Lab",
      type: "Lab + Theory",
      status: "Upcoming",
    },
  ];

  // Enrolled courses data
  const courses: StudentCourseItem[] = [
    { code: "66651", name: "Microprocessor & Interfacing", credits: 4, progress: 84, teacher: "Engr. Rafiqul Islam" },
    { code: "66652", name: "Database Management Systems", credits: 3, progress: 78, teacher: "Md. Nazmul Huda" },
    { code: "66653", name: "Data Communication & Networks", credits: 4, progress: 88, teacher: "Farhana Yasmin" },
    { code: "66654", name: "Operating System Applications", credits: 3, progress: 72, teacher: "Engr. Mahbub Alam" },
    { code: "65851", name: "Environmental Studies", credits: 2, progress: 92, teacher: "Dr. Anisur Rahman" },
  ];

  // Notices data
  const notices: StudentNoticeItem[] = [
    {
      id: "n1",
      title: "4th Semester Midterm Examination",
      description: "Theory assessments scheduled to commence from the 2nd week of next month. Ensure minimum 75% attendance.",
      date: "Starts: Nov 15, 2026",
    },
    {
      id: "n2",
      title: "Central Library Book Renewal",
      description: "Computer Science engineering textbooks must be re-registered at the campus library by Thursday.",
      date: "Due: Nov 05, 2026",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Welcome Banner */}
      <StudentWelcomeBanner
        userName={user.name}
        semesterText={semText}
        shiftText={shiftText}
      />

      {/* 2. KPI Metrics Grid */}
      <StudentMetricsGrid
        attendanceRate="94.2%"
        cgpa="3.82"
        enrolledSubjectsCount={5}
        creditHours={16}
        rollNo={rollNo}
        registrationNo={registrationNo}
      />

      {/* 3. Tuition & Dues Status */}
      <StudentFeeStatus />

      {/* 4. Routine, Progress & Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <StudentRoutineTable routine={routine} />
          <StudentCourseProgress courses={courses} />
        </div>

        <div className="space-y-5 sm:space-y-6">
          <StudentNoticeBoard notices={notices} />
          <StudentHelpDesk />
        </div>
      </div>
    </div>
  );
}
