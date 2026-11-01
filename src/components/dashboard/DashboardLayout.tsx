"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  Bell,
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  X,
  ChevronRight,
  ClipboardList,
  Layers,
  Settings,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";
import StudentDashboardHeader from "./header/StudentDashboardHeader";
import TeacherDashboardHeader from "./header/TeacherDashboardHeader";
import AdminDashboardHeader from "./header/AdminDashboardHeader";
import ProfilePhotoModal from "@/components/shared/ProfilePhotoModal";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: AuthUser;
  role: "STUDENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN";
}

export default function DashboardLayout({
  children,
  user,
  role,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  // Role specific navigation configs
  const studentNav: NavItem[] = [
    { label: "Dashboard Overview", href: "/dashboard/student", icon: LayoutDashboard },
    { label: "My Class Routine", href: "#routine", icon: Calendar },
    { label: "Attendance Record", href: "#attendance", icon: Clock },
    { label: "Enrolled Courses", href: "#courses", icon: BookOpen },
    { label: "Examinations & Marks", href: "#marks", icon: FileText },
    { label: "Campus Notices", href: "#notices", icon: Bell },
  ];

  const teacherNav: NavItem[] = [
    { label: "Faculty Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
    { label: "Teaching Schedule", href: "#schedule", icon: Calendar },
    { label: "Attendance Entry", href: "#attendance", icon: Clock },
    { label: "Midterm Mark Sheets", href: "#marks", icon: ClipboardList },
    { label: "Student Roll Sheet", href: "#students", icon: Users },
    { label: "Academic Notices", href: "#notices", icon: Bell },
  ];

  const adminNav: NavItem[] = [
    { label: "Admin Console", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Teacher Approvals", href: "#approvals", icon: CheckCircle2, badge: "2" },
    { label: "Student Registry", href: "#students", icon: Users },
    { label: "Departments (4)", href: "#departments", icon: Layers },
    { label: "Institute Management", href: "#institute", icon: Building2 },
    { label: "System Audit Logs", href: "#audit", icon: ShieldCheck },
    { label: "Platform Settings", href: "#settings", icon: Settings },
  ];

  const navItems =
    role === "STUDENT"
      ? studentNav
      : role === "TEACHER"
      ? teacherNav
      : adminNav;

  const roleLabels = {
    STUDENT: {
      title: "Student Portal",
      badge: "Diploma Student",
      color: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    },
    TEACHER: {
      title: "Faculty Portal",
      badge: "Instructor / Teacher",
      color: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    },
    ADMIN: {
      title: "Admin Console",
      badge: "System Administrator",
      color: "bg-blue-500/15 text-blue-300 border-blue-400/30",
    },
    SUPER_ADMIN: {
      title: "Super Admin",
      badge: "Super Administrator",
      color: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    },
  };

  const currentRoleConfig = roleLabels[role] || roleLabels.STUDENT;

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f4f7f5] flex select-none">
      {/* 1. Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:flex bg-[#073825] text-white flex-col justify-between shrink-0 border-r border-[#0a4b32] h-full transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64 xl:w-72"
        }`}
      >
        {/* Brand Header */}
        <div className={`border-b border-[#0a4b32]/80 transition-all ${isCollapsed ? "p-3 flex justify-center" : "p-5 xl:p-6"}`}>
          <Link href="/" className={`flex items-center gap-2.5 group overflow-hidden ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c48b28] to-[#996b1a] text-white flex items-center justify-center shadow-md shadow-black/20 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    EduNova
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#c48b28] text-white tracking-widest uppercase">
                    IMS
                  </span>
                </div>
                <p className="text-[10px] text-white/60 tracking-wide truncate">
                  Digital Campus Platform
                </p>
              </div>
            )}
          </Link>

          {/* Role Status Tag (when expanded) */}
          {!isCollapsed && (
            <div className="mt-4 pt-3 border-t border-[#0a4b32]/60 flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">
                  Active Portal
                </span>
                <span className="text-xs font-bold text-white truncate block">
                  {currentRoleConfig.title}
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentRoleConfig.color}`}
              >
                {currentRoleConfig.badge}
              </span>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 py-4 px-2 sm:px-3 space-y-1 overflow-y-auto no-scrollbar">
          {!isCollapsed && (
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
              Main Navigation
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "#" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl text-xs font-semibold transition-all group ${
                  isCollapsed ? "justify-center p-3" : "justify-between px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-[#0a4b32] text-white shadow-xs border border-[#146c4a]"
                    : "text-white/70 hover:bg-[#063020] hover:text-white"
                }`}
              >
                <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? "justify-center" : ""}`}>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-[#c48b28]" : "text-white/50 group-hover:text-white"
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#c48b28] text-white">
                    {item.badge}
                  </span>
                )}
                {!isCollapsed && !item.badge && isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#c48b28]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Footer Profile & Sign Out */}
        <div className={`border-t border-[#0a4b32]/80 bg-[#052b1c]/80 transition-all ${isCollapsed ? "p-3 flex flex-col items-center gap-2" : "p-4 space-y-3"}`}>
          {isCollapsed ? (
            <>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="relative w-9 h-9 rounded-full bg-[#0a4b32] text-[#c48b28] font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs border border-[#146c4a] group overflow-hidden"
                title={`Update profile photo - ${user.name}`}
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="w-9 h-9 rounded-lg bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div
                onClick={() => setIsPhotoModalOpen(true)}
                className="flex items-center gap-3 p-1.5 -m-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                title="Click to update profile photo"
              >
                <div className="relative w-9 h-9 rounded-full bg-[#0a4b32] text-[#c48b28] font-bold text-xs flex items-center justify-center shrink-0 border border-[#146c4a] overflow-hidden">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-[#e4a838] transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-white/50 truncate leading-tight mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/"
                  className="flex-1 text-[11px] font-medium text-white/70 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-lg border border-white/10 flex items-center justify-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-[#c48b28]" />
                  Website
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                  className="h-8 text-[11px] bg-red-600 hover:bg-red-700 text-white px-3 font-semibold shadow-xs cursor-pointer"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Sign Out
                </Button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* 2. Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#073825] text-white flex flex-col justify-between h-full z-10 p-4 sm:p-5">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#0a4b32]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#c48b28] text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block leading-tight">EduNova IMS</span>
                    <span className="text-[10px] text-[#c48b28] font-semibold">{currentRoleConfig.badge}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1 overflow-y-auto no-scrollbar max-h-[calc(100vh-180px)]">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-white/80 hover:bg-[#0a4b32] hover:text-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-[#c48b28]" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#c48b28] text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#0a4b32] space-y-2">
              <div className="flex items-center gap-2 px-1 text-xs">
                <div className="w-7 h-7 rounded-full bg-[#0a4b32] text-[#c48b28] font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="font-bold text-white truncate text-xs">{user.name}</p>
                  <p className="text-[10px] text-white/60 truncate">{user.email}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full h-8 text-xs bg-red-600 hover:bg-red-700 text-white justify-center shadow-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Wrapper (Fixed Header + Scrollable Main Content) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Role-Specific Individual Fixed Header */}
        {role === "STUDENT" ? (
          <StudentDashboardHeader
            user={user}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onOpenMobileNav={() => setMobileOpen(true)}
            /* onOpenPhotoModal */ onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
          />
        ) : role === "TEACHER" ? (
          <TeacherDashboardHeader
            user={user}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onOpenMobileNav={() => setMobileOpen(true)}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
          />
        ) : (
          <AdminDashboardHeader
            user={user}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            onOpenMobileNav={() => setMobileOpen(true)}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
          />
        )}

        {/* Scrollable Dashboard Body (Header NEVER scrolls away) */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Shared Profile Photo Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        user={user}
      />
    </div>
  );
}
