"use client";

import React from "react";
import Image from "next/image";
import { Camera, Edit3, Briefcase, CheckCircle2, ShieldCheck, Mail, Phone, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/user";

interface TeacherProfileHeaderProps {
  profile: UserProfile;
  onEditClick: () => void;
  onPhotoClick: () => void;
}

export default function TeacherProfileHeader({
  profile,
  onEditClick,
  onPhotoClick,
}: TeacherProfileHeaderProps) {
  const teacher = profile.teacherProfile;
  const shiftLabel =
    teacher?.shift === "SECOND_SHIFT" ? "Shift 2 (Day)" : "Shift 1 (Morning)";

  return (
    <div className="bg-gradient-to-r from-[#1c2c22] via-[#073825] to-[#124b33] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#1b5e43] relative overflow-hidden">
      {/* Glow elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-20 w-40 h-40 rounded-full bg-emerald-400/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar with Camera */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0d281a] ring-4 ring-amber-500/20 shadow-lg overflow-hidden flex items-center justify-center text-white font-extrabold text-3xl">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                width={112}
                height={112}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>
          <button
            type="button"
            onClick={onPhotoClick}
            className="absolute -bottom-2 -right-2 bg-[#c48b28] hover:bg-[#a9751e] text-white p-2 rounded-xl shadow-md transition-colors cursor-pointer"
            title="Update Profile Photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Faculty Details */}
        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {profile.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              Accredited Faculty
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <Briefcase className="w-3.5 h-3.5" />
              {teacher?.designation || "Instructor"}
            </span>
          </div>

          <p className="text-sm text-amber-100/90 font-medium mb-3">
            {teacher?.department?.name || "Polytechnic Faculty"}{" "}
            {teacher?.institute?.name && `• ${teacher.institute.name}`}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-300" />
              {profile.email}
            </span>
            {profile.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                {profile.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c48b28]" />
              {shiftLabel}
            </span>
            {teacher?.qualification && (
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                {teacher.qualification}
              </span>
            )}
          </div>
        </div>

        {/* Action button */}
        <div className="shrink-0 flex items-center">
          <Button
            onClick={onEditClick}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-sm font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#e4a838]" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

