"use client";

import React, { useState, useEffect } from "react";
import StudentAttendanceManager from "@/components/dashboard/student/attendance/StudentAttendanceManager";
import StudentAttendanceSkeleton from "@/components/dashboard/skeletons/StudentAttendanceSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function StudentAttendancePage() {
  const storeUser = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = storeUser || authService.getCurrentUser();
    setUser(currentUser);
  }, [storeUser]);

  if (!mounted || !user) {
    return <StudentAttendanceSkeleton />;
  }

  return <StudentAttendanceManager user={user} />;
}
