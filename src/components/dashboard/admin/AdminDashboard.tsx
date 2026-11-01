"use client";

import React, { useState } from "react";
import { AuthUser } from "@/types/auth";
import AdminWelcomeBanner from "./AdminWelcomeBanner";
import AdminMetricsGrid from "./AdminMetricsGrid";
import AdminFacultyApprovals, { PendingFacultyItem } from "./AdminFacultyApprovals";
import AdminDepartmentList, { DepartmentSummaryItem } from "./AdminDepartmentList";
import AdminSystemHealth from "./AdminSystemHealth";
import AdminAdmissionSummary from "./AdminAdmissionSummary";

interface AdminDashboardProps {
  user: AuthUser;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [approvedIds, setApprovedIds] = useState<Record<string, boolean>>({});

  const handleApprove = (id: string) => {
    setApprovedIds((prev) => ({ ...prev, [id]: true }));
  };

  // Pending faculty requests
  const pendingFaculty: PendingFacultyItem[] = [
    {
      id: "f1",
      name: "Engr. Mahmudul Hasan",
      email: "mahmudul.cst@kipi.edu.bd",
      designation: "Assistant Instructor",
      qualification: "B.Sc. in CSE, DUET",
      department: "Computer Technology",
      shift: "Shift 1",
      phone: "+880 1712-345678",
    },
    {
      id: "f2",
      name: "Dr. Farzana Parveen",
      email: "farzana.et@kipi.edu.bd",
      designation: "Senior Instructor",
      qualification: "M.Sc. in EEE, BUET",
      department: "Electrical Technology",
      shift: "Shift 2",
      phone: "+880 1798-765432",
    },
  ];

  // Department distribution
  const departments: DepartmentSummaryItem[] = [
    { name: "Computer Science & Technology", code: "CST", students: 420, faculty: 14, head: "Engr. Rafiqul Islam" },
    { name: "Electrical Technology", code: "ET", students: 340, faculty: 12, head: "Dr. Farzana Parveen" },
    { name: "Civil Technology", code: "CT", students: 280, faculty: 11, head: "Engr. Monir Hossain" },
    { name: "Mechanical Technology", code: "MT", students: 210, faculty: 11, head: "Engr. Tariqul Islam" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Welcome Banner */}
      <AdminWelcomeBanner adminName={user.name} />

      {/* 2. KPI Metrics Grid */}
      <AdminMetricsGrid
        totalStudents="1,250+"
        totalFaculty="48"
        departmentCount={4}
        pendingApprovalsCount={2}
      />

      {/* 3. Admission & Revenue Overview */}
      <AdminAdmissionSummary />

      {/* 4. Operations, Approvals & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <AdminFacultyApprovals
            teachers={pendingFaculty}
            approvedIds={approvedIds}
            onApprove={handleApprove}
          />
          <AdminDepartmentList departments={departments} />
        </div>

        <div>
          <AdminSystemHealth />
        </div>
      </div>
    </div>
  );
}
