"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Sparkles,
  Camera,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { AuthUser } from "@/types/auth";
import { authService } from "@/services/auth.service";

interface AdminDashboardHeaderProps {
  user: AuthUser;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobileNav: () => void;
  onOpenPhotoModal?: () => void;
}

export default function AdminDashboardHeader({
  user,
  isCollapsed,
  onToggleCollapse,
  onOpenMobileNav,
  onOpenPhotoModal,
}: AdminDashboardHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const roleLabel = isSuperAdmin ? "System Super Admin" : "Institutional Administrator";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authService.logout("/login");
  };

  return (
    <header className="h-16 shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2e8e4] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2.5 sm:gap-4 shadow-xs select-none relative">
      {/* Left: Sidebar Toggle + System Governance Identity */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1 sm:flex-initial overflow-hidden">
        {/* Desktop Sidebar Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-[#5a6b62] hover:text-[#0a4b32] hover:bg-[#f0f4f1] border border-[#dce3df]/80 transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-[#0a4b32]" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-[#5a6b62]" />
          )}
        </button>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg text-[#0f1f17] hover:bg-[#f0f4f1] cursor-pointer shrink-0"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Admin Crest */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-800 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-extrabold text-[#0f1f17] tracking-tight truncate">
                Admin Console
              </h1>
              <span className="hidden sm:inline-flex text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                {isSuperAdmin ? "Root Perimeter" : "Governance"}
              </span>
            </div>
            <p className="text-[10px] text-[#5a6b62] truncate">
              <span className="sm:hidden font-medium">KIPI • Governance</span>
              <span className="hidden sm:inline">Kishoreganj Polytechnic Institute • Institutional Administration</span>
            </p>
          </div>
        </div>
      </div>

      {/* Center: System Status Indicator */}
      <div className="hidden xl:flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f7f5] border border-[#dce3df] text-[11px] font-semibold text-[#0a4b32]">
          <Sparkles className="w-3.5 h-3.5 text-[#c48b28]" />
          <span>Governance Perimeter Active</span>
        </div>
      </div>

      {/* Right: Security Alerts & Super Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0" ref={dropdownRef}>
        {/* Security Alerts Bell */}
        <button
          type="button"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors relative cursor-pointer"
          aria-label="System Alerts"
          title="System Notifications"
        >
          <Bell className="w-4 h-4 text-[#5a6b62]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
        </button>

        {/* Super Admin Mini Avatar Menu Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-2 border-l border-[#e2e8e4] text-left hover:opacity-85 transition-opacity cursor-pointer group"
            title="User Profile Menu"
          >
            <div className="relative w-8 h-8 rounded-full bg-[#0a4b32] text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0 ring-2 ring-purple-500/20 overflow-hidden">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  sizes="32px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-[#0f1f17] leading-tight truncate max-w-[130px] group-hover:text-purple-800">
                {user.name}
              </p>
              <p className="text-[10px] text-purple-700 font-semibold leading-tight">
                {roleLabel}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-[#5a6b62] hidden md:block" />
          </button>

          {/* Profile Dropdown Popup */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#dce3df] p-2 z-50 animate-in fade-in duration-150">
              <div className="p-3 bg-[#fafbf9] rounded-xl border border-[#eef2ef] mb-2">
                <p className="text-xs font-bold text-[#0f1f17] truncate">{user.name}</p>
                <p className="text-[11px] text-[#5a6b62] truncate mt-0.5">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                  {roleLabel}
                </span>
              </div>

              <div className="space-y-1">
                <Link
                  href="/dashboard/admin/profile"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0f1f17] hover:bg-purple-50 hover:text-purple-900 rounded-lg transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#c48b28]" />
                  <span>View & Edit Profile</span>
                </Link>

                {onOpenPhotoModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPhotoModal();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#0f1f17] hover:bg-purple-50 hover:text-purple-900 rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <Camera className="w-4 h-4 text-[#c48b28]" />
                    <span>Change Profile Photo</span>
                  </button>
                )}

                <div className="pt-1 border-t border-[#f0f4f1]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
