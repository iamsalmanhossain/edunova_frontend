"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
  showSummary?: boolean;
  itemLabel?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  className = "",
  showSummary = true,
  itemLabel = "students",
}: PaginationProps) {
  if (totalPages <= 1 && (!totalItems || totalItems <= pageSize)) {
    return null;
  }

  // Calculate items range for summary text
  const startItem = totalItems
    ? Math.min((currentPage - 1) * pageSize + 1, totalItems)
    : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems
    ? Math.min(currentPage * pageSize, totalItems)
    : currentPage * pageSize;

  // Build page numbers with desktop and mobile responsive visibility
  interface PageItem {
    key: string;
    value: number | "...";
    hideOnMobile?: boolean;
  }

  const getPageItems = (): PageItem[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => ({
        key: `page-${i + 1}`,
        value: i + 1,
      }));
    }

    const items: PageItem[] = [];
    const siblingCount = 1;
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 2;

    if (!showLeftDots && showRightDots) {
      // Near start: 1, 2, 3, 4, 5, ..., totalPages
      // On mobile, hide 4 and 5 so only 1, 2, 3, ..., totalPages show (fits in 230px)
      const count = Math.min(5, totalPages);
      for (let i = 1; i <= count; i++) {
        items.push({
          key: `page-${i}`,
          value: i,
          hideOnMobile: i > 3,
        });
      }
      items.push({ key: "dots-right", value: "..." });
      items.push({ key: `page-${totalPages}`, value: totalPages });
    } else if (showLeftDots && !showRightDots) {
      // Near end: 1, ..., totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
      items.push({ key: `page-1`, value: 1 });
      items.push({ key: "dots-left", value: "..." });
      for (let i = totalPages - 4; i <= totalPages; i++) {
        if (i > 1) {
          items.push({
            key: `page-${i}`,
            value: i,
            hideOnMobile: i < totalPages - 2,
          });
        }
      }
    } else {
      // In middle: 1, ..., left, current, right, ..., totalPages
      items.push({ key: `page-1`, value: 1 });
      items.push({ key: "dots-left", value: "..." });
      for (let i = leftSibling; i <= rightSibling; i++) {
        items.push({
          key: `page-${i}`,
          value: i,
          hideOnMobile: i !== currentPage,
        });
      }
      items.push({ key: "dots-right", value: "..." });
      items.push({ key: `page-${totalPages}`, value: totalPages });
    }

    return items;
  };

  const pageItems = getPageItems();

  return (
    <div
      className={`p-3.5 sm:p-5 border-t border-[#eef2ef] bg-[#fafbf9] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-300 ${className}`}
    >
      {/* Summary Info */}
      {showSummary && totalItems !== undefined && (
        <div className="text-[11px] sm:text-xs text-[#5a6b62] font-semibold order-2 sm:order-1 text-center sm:text-left">
          Showing <span className="font-extrabold text-[#0f1f17]">{startItem}–{endItem}</span> of{" "}
          <span className="font-extrabold text-[#0a4b32]">{totalItems}</span> {itemLabel}
        </div>
      )}

      {/* Pagination Controls - Never wraps on mobile */}
      <nav
        aria-label="Pagination"
        className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2 flex-nowrap justify-center max-w-full overflow-x-auto no-scrollbar py-0.5"
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-200 ${
            currentPage <= 1
              ? "bg-[#f4f7f5] text-slate-300 border border-[#e8ecea] cursor-not-allowed opacity-50"
              : "bg-[#f0f7f3] text-[#0a4b32] hover:bg-emerald-100 hover:text-[#073825] border border-[#d8e5dd] shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Buttons */}
        {pageItems.map((item) => {
          if (item.value === "...") {
            return (
              <span
                key={item.key}
                className="w-5 sm:w-8 h-8 sm:h-10 flex items-center justify-center text-[#5a6b62] font-black tracking-widest text-[11px] sm:text-xs select-none shrink-0"
              >
                ...
              </span>
            );
          }

          const pageNum = Number(item.value);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl items-center justify-center font-black text-xs shrink-0 transition-all duration-200 cursor-pointer ${
                item.hideOnMobile ? "hidden sm:inline-flex" : "inline-flex"
              } ${
                isActive
                  ? "bg-[#0a4b32] text-white shadow-sm shadow-[#0a4b32]/25 scale-100 ring-2 ring-[#0a4b32]/20"
                  : "bg-[#f0f7f3] text-[#0a4b32] hover:bg-emerald-100 hover:text-[#073825] border border-[#d8e5dd] shadow-2xs hover:scale-105 active:scale-95"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-200 ${
            currentPage >= totalPages
              ? "bg-[#f4f7f5] text-slate-300 border border-[#e8ecea] cursor-not-allowed opacity-50"
              : "bg-[#f0f7f3] text-[#0a4b32] hover:bg-emerald-100 hover:text-[#073825] border border-[#d8e5dd] shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}
