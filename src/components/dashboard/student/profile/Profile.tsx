"use client";

import React, { useEffect, useState, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { UserProfile } from "@/types/user";
import { AuthUser } from "@/types/auth";
import { userService } from "@/services/user.service";
import StudentProfileHeader from "./StudentProfileHeader";
import StudentAcademicInfoCard from "./StudentAcademicInfoCard";
import StudentPersonalInfoCard from "./StudentPersonalInfoCard";
import StudentEditProfileModal from "./StudentEditProfileModal";
import ProfilePhotoModal from "@/components/shared/ProfilePhotoModal";
import ProfilePageSkeleton from "@/components/dashboard/skeletons/ProfilePageSkeleton";

interface ProfileProps {
  initialUser: AuthUser;
}

export default function StudentProfile({ initialUser }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(() => ({
    id: initialUser.id,
    name: initialUser.name,
    email: initialUser.email,
    phone: initialUser.phone || null,
    avatarUrl: initialUser.avatarUrl || null,
    role: "STUDENT",
    studentProfile: initialUser.studentProfile || null,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        if (mounted) {
          setProfile(data);
          setError(null);
        }
      } catch (err: unknown) {
        console.warn("Could not fetch remote profile, using local user data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading && !profile) {
    return <ProfilePageSkeleton />;
  }

  if (!profile) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        <div>
          <p className="text-sm font-bold">Profile Unavailable</p>
          <p className="text-xs text-red-700">
            {error || "Could not retrieve student profile. Please refresh or sign in again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <StudentProfileHeader
        profile={profile}
        onEditClick={() => setIsEditModalOpen(true)}
        onPhotoClick={() => setIsPhotoModalOpen(true)}
      />

      {/* 2. Academic Enrollment Info */}
      <StudentAcademicInfoCard studentProfile={profile.studentProfile} />

      {/* 3. Personal & Guardian Details */}
      <StudentPersonalInfoCard profile={profile} />

      {/* 4. Edit Profile Modal */}
      <StudentEditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdated={(updated) => setProfile(updated)}
      />

      {/* 5. Profile Photo Upload Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        user={{
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatarUrl: profile.avatarUrl,
        }}
      />
    </div>
  );
}

