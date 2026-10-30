"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface DesktopNavigationProps {
  items: NavItem[];
}

export default function DesktopNavigation({ items }: DesktopNavigationProps) {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
      {items.map((item, index) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        if (item.children && item.children.length > 0) {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setOpenIndex(index)}
              onMouseLeave={() => setOpenIndex(null)}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-md transition-colors select-none",
                  isActive
                    ? "text-[#0a4b32] font-semibold bg-[#f0f7f3]"
                    : "text-[#0f1f17] hover:text-[#0a4b32] hover:bg-[#f0f7f3]"
                )}
              >
                <span>{item.name}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-[#5a6b62] transition-transform duration-200",
                    isOpen && "rotate-180 text-[#0a4b32]"
                  )}
                />
              </button>

              {isOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 xl:w-72 rounded-xl border border-[#e2e8e4] bg-white p-2 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                  role="menu"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#5a6b62] px-3 py-1.5 border-b border-[#e2e8e4]/60 mb-1">
                    {item.name} Catalog
                  </div>
                  {item.children.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setOpenIndex(null)}
                        role="menuitem"
                        className={cn(
                          "block rounded-lg px-3 py-2 text-left transition-colors",
                          isSubActive
                            ? "bg-[#f0f7f3] text-[#0a4b32]"
                            : "hover:bg-[#f0f7f3] text-[#0f1f17]"
                        )}
                      >
                        <div className="text-sm font-medium">{subItem.name}</div>
                        {subItem.description && (
                          <div className="text-xs text-[#5a6b62] mt-0.5 line-clamp-1">
                            {subItem.description}
                          </div>
                        )}
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
            className={cn(
              "px-3.5 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "text-[#0a4b32] font-semibold bg-[#f0f7f3]"
                : "text-[#0f1f17] hover:text-[#0a4b32] hover:bg-[#f0f7f3]"
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

