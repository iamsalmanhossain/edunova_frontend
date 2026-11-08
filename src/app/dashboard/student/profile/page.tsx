"use client";

import React, { useState, useEffect } from "react";
import StudentProfile from "@/components/dashboard/student/profile/Profile";
import ProfilePageSkeleton from "@/components/dashboard/skeletons/ProfilePageSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function StudentProfilePage() {
  const storeUser = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = storeUser || authService.getCurrentUser();
    setUser(currentUser);
  }, [storeUser]);

  if (!mounted || !user) {
    return <ProfilePageSkeleton />;
  }

  return <StudentProfile initialUser={user} />;
}
