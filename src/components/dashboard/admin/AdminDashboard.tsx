"use client";

import React, { useState } from "react";
import { AuthUser } from "@/types/auth";
import AdminWelcomeBanner from "./AdminWelcomeBanner";
import AdminMetricsGrid from "./AdminMetricsGrid";
import AdminFacultyApprovals, { PendingFacultyItem } from "./AdminFacultyApprovals";
import AdminDepartmentList, { DepartmentSummaryItem } from "./AdminDepartmentList";
import AdminSystemHealth from "./AdminSystemHealth";

interface AdminDashboardProps {
  user: AuthUser;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [approvedTeachers, setApprovedTeachers] = useState<Record<string, boolean>>({});

  const pendingTeachers: PendingFacultyItem[] = [
    {
      id: "7cc85e9a-8690-4319-916f-913db8cc9162",
      name: "Engr. Rafiqul Islam",
      email: "jitoya7966@agaexpress.com",
      designation: "Senior Instructor",
      qualification: "B.Sc. in Computer Science & Engineering",
      department: "Computer Technology",
      shift: "1st Shift",
      phone: "01812345678",
    },
  ];

  const departments: DepartmentSummaryItem[] = [
    { name: "Computer Science & Technology (CST)", code: "CST", students: 380, faculty: 14, head: "Engr. Md. Anisur Rahman" },
    { name: "Electrical Engineering", code: "EET", students: 320, faculty: 12, head: "Engr. Kabir Hossain" },
    { name: "Civil Engineering", code: "CET", students: 310, faculty: 12, head: "Engr. Farhana Ahmed" },
    { name: "Mechanical Engineering", code: "MET", students: 240, faculty: 10, head: "Engr. Tariqul Islam" },
  ];

  const handleApprove = (id: string) => {
    setApprovedTeachers((prev) => ({ ...prev, [id]: true }));
  };

  const pendingCount =
    Object.values(approvedTeachers).filter(Boolean).length === pendingTeachers.length
      ? 0
      : pendingTeachers.length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Welcome Banner */}
      <AdminWelcomeBanner adminName={user.name} />

      {/* 2. KPI Metrics Grid */}
      <AdminMetricsGrid pendingApprovalsCount={pendingCount} />

      {/* 3. Faculty Verification Approval Box */}
      <AdminFacultyApprovals
        teachers={pendingTeachers}
        approvedIds={approvedTeachers}
        onApprove={handleApprove}
      />

      {/* 4. Departments & System Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2">
          <AdminDepartmentList departments={departments} />
        </div>

        <div>
          <AdminSystemHealth />
        </div>
      </div>
    </div>
  );
}

