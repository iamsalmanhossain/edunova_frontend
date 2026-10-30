"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, LogIn } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import Container from "@/components/shared/Container";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          className="flex items-center gap-2 sm:gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4b32] rounded-lg p-0.5 sm:p-1 min-w-0"
        >
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#0a4b32] to-[#073825] flex items-center justify-center text-white shadow-sm ring-2 ring-[#0a4b32]/15 shrink-0">
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

        {/* Right Action: Sign In Button & Mobile Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Button
            asChild
            variant="default"
            size="sm"
            className="hidden sm:inline-flex bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold shadow-xs text-xs sm:text-sm h-9 sm:h-10 px-3.5 sm:px-4"
          >
            <Link href="/login" className="flex items-center gap-1.5">
              <LogIn className="w-4 h-4" />
              <span>Portal Sign In</span>
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

          {/* Mobile Navigation Drawer */}
          <MobileNavigation items={NAVIGATION_ITEMS} />
        </div>
      </Container>
    </header>
  );
}
