"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Server,
  UserCheck2,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { AuthUser } from "@/types/auth";

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
  return (
    <header className="h-16 shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2e8e4] px-3 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs select-none">
      {/* Left: Sidebar Toggle + Admin Console Identity */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
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
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-extrabold text-[#0f1f17] tracking-tight truncate">
                Admin Console
              </h1>
              <span className="hidden sm:inline-flex text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                Super Admin Clearance
              </span>
            </div>
            <p className="text-[10px] text-[#5a6b62] truncate">
              Kishoreganj Polytechnic Institute • Central Governance
            </p>
          </div>
        </div>
      </div>

      {/* Center: Server Status, Pending Approvals & Shift Balance */}
      <div className="hidden xl:flex items-center gap-2.5">
        {/* System & API Status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Server className="w-3.5 h-3.5 text-emerald-700" />
          <span>API v1 Online • 99.98% Uptime</span>
        </div>

        {/* Pending Teacher Approvals Alert */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[11px] font-bold text-amber-900">
          <UserCheck2 className="w-3.5 h-3.5 text-[#c48b28]" />
          <span>2 Faculty Registrations Pending</span>
        </div>

        {/* Shift Balance Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f4f7f5] border border-[#dce3df] text-[11px] text-[#5a6b62]">
          <CheckCircle2 className="w-3 h-3 text-[#0a4b32]" />
          <span>Dual Shift Sync Active</span>
        </div>
      </div>

      {/* Right: Security Alerts & Super Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Security Audit Bell */}
        <button
          type="button"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#f0f4f1] hover:bg-[#e4ece7] text-[#0f1f17] flex items-center justify-center transition-colors relative cursor-pointer"
          aria-label="Admin Security Alerts"
          title="Administrative Alerts (1 approval)"
        >
          <Bell className="w-4 h-4 text-[#5a6b62]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
        </button>

        {/* Admin Mini Avatar (Click to edit photo) */}
        <button
          type="button"
          onClick={onOpenPhotoModal}
          className="flex items-center gap-2 pl-2 border-l border-[#e2e8e4] text-left hover:opacity-85 transition-opacity cursor-pointer group"
          title="Click to update profile photo"
        >
          <div className="relative w-8 h-8 rounded-full bg-[#0a4b32] text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0 ring-2 ring-[#c48b28] overflow-hidden">
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
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              <Camera className="w-3.5 h-3.5 text-[#c48b28]" />
            </div>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[#0f1f17] leading-tight truncate max-w-[130px] group-hover:text-blue-700">
              {user.name}
            </p>
            <p className="text-[10px] text-blue-700 font-semibold leading-tight">
              {user.role}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
