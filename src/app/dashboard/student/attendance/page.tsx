"use client";

import React from "react";
import StudentAttendanceManager from "@/components/dashboard/student/attendance/StudentAttendanceManager";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function StudentAttendancePage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <StudentAttendanceManager user={user} />;
}
