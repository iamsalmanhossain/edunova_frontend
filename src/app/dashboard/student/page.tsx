"use client";

import React, { useState } from "react";
import DashboardGuard from "@/components/dashboard/DashboardGuard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function StudentDashboardPage() {
  const [user] = useState<AuthUser | null>(() => authService.getCurrentUser());

  return (
    <DashboardGuard allowedRoles={["STUDENT"]}>
      {user && (
        <DashboardLayout user={user} role="STUDENT">
          <StudentDashboard user={user} />
        </DashboardLayout>
      )}
    </DashboardGuard>
  );
}
