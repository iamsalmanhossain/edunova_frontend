"use client";

import React from "react";
import StudentProfile from "@/components/dashboard/student/profile/Profile";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function StudentProfilePage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <StudentProfile initialUser={user} />;
}
