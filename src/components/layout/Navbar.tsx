"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn, LayoutDashboard, LogOut, ChevronDown, User as UserIcon } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import Container from "@/components/shared/Container";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { AuthUser } from "@/types/auth";

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return authService.getCurrentUser();
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-[#e2e8e4]"
          : "bg-white border-b border-[#e2e8e4]/80"
      )}
    >
      <Container size="wide" className="h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0 group py-1"
          aria-label="EduNova Digital Campus Home"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#0a4b32] flex items-center justify-center shadow-md shadow-[#0a4b32]/20 group-hover:scale-105 transition-all">
            <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-base sm:text-2xl font-extrabold tracking-tight text-[#0a4b32]">
                EduNova
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#fdf8ee] text-[#c48b28] border border-[#c48b28]/30">
                IMS
              </span>
            </div>
            <p className="hidden xs:block text-[10px] sm:text-xs font-medium text-[#5a6b62] tracking-wide -mt-0.5 truncate">
              Digital Campus Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNavigation items={NAVIGATION_ITEMS} />

        {/* Right Action: User Dropdown or Sign In Button & Mobile Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 p-1 pl-1 sm:pl-1.5 pr-2 rounded-full border border-[#dce3df] hover:border-[#0a4b32] bg-[#f7faf8] transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#0a4b32]/20 shadow-2xs"
                  aria-label="User Account Menu"
                >
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-[#0a4b32]/25">
                    {currentUser.avatarUrl ? (
                      <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    ) : null}
                    <AvatarFallback className="bg-[#0a4b32] text-white font-bold text-xs">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-[#0f1f17] leading-tight max-w-[110px] truncate">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-[#c48b28] uppercase tracking-wider leading-none">
                      {currentUser.role === "STUDENT"
                        ? "Student"
                        : currentUser.role === "TEACHER"
                        ? "Faculty"
                        : "Admin"}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#5a6b62]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 shadow-xl border-[#dce3df] rounded-xl bg-white z-50">
                <DropdownMenuLabel className="font-normal p-2 pb-2.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-bold text-[#0f1f17] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#5a6b62] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0f7f3] text-[#0a4b32] border border-[#dce3df] w-fit uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#e2e8e4]" />
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-xs font-semibold py-2">
                  <Link
                    href={authService.getRoleDashboardPath(currentUser.role)}
                    className="flex items-center gap-2 text-[#0f1f17] hover:text-[#0a4b32]"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#0a4b32]" />
                    <span>Go to Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#e2e8e4]" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg text-xs font-semibold py-2 text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="default"
                size="sm"
                className="hidden sm:inline-flex bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold shadow-xs text-xs sm:text-sm h-9 sm:h-10 px-3.5 sm:px-4"
              >
                <Link href="/login" className="flex items-center gap-1.5">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outlineGold"
                size="sm"
                className="hidden md:inline-flex text-xs h-9 sm:h-10 px-3 sm:px-3.5"
              >
                <Link href="/register">
                  <span>Register</span>
                </Link>
              </Button>
            </>
          )}

          {/* Mobile Navigation Drawer */}
          <MobileNavigation items={NAVIGATION_ITEMS} />
        </div>
      </Container>
    </header>
  );
}
