"use client";

import React from "react";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function StudentDashboardPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <StudentDashboard user={user} />;
}
