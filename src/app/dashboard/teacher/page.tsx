"use client";

import React, { useState, useEffect } from "react";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";
import TeacherDashboardSkeleton from "@/components/dashboard/skeletons/TeacherDashboardSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function TeacherDashboardPage() {
  const storeUser = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = storeUser || authService.getCurrentUser();
    setUser(currentUser);
  }, [storeUser]);

  if (!mounted || !user) {
    return <TeacherDashboardSkeleton />;
  }

  return <TeacherDashboard user={user} />;
}
