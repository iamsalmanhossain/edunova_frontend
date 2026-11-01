"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, LogIn, GraduationCap } from "lucide-react";
import { NavItem } from "@/config/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  items: NavItem[];
}

export default function MobileNavigation({ items }: MobileNavigationProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const closeMenu = () => {
    setOpen(false);
    setExpandedIndex(null);
  };

  return (
    <div className="lg:hidden flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#0f1f17] hover:text-[#0a4b32] hover:bg-[#f0f7f3] h-10 w-10"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-full max-w-[85vw] sm:max-w-xs p-0 flex flex-col justify-between bg-white"
        >
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
            {/* Header / Brand */}
            <SheetHeader className="text-left pb-4 border-b border-[#e2e8e4]">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0a4b32] flex items-center justify-center text-white shadow-xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-lg font-bold tracking-tight text-[#0a4b32]">
                      EduNova
                    </span>
                    <span className="block text-[10px] tracking-wider uppercase text-[#5a6b62] font-semibold -mt-1">
                      Digital Campus
                    </span>
                  </div>
                </Link>
              </div>
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
            </SheetHeader>

            {/* Navigation Links */}
            <nav className="py-4 space-y-1">
              {items.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const isExpanded = expandedIndex === index;

                if (item.children && item.children.length > 0) {
                  return (
                    <div key={item.name} className="py-1">
                      <button
                        type="button"
                        onClick={() => toggleExpand(index)}
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors text-left",
                          isActive
                            ? "bg-[#f0f7f3] text-[#0a4b32]"
                            : "text-[#0f1f17] hover:bg-[#f0f7f3]"
                        )}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-[#5a6b62] transition-transform duration-200",
                            isExpanded && "rotate-180 text-[#0a4b32]"
                          )}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-[#0a4b32]/20 ml-3 mt-1 animate-in fade-in-0 duration-150">
                          {item.children.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={closeMenu}
                                className={cn(
                                  "block px-3 py-2 text-xs font-medium rounded-md transition-colors",
                                  isSubActive
                                    ? "bg-[#0a4b32]/10 text-[#0a4b32] font-semibold"
                                    : "text-[#5a6b62] hover:text-[#0a4b32] hover:bg-[#f0f7f3]"
                                )}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors",
                      isActive
                        ? "bg-[#f0f7f3] text-[#0a4b32]"
                        : "text-[#0f1f17] hover:bg-[#f0f7f3]"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer CTAs */}
          <div className="p-6 border-t border-[#e2e8e4] bg-[#fcfdfc] space-y-3">
            <Button
              asChild
              className="w-full bg-[#0a4b32] hover:bg-[#073825] text-white font-semibold h-11"
            >
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-[#dce3df] text-[#0a4b32] hover:bg-[#f0f7f3] h-10"
            >
              <Link href="/register" onClick={closeMenu}>
                Create Student/Teacher Account
              </Link>
            </Button>
            <div className="text-center pt-1">
              <Link
                href="/admin/login"
                onClick={closeMenu}
                className="text-xs font-semibold text-[#5a6b62] hover:text-[#0a4b32]"
              >
                Administrator Portal Sign In →
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
