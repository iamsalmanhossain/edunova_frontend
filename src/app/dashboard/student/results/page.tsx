"use client";

import React from "react";
import StudentResultsManager from "@/components/dashboard/student/results/StudentResultsManager";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function StudentResultsPage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <StudentResultsManager user={user} />;
}
