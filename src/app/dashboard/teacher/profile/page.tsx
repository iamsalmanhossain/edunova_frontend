"use client";

import React from "react";
import TeacherProfile from "@/components/dashboard/teacher/profile/Profile";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export default function TeacherProfilePage() {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser || (typeof window !== "undefined" ? authService.getCurrentUser() : null);

  if (!user) return null;

  return <TeacherProfile initialUser={user} />;
}
