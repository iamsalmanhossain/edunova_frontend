"use client";

import React, { useState, useEffect } from "react";
import StudentResultsManager from "@/components/dashboard/student/results/StudentResultsManager";
import StudentResultsSkeleton from "@/components/dashboard/skeletons/StudentResultsSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function StudentResultsPage() {
  const storeUser = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = storeUser || authService.getCurrentUser();
    setUser(currentUser);
  }, [storeUser]);

  if (!mounted || !user) {
    return <StudentResultsSkeleton />;
  }

  return <StudentResultsManager user={user} />;
}
