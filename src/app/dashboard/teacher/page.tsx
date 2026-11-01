"use client";

import React, { useState } from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function TeacherDashboardPage() {
  const [user] = useState<AuthUser | null>(() => authService.getCurrentUser());

  return (
    <DashboardGuard allowedRoles={["TEACHER"]}>
      {user && (
        <DashboardLayout user={user} role="TEACHER">
          <TeacherDashboard user={user} />
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}
