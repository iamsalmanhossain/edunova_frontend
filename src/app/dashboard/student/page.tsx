"use client";

import React, { useState, useEffect } from "react";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import StudentDashboardSkeleton from "@/components/dashboard/skeletons/StudentDashboardSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function StudentDashboardPage() {
  const storeUser = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = storeUser || authService.getCurrentUser();
    setUser(currentUser);
  }, [storeUser]);

  if (!mounted || !user) {
    return <StudentDashboardSkeleton />;
  }

  return <StudentDashboard user={user} />;
}
